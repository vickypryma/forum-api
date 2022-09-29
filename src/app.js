require('dotenv').config();
const fs = require('fs');
const createServer = require('./Infrastructures/http/createServer');
const container = require('./Infrastructures/container');

(async () => {
  const server = await createServer(container);

  if (process.env.DYNO) {
    fs.openSync('/tmp/app-initialized', 'w');
  }
  await server.start();
  console.log(`server start at ${server.info.uri}`);
})();
