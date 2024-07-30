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
redisClient.hset('HolbertonSchools', 'Portland', '50', print);
redisClient.hset('HolbertonSchools', 'Seattle', '80', print);
redisClient.hset('HolbertonSchools', 'New York', '20', print);
redisClient.hset('HolbertonSchools', 'Bogota', '20', print);
redisClient.hset('HolbertonSchools', 'Cali', '40', print);
redisClient.hset('HolbertonSchools', 'Paris', '2', print);
redisClient.hgetall('HolbertonSchools', (err, value) => {
    console.log(value);
});
