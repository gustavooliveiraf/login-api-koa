'use strict';
module.exports = (sequelize, DataTypes) => {
  const Phone = sequelize.define('Phone', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: {
          schema: 'security',
          tableName: 'Users'
        },
        key: 'id',
        as: 'user',
      }
    },
    numero: {
      type: DataTypes.BIGINT
    },
    ddd: {
      type: DataTypes.INTEGER
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    schema: 'register'
  });
  Phone.associate = function(models) {
    // associations can be defined here
  };
  return Phone;
};