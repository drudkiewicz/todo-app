import "dotenv/config";
import express from "express";
import helmet from "helmet";
import bodyParser from "body-parser";

import { assertDatabaseConnectionOk } from "./config/db.config";
import apiRoutes from "./routes";

const app = express();
app.use(helmet());
app.use(bodyParser.json());

const PORT = process.env.PORT || 9000;

app.use("/api", apiRoutes);

async function init() {
  await assertDatabaseConnectionOk();

  app.listen(PORT, () => {
    console.log(`Server listening on the port  ${PORT}`);
  });
}

init();

export default app;
