// Let's use the client to store a hash value
import { createClient, print } from 'redis';

const redisClient = createClient();

redisClient.on('connect', () => {
  console.log('Redis client connected to the server');
});

redisClient.on('error', (error) => {
  console.error(`Redis client not connected to the server: ${error.message}`);
  redisClient.quit();
});

// Store a hash value
redisClient.hSet('HolbertonSchools', 'Portland', '50', print);
redisClient.hSet('HolbertonSchools', 'Seattle', '80', print);
redisClient.hSet('HolbertonSchools', 'New York', '20', print);
redisClient.hSet('HolbertonSchools', 'Bogota', '20', print);
redisClient.hSet('HolbertonSchools', 'Cali', '40', print);
redisClient.hSet('HolbertonSchools', 'Paris', '2', print);
redisClient.hGetAll('HolbertonSchools', (err, value) => {
    console.log(value);
});
