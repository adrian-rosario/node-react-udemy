import Queue from "bull";
import { ExpirationCompletePublisher } from "../events/publishers/publisher-expiration-complete";
import { natsWrapper } from "../nats/nats-wrapper";

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>("order:expiration", {
  // connect to redis server in pod...
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  // job has add'l data
  console.log("Expiration, job: ", job);
  console.log("Expiration, orderId: ", job.data.orderId);
  //
  new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId,
  });
});

export { expirationQueue };
