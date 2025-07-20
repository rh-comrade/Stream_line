const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { Kafka } = require('kafkajs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const kafka = new Kafka({
  clientId: 'video-client',
  brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'video-group' });

async function startKafka() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'video-stream', fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const chunk = message.value;

      // Broadcast to all WebSocket clients
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(chunk);
        }
      });
    }
  });
}

startKafka().catch(console.error);

wss.on('connection', ws => {
  console.log('WebSocket client connected');
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

server.listen(8081, () => {
  console.log('Server running at http://localhost:8081');
});
