// Create the Job processor
import Keu from 'kue';

const queue = Keu.createQueue();

/**
 * Send a notification to a given phone number
 * @param {string} phoneNumber
 * @param {string} message
 */
function sendNotification (phoneNumber, message) {
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
}

queue.process('push_notification_code', (job, done) => {
  sendNotification(job.data.phoneNumber, job.data.message);
  done();
});
