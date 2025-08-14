const Sequelize = require('sequelize');
const config = require(__dirname + '/../config/config.js')['development'];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

// Importar todos os modelos
db.Okr = require('./okr')(sequelize, Sequelize.DataTypes);
db.KeyResult = require('./key_result')(sequelize, Sequelize.DataTypes);
db.Comment = require('./comment')(sequelize, Sequelize.DataTypes);
db.User = require('./user')(sequelize, Sequelize.DataTypes);
db.Profile = require('./profile')(sequelize, Sequelize.DataTypes);
db.Notification = require('./notification')(sequelize, Sequelize.DataTypes);

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;