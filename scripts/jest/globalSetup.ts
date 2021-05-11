// eslint-disable-next-line import/no-extraneous-dependencies
import dotenv from 'dotenv';

export default function setup() {
  dotenv.config({ path: '.env.test' });
}
