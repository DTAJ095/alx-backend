import Keu from 'kue';
import createPushNotificationsJobs from './8-job';
import { expect } from 'chai';
import { spy } from 'sinon';

describe('createPushNotificationsJobs', () => {
  const queue = Keu.createQueue();
  before(() => {
    queue.testMode.enter();
  });
  afterEach(() => {
    queue.testMode.clear();
  });
  after(() => {
    queue.testMode.exit();
  });

  it('validates job creation', () => {
    const spyConsole = spy(console, 'log');
    const jobs = [
      {
        phoneNumber: '4153518780',
        message: 'This is the code 1234 to verify your account'
      }
    ];
    createPushNotificationsJobs(jobs, queue);
    expect(queue.testMode.jobs.length).to.equal(1);
    expect(spyConsole.calledOnceWith('Notification job created: 1')).to.be.true;
  });
  it('validates job creation with multiple jobs', () => {
    const spyConsole = spy(console, 'log');
    const jobs = [
      {
        phoneNumber: '4153518780',
        message: 'This is the code 1234 to verify your account'
      },
      {
        phoneNumber: '4153518781',
        message: 'This is the code 4562 to verify your account'
      }
    ];
    createPushNotificationsJobs(jobs, queue);
    expect(queue.testMode.jobs.length).to.equal(2);
    expect(spyConsole.firstCall.calledWith('Notification job created: 1')).to.be.true;
    expect(spyConsole.secondCall.calledWith('Notification job created: 2')).to.be.true;
  });
  it('Throws an error when jobs is not an array', () => {
    const spyConsole = spy(console, 'error');
    createPushNotificationsJobs({}, queue);
    expect(spyConsole.calledOnceWith('Jobs is not an array')).to.be.true;
  });
});
