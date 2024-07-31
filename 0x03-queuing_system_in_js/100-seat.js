// Reserve a seat
import { createClient } from 'redis';
import Keu from 'kue';
import { promisify } from 'util';
import express from 'express';

const client = createClient();
const app = express();
const queue = Keu.createQueue();
const PORT = 1245;
const HOST = 'localhost';
let reservationEnabled = true;

/**
 * reserve a seat
 * @param {int} number 
 */
function reserveSeat (number) {
  client.set('available_seats', number);
}

/**
 * get current available seats
 * @returns the current available seats
 */
async function getCurrentAvailableSeats () {
  const getAsync = promisify(client.get).bind(client);
  const availableSeats = await getAsync('available_seats');
  return Number(availableSeats);
}

// Get the number of available seats 
app.get('/available_seats', async (_req, res) => {
  const availableSeats = await getCurrentAvailableSeats();
  res.send({ numberOfAvailableSeats: availableSeats });
});

// Reserve a seat
app.get('/reserve_seat', async (_req, res) => {
  if (reservationEnabled === false) {
    res.send({ status: 'Reservation are blocked' });
    return;
  }
  res.send({ status: 'Reservation in process' });
  const reserveSeatJob = queue.create('reserve_seat', {}).save((_err) => {
    reserveSeatJob.on('complete', () => {
      console.log(`Seat reservation job ${reserveSeatJob.id} completed`);
    });
    reserveSeatJob.on('failed', (errorMessage) => {
      console.log(`Seat reservation job ${reserveSeatJob.id} failed: ${errorMessage}`);
    });
  });
});

// Process the seat reservation job
app.get('/process', async (_req, res) => {
  queue.process('reserve_seat', async (_job, done) => {
    let availableSeats = await getCurrentAvailableSeats();
    if (availableSeats <= 0) {
      done(Error('Not enough seats available'));
      return;
    }
    availableSeats -= 1;
    reserveSeat(availableSeats);
    done();
    if (availableSeats === 0) {
      reservationEnabled = false;
    }
  });
  res.send({ status: 'Queue processing' });
});

app.listen(PORT, HOST, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
});
