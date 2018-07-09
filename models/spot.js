module.exports = function(sequelize, DataTypes) {
  var Spot = sequelize.define("Spot", {
    location: {
      type: DataTypes.STRING,
      allowNull: true 
    }, 
    lat: {
        type: DataTypes.DECIMAL(10,7),
        allowNull: false 
    }, 
    lng: {
        type: DataTypes.DECIMAL(10,7),
        allowNull: false 
    }, 
    path: {
      type: DataTypes.STRING,
      allowNull: false 
    },
    historical: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    vista: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    street_art: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    trendy: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    nature: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    tod: {
      type: DataTypes.STRING,
      allowNull: false
    },
    popularity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  Spot.associate = function(models) {
    Spot.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Spot;
  
};