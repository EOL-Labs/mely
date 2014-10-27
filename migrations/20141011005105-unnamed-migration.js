module.exports = {
	up: function(migration, DataTypes, done) {
		migration.addColumn(
			"Page",
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