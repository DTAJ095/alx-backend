// Create the Job creator
// The job creator will create a job and add it to the queue

import Keu from 'kue';

const queue = Keu.createQueue();
const jobData = {
    phoneNumber: '+237690725411',
    message: 'Hello, this is a test message!'
};

const job = queue.create('push_notification_code', jobData).save((err) => {
    if (!err) console.log(`Notification job created: ${job.id}`);
});

job.on('complete', () => {
    console.log('Notification job completed');
});

job.on('failed', () => {
    console.log('Notification job failed');
});
