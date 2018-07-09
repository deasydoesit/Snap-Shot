module.exports = function (sequelize, DataTypes) {
    var Spots = sequelize.define("Spots", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        uploader_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                // This is a reference to another model
                model: Users,

                // This is the column name of the referenced model
                key: 'id',
            }
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        historical: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        vista: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        streetart: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        trendy: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        nature: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        ToD: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        popularity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
    });
    return Spots;
}