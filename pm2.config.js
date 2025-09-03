module.exports = {
  apps: [
    {
      name: 'partner-mock-a',
      script: 'dist/main.js',
      env: {
        PORT: 3000,
        PARTNER: 'A',
        REDIS_HOST: 'localhost',
        REDIS_PORT: 6379,
        REDIS_PASSWORD: '',
      },
    },
    {
      name: 'partner-mock-b',
      script: 'dist/main.js',
      env: {
        PORT: 3001,
        PARTNER: 'B',
        REDIS_HOST: 'localhost',
        REDIS_PORT: 6379,
        REDIS_PASSWORD: '',
      },
    },
    {
      name: 'partner-mock-c',
      script: 'dist/main.js',
      env: {
        PORT: 3002,
        PARTNER: 'C',
        REDIS_HOST: 'localhost',
        REDIS_PORT: 6379,
        REDIS_PASSWORD: '',
      },
    },
    {
      name: 'partner-mock-d',
      script: 'dist/main.js',
      env: {
        PORT: 3003,
        PARTNER: 'D',
        REDIS_HOST: 'localhost',
        REDIS_PORT: 6379,
        REDIS_PASSWORD: '',
      },
    },
  ],
};
