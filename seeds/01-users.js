
exports.seed = function(knex) {
  // 00-cleanup.js already cleaned out all tables

  const users = [
    {
      username: "Diddleslip",
      password: "Helloworld123"
    },
    {
      username: "Itsme",
      password: "cantguessthispassword"
    },
    {
      username: "testuser",
      password: "testpassword"
    },
  ];
  return knex("users").insert(users);
};
