const { Kafka } = require('kafkajs');
const fs = require('fs');

const kafka = new Kafka({
  clientId: 'video-producer',
  brokers: ['localhost:9092']
});

const producer = kafka.producer();

async function sendVideoChunks() {
  await producer.connect();

  const stream = fs.createReadStream('./sample.mp4', { highWaterMark: 64 * 1024 }); // 64KB chunks

  for await (const chunk of stream) {
    await producer.send({
      topic: 'video-stream',
      messages: [{ value: chunk }]
    });
    console.log('Sent chunk');
  }

  await producer.disconnect();
  console.log('Finished streaming video');
}

sendVideoChunks().catch(console.error);
