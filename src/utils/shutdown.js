import { disconnectMongo } from "./mongo.js";
import logger from "./winston.js";

const signals = ["SIGINT", "SIGTERM"];

function handleShutdown(signal, server) {
  process.on(signal, async () => {
    server.close(() => {
      logger.info(`${signal} received, server is closing`);
    });

    await disconnectMongo();

    logger.info("Shutdown Complete");
    process.exit(0);
  });
}

export default function shutdown(server) {
  signals.forEach((signal) => {
    handleShutdown(signal, server);
  });
}
