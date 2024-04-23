import nats, { Stan } from "node-nats-streaming";

class NatsWrapper {
  private _client?: Stan; // ? undefined for some period of time

  // getters in TS
  get client() {
    if (!this._client) {
      throw new Error("cannot access nats client before connecting");
    }
    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise<void>((resolve, reject) => {
      this.client.on("connect", () => {
        console.log("connected to NATS singleton");

        resolve();
      });

      this.client.on("error", (theError) => {
        reject(theError);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
