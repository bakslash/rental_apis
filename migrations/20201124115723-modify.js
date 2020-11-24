'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    queryInterface.addColumn(
      'tokens', // table name
      'user_id', // new field name
      {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    );
    queryInterface.addColumn(
      'tokens', // table name
      'token', // new field name
      {
        type: Sequelize.STRING,
        allowNull: false,
      },
    );
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
