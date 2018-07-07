module.exports = function(sequelize, DataTypes) {
  var Spot = sequelize.define("Spot", {
    uploader_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true //need to change later
    }, 
    path: {
      type: DataTypes.STRING,
      allowNull: false //need to change later
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