import app from "./utils/server.js";
import environment from "./config/environment.js";
import { connectMongo } from "./utils/mongo.js";
import logger from "./utils/winston.js";
import shutdown from "./utils/shutdown.js";

const server = app.listen(environment.port, async () => {
  await connectMongo();
  logger.info(
    `Server started listening on ${environment.host}:${environment.port}`
  );
});

shutdown(server);
