const nodeFetch = require('node-fetch');

const availableFetch = {
  fetch: nodeFetch,
  currentEnvironment: 'node',
};

module.exports = availableFetch;
