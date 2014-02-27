module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define("User", {
		email: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		password: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		status: {
			type: DataTypes.INTEGER,
			allowNull: false
		}
    }, {
        freezeTableName: true
    });
    return User;
};
