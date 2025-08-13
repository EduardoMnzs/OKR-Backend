module.exports = (sequelize, DataTypes) => {
  const Profile = sequelize.define('Profile', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    first_name: {
      type: DataTypes.TEXT
    },
    last_name: {
      type: DataTypes.TEXT
    }
  }, {
    tableName: 'profiles'
  });

  Profile.associate = (models) => {
    Profile.belongsTo(models.User, {
      foreignKey: 'id',
      as: 'user'
    });
  };

  return Profile;
};