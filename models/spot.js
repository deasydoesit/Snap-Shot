module.exports = function(sequelize, DataTypes) {
  var Spot = sequelize.define("Spot", {
    uploader_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true 
    }, 
    lat: {
        type: DataTypes.DECIMAL(10,7),
        allowNull: false //need to change later
    }, 
    lng: {
        type: DataTypes.DECIMAL(10,7),
        allowNull: false //need to change later
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
    }
  });

  return Spot;
  
};