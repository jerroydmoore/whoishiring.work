if (process.env.LOAD_ENV_FILE) {
  require('dotenv').config({ path: '../.env' });
}

require('./index').main();
