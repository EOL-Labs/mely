module.exports = function(sequelize, DataTypes) {
    var Post = sequelize.define("Post", {
		title: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		content: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		}
    }, {
        freezeTableName: true
    });
    return Post;
};
