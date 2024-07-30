// Track progress and errors with Kue: Create a job processor
import Keu from 'kue';

const queue = Keu.createQueue();

const blackList = ['4153518780', '4153518781'];

/**
 * 
 * @param {string} phoneNumber - phone number
 * @param {string} message - push notification message
 * @param {import ('kue').job} job - queue job
 * @param {import('kue').DoneCallback} done - callback
 * @returns {void}
 */
function sendNotification(phoneNumber, message, job, done) {
    job.progress(0, 100);
    if (blackList.includes(phoneNumber)) {
        done(Error(`Phone number ${phoneNumber} is blacklisted`));
        return;
    }
    job.progress(50, 100);
    console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
    done();
}

queue.process('push_notification_code', (job, done) => {
    sendNotification(job.data.phoneNumber, job.data.message, job, done);
});
