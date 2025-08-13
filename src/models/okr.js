module.exports = (sequelize, DataTypes) => {
  const Okr = sequelize.define('Okr', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    responsible: {
      type: DataTypes.TEXT,
    },
    due_date: {
      type: DataTypes.DATE,
    },
    status: {
      type: DataTypes.TEXT,
      defaultValue: 'on-track',
    },
    user_id: {
      type: DataTypes.UUID,
    },
  }, {
    tableName: 'okrs',
  });

Okr.associate = (models) => {
  Okr.hasMany(models.KeyResult, {
    foreignKey: 'okr_id',
    as: 'keyResults',
  });
  Okr.hasMany(models.Comment, {
    foreignKey: 'okr_id',
    as: 'comments',
  });
};

  return Okr;
};