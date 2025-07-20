// videoConsumer.js
const { Kafka } = require('kafkajs');
const WebSocket = require('ws');

const kafka = new Kafka({ clientId: 'video-client', brokers: ['localhost:9092'] });
const consumer = kafka.consumer({ groupId: 'video-group' });

const wss = new WebSocket.Server({ port: 8089 });

let sockets = [];

wss.on('connection', socket => {
  sockets.push(socket);
  console.log('Client connected');
});

async function startConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'video-stream', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      sockets.forEach(sock => {
        sock.send(message.value);
      });
    }
  });
}

startConsumer();
