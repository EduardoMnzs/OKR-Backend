module.exports = (sequelize, DataTypes) => {
  const KeyResult = sequelize.define('KeyResult', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    target: {
      type: DataTypes.NUMERIC,
    },
    unit: {
      type: DataTypes.TEXT,
    },
    current_value: {
      type: DataTypes.NUMERIC,
      defaultValue: 0,
    },
    okr_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
    },
  }, {
    tableName: 'key_results',
  });

  KeyResult.associate = (models) => {
    // Um Key Result pertence a um OKR
    KeyResult.belongsTo(models.Okr, {
      foreignKey: 'okr_id',
      as: 'okr',
    });
  };

  return KeyResult;
};