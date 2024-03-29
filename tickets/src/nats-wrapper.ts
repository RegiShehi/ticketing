import nats, { Stan } from 'node-nats-streaming';

class NatsWrapper {
  static instance: NatsWrapper;
  private _client?: Stan;

  private constructor() {}

  get client() {
    if (!this._client) {
      throw new Error('Cannot access NATS client before connecting');
    }

    return this._client;
  }

  public static getInstance(): NatsWrapper {
    if (!NatsWrapper.instance) {
      NatsWrapper.instance = new NatsWrapper();
    }

    return NatsWrapper.instance;
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise<void>((resolve, reject) => {
      this.client.on('connect', () => {
        console.log('Connected to NATS');

        resolve();
      });

      this.client.on('error', (err) => {
        reject(err);
      });
    });
  }
}

export const natsWrapper = NatsWrapper.getInstance();
