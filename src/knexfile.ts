import path from "path";

export default {

  development: {
    client: "sqlite3",
    useNullAsDefault: true,
    connection: {
      filename: path.join(__dirname, "app", "database", "database.sqlite")
    },
    migrations: {
      directory: path.join(__dirname, "app", "database", "migrations")
    },
    seeds: {
      directory: path.join(__dirname, "app", "database", "seeds")
    },
  },

  test: {
    client: "sqlite3",
    connection: ":memory:",
    useNullAsDefault: true,
    migrations: {
      directory: path.join(__dirname, "app", "database", "migrations")
    },
    seeds: {
      directory: path.join(__dirname, "app", "database", "seeds")
    }
  },

}