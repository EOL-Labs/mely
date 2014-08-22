module.exports = function(sequelize, DataTypes) {
    var Comment = sequelize.define("Comment", {
		email: {
			type: DataTypes.STRING(100),
			allowNull: false
		},
		content: {
			type: DataTypes.STRING(4000),
			allowNull: false
		},
		approved: {
			type: DataTypes.BOOLEAN,
			allowNull: false
		},
		upvote: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0
		},
		downvote: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0
		}
    }, {
        freezeTableName: true
    });
    return Comment;
};
