const { Client } = require('pg');

async function createDatabaseIfNotExists(dbname) {
  let pg;
  try {
    // must connect to maintenance db in case $dbname database does not exist
    pg = new Client({ database: 'postgres' });
    await pg.connect();

    const res = await pg.query(`SELECT FROM pg_database WHERE datname = '${dbname}'`);

    const exists = res.rowCount !== 0;
    console.log(`Database "${dbname}" already exist? ${exists}`);

    if (!exists) {
      await pg.query(`CREATE DATABASE ${dbname}`);
    }
  } finally {
    if (pg) {
      await pg.end();
      pg = undefined;
    }
  }
}

async function createUserIfNotExists(pg, name, password, roles = []) {
  const res = await pg.query('SELECT FROM pg_user WHERE usename = $1', [name]);

  const exists = res.rowCount !== 0;
  console.log(`User "${name}" already exists? ${exists}`);

  if (!exists) {
    await pg.query(`CREATE USER ${name} WITH ${roles.join(' ')} PASSWORD '${password}'`);
  }
}

async function createTableIfNotExists(pg, name, fields) {
  const res = await pg.query('SELECT FROM pg_tables WHERE tablename = $1', [name]);

  const exists = res.rowCount !== 0;
  console.log(`Table "${name}" already exists? ${exists}`);

  if (!exists) {
    await pg.query(`CREATE TABLE "${name}" (${fields})`);
  }
}

function dropTable(pg, name) {
  console.log(`Dropping table "${name}"...`);
  return pg.query(`DROP TABLE IF EXISTS ${name}`);
}

module.exports.main = async function main() {
  let pg;
  const dbname = process.env.PGDATABASE;

  await createDatabaseIfNotExists(dbname);

  try {
    console.log(`Connecting to database "${dbname}"...`);
    pg = new Client();
    await pg.connect();

    await createUserIfNotExists(pg, process.env.DB_USER, process.env.DB_USER_PASSWORD);

    if (process.env.DROP_TABLES) {
      await dropTable(pg, 'whoishiring_posts');
      await dropTable(pg, 'whoishiring_stories');
    }

    await createTableIfNotExists(
      pg,
      'whoishiring_stories',
      `id INTEGER PRIMARY KEY,
      "label" varchar(40) NOT NULL,
      "postedDate" TIMESTAMP NOT NULL,
      "createdAt" TIMESTAMP NOT NULL,
      "updatedAt" TIMESTAMP NOT NULL`
    );

    await createTableIfNotExists(
      pg,
      'whoishiring_posts',
      `id INTEGER PRIMARY KEY,
      "author" varchar(50) NOT NULL,
      "body" text NOT NULL,
      "storyId" INTEGER REFERENCES "whoishiring_stories"("id") ON DELETE RESTRICT NOT NULL,
      "remoteFlag" BOOL NOT NULL,
      "onsiteFlag" BOOL NOT NULL,
      "internsFlag" BOOL NOT NULL,
      "visaFlag" BOOL NOT NULL,
      "postedDate" timestamp NOT NULL,
      "createdAt" TIMESTAMP NOT NULL,
      "updatedAt" TIMESTAMP NOT NULL`
    );

    // TODO delete after executing once
    await pg.query('ALTER TABLE "whoishiring_stories" ALTER COLUMN label TYPE varchar(40);');

    // allow RW on tables for the DB_USER
    await pg.query(
      ['whoishiring_stories', 'whoishiring_posts']
        .map((x) => `GRANT ALL PRIVILEGES ON ${x} TO ${process.env.DB_USER}`)
        .join(';')
    );
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    if (pg) {
      console.log(`Closing database "${dbname}"...`);
      pg.end();
      pg = undefined;
    }
  }

  console.log('Done!');
};
