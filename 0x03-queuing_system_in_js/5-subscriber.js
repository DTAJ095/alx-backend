// Node Redis client publisher and subscriber
import { createClient } from 'redis';

const redisClient = createClient();

redisClient.on('connect', () => {
  console.log('Redis client connected to the server');
});

redisClient.on('error', (error) => {
  console.error(`Redis client not connected to the server: ${error.message}`);
  redisClient.quit();
});

redisClient.subscribe('holberton school channel');

redisClient.on('message', (channel, message) => {
  console.log(message);
  if (message === 'KILL_SERVER') {
    redisClient.unsubscribe(channel);
    redisClient.quit();
  }
});
