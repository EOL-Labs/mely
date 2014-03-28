module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define("User", {
		email_address: {
			type: DataTypes.STRING(100),
			allowNull: false
		},
		password: {
			type: DataTypes.STRING(100),
			allowNull: false
		},
		user_status: {
			type: DataTypes.BOOLEAN,
			allowNull: false
		}
    }, {
        freezeTableName: true
    });
    return User;
};
