module.exports = function(sequelize, DataTypes) {
    var Status = sequelize.define("Status", {
		status_name: {
			type: DataTypes.STRING(50),
			allowNull: false
		}
    }, {
        freezeTableName: true
    });
    return Status;
};
