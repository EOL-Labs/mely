module.exports = {
	up: function(migration, DataTypes, done) {
		migration.removeColumn("Post", "StatuId");
		migration.removeColumn("Page", "StatuId");
		migration.addColumn(
			"Post",
			"status",
			{
				type: DataTypes.INTEGER,
				allowNull: false
			}
		);
		migration.addColumn(
			"Page",
			"status",
			{
				type: DataTypes.INTEGER,
				allowNull: false
			}
		);
		migration.dropTable("Status");
		done();
	},
};