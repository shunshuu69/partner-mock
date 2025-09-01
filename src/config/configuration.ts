export interface AppConfig {
  database: {
    pg: {
      host: string;
      port: number;
      user: string;
      password: string;
      database: string;
    };
  };
  rabbitmq: {
    url: string;
    queue: string;
  };
  // jwt: {
  //   secret: string;
  //   expiresIn: string;
  // };
  // crypto: {
  //   keyBase64: string;
  // };
}

export default function configuration(): AppConfig {
  return {
    database: {
      pg: {
        host: process.env.PG_DB_HOST ?? 'localhost',
        port: Number(process.env.PG_DB_PORT ?? 5432),
        user: process.env.PG_DB_USER ?? 'postgres',
        password: process.env.PG_DB_PASSWORD ?? 'postgres',
        database: process.env.PG_DB_NAME ?? 'appdb',
      },
    },
    rabbitmq: {
      url:
        process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672',
      queue: process.env.RABBITMQ_QUEUE ?? 'callback',
    },
    // jwt: {
    //   secret: process.env.JWT_SECRET ?? 'devsecret',
    //   expiresIn: process.env.JWT_EXPIRES ?? '15m',
    // },
    // crypto: {
    //   keyBase64: process.env.CRYPTO_ENC_KEY ?? '',
    // },
  };
}
