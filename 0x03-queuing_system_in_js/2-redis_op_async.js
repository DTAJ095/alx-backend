// Redis client

import { createClient, print } from 'redis';
import { promisify } from 'util';
const redisClient = createClient();


/**
 * Set in Redis the value of the key schoolName
 * @param {string} schoolName
 * @param {string} value
 */
function setNewSchool (schoolName, value) {
  redisClient.set(schoolName, value, print);
}

/**
 * log to the console the value for the key schoolName
 * @param {string} schoolName
 */
async function displaySchoolValue (schoolName) {
  const getAsync = promisify(redisClient.get).bind(redisClient);
  console.log(await getAsync(schoolName));
}

/**
 * Main entry point
 */
async function main () {
  await displaySchoolValue('Holberton');
  setNewSchool('HolbertonSanFrancisco', '100');
  await displaySchoolValue('HolbertonSanFrancisco');
}

redisClient.on('connect', () => {
  console.log('Redis client connected to the server');
  main();
});

redisClient.on('error', (error) => {
  console.error(`Redis client not connected to the server: ${error.message}`);
  redisClient.quit();
});
