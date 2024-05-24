const debug = require('debug')('app:db');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.PGDATABASE, process.env.DB_USER, process.env.DB_USER_PASSWORD, {
  host: process.env.PGHOST,
  dialect: 'postgres',

  // see: https://github.com/sequelize/sequelize/issues/8615
  // eslint-disable-next-line no-console
  logging: debug.enabled && console.log,
});

const db = {
  posts: require('./posts')(sequelize, Sequelize),
  stories: require('./stories')(sequelize, Sequelize),
  sequelize,
};

db.posts.belongsTo(db.stories, { as: 'story', foreignKey: 'storyId' });

module.exports = db;
