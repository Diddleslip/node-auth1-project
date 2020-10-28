const cleaner = require("knex-cleaner");

exports.seed = function(knex) {
  return cleaner
    .clean(knex, {
      model: "delete",
      restartIdentity: true, // ask PostgreSQL to reset the Primary Keys back to 0
      ignoreTables: ["knex_migrations", "knex_migrations_lock"],
    })
    .then(() => console.log("\n== All tables truncated, ready to seed ==\n"))
}