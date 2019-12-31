module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'whoishiring_posts',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      author: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      // automatically added with db.posts.belongsTo(db.topics) statement
      // storyId: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      // },
      postedDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      remoteFlag: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      onsiteFlag: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      internsFlag: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      visaFlag: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      // no options
    }
  );
