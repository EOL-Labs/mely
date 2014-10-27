module.exports = {
	up: function(migration, DataTypes, done) {
		migration.addColumn(
			"Post",
			"deleted",
			{
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false
			}
		);
		done();
	},
};