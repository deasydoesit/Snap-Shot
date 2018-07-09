module.exports = function(sequelize, DataTypes) {
    var Favorite = sequelize.define("Favorite", {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      spot_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    });

    Favorite.associate = function(models) {
      Favorite.belongsTo(models.User, {
        foreignKey: {
          allowNull: false
        }
      });
    };

  return Favorite;
}