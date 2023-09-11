const mqtt = require('mqtt');
const zlib = require('zlib');

const brokerAddress = 'mqtt://10.37.129.2:61616'; 
const username = 'admin'; 
const password = 'admin'; 
const topicName = 'test/mqtt'; 

const client = mqtt.connect(brokerAddress, {
  username,
  password,
  clientId: 'mqtt-receiver', // Set a unique client ID
});

client.on('connect', () => {
  console.log('Connected to MQTT broker');

  client.subscribe(topicName, (err) => {
    if (!err) {
      console.log(`Subscribed to topic: ${topicName}`);
    }
  });
});

client.on('message', (topic, message) => {
  console.log(`Received message on topic: ${topic}`);

  // Decompress the received data
  zlib.gunzip(message, (err, decompressedData) => {
    if (!err) {
      const jsonData = decompressedData.toString();
      console.log('Decompressed JSON data:');
      console.log(jsonData);

      // Parse
     
    } else {
      console.error('Error decompressing data:', err);
    }
  });
});

client.on('error', (err) => {
  console.error('MQTT error:', err);
});

// Handle MQTT client disconnect
client.on('close', () => {
  console.log('Disconnected from MQTT broker');
});

// Handle MQTT client errors
client.on('error', (error) => {
  console.error('MQTT error:', error);
});
