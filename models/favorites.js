module.exports = function(sequelize, DataTypes) {
    var Favorites = sequelize.define("Favorites", {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      spot_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            // This is a reference to another model
            model: Spots,
       
            // This is the column name of the referenced model
            key: 'id',
        }
      }
    });
    return Favorites;
}