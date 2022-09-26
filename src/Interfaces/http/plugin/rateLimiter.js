/* istanbul ignore file */
const Boom = require('@hapi/boom');
const { RateLimiterRedis } = require('rate-limiter-flexible');
const redis = require('redis');

const redisClient = redis.createClient({
  enable_offline_queue: false,
  socket: {
    host: process.env.REDIS_SERVER,
  },
});

redisClient.on('error', (error) => {
  console.error(error);
});

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  points: 90,
  duration: 60,
});

module.exports = {
  name: 'rateLimiter',
  register: async (server, { paths }) => {
    server.ext('onPreAuth', async (request, h) => {
      const currentPath = request.path.split('/')[1];

      if (paths.includes(currentPath)) {
        try {
          await rateLimiter.consume(request.info.remoteAddress);
          return h.continue;
        } catch (rej) {
          let error;
          if (rej instanceof Error) {
            error = Boom.internal('Try later');
          } else {
            error = Boom.tooManyRequests('Rate limit exceeded');
            error.output.headers['Retry-After'] = Math.round(rej.msBeforeNext / 1000) || 1;
          }

          return error;
        }
      }

      return h.continue;
    });
  },
};
