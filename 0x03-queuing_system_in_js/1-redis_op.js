// Redis client

import { createClient, print } from 'redis';

const redisClient = createClient();

redisClient.on('connect', () => {
  console.log('Redis client connected to the server');
});

redisClient.on('error', (error) => {
  console.error(`Redis client not connected to the server: ${error.message}`);
  redisClient.quit();
});

/**
 * Set in Redis the value of the key schoolName
 * @param {string} schoolName 
 * @param {string} value 
 */
function setNewSchool(schoolName, value) {
  redisClient.set(schoolName, value, print);
}

/**
 * log to the console the value for the key schoolName
 * @param {string} schoolName 
 */
function displaySchoolValue(schoolName) {
  redisClient.get(schoolName, print);
}

displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
