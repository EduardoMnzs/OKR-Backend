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
    // Um Profile pertence a um User
    Profile.belongsTo(models.User, {
      foreignKey: 'id', // Usa 'id' do perfil como a chave estrangeira
      as: 'user'
    });
  };

  return Profile;
};