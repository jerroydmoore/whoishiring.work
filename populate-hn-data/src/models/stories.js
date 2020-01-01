module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'whoishiring_stories',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      label: {
        type: DataTypes.STRING(14),
        allowNull: false,
      },
      postedDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      // no options
    }
  );
