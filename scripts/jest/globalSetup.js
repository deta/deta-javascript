/* eslint import/no-extraneous-dependencies: ["error", {"peerDependencies": true}] */
const dotenv = require('dotenv');

module.exports = async () => {
  dotenv.config({ path: '.env.test' });
};
