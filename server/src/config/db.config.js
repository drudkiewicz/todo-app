import "dotenv/config";

import { Sequelize } from "sequelize";
import ToDoModel from "./db-models/todo.model";

const connectionString = `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/postgres`;

const sequelize = new Sequelize(connectionString);

const modelDefiners = [ToDoModel];

for (const modelDefiner of modelDefiners) {
  modelDefiner(sequelize);
}

export async function assertDatabaseConnectionOk() {
  console.log(`Checking database connection...`);
  try {
    await sequelize.authenticate();
    console.log("Database connection OK!");
  } catch (error) {
    console.log("Unable to connect to the database:");
    console.log(error.message);
    process.exit(1);
  }

  await sequelize.sync();
}

export default sequelize;
