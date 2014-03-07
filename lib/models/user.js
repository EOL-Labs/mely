module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define("User", {
		email_address: {
			type: DataTypes.STRING(100)
		},
		password: {
			type: DataTypes.STRING(100)
		},
		user_status: {
			type: DataTypes.BOOLEAN
		}
    }, {
        freezeTableName: true
    });
    return User;
};
