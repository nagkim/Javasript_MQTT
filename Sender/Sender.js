const mqtt = require('mqtt');
const zlib = require('zlib');

const brokerAddress = 'mqtt://10.37.129.2:61616';
const username = 'admin';
const password = 'admin';
const topicName = 'test/mqtt';
const arraySize = 10;

// Create an MQTT client
const client = mqtt.connect(brokerAddress, {
  username: username,
  password: password,
});

// Handle the client's connect event
client.on('connect', () => {
  console.log('Connected to MQTT broker');

 
  const jsonMessage = {
    intArray: new Array(arraySize).fill(0).map((_, i) => i + 1),
    floatArray: new Array(arraySize).fill(0).map((_, i) => i + 1),
    stringArray: new Array(arraySize).fill(0).map(() => generateRandomString(10)),
  };

  // Convert JSON to a string
  const jsonData = JSON.stringify(jsonMessage);

  // Compress the JSON data using zlib
  zlib.gzip(jsonData, (err, compressedData) => {
    if (err) {
      console.error('Error compressing data:', err);
      client.end();
      return;
    }

    // Publish the zipped data to the MQTT topic
    client.publish(topicName, compressedData, { qos: 0 }, () => {
      console.log('JSON data sent');

     
      setTimeout(() => {
        client.end();
      }, 2000);
    });
  });
});

// Handle errors
client.on('error', (error) => {
  console.error('MQTT client error:', error);
});

function generateRandomString(length) {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
