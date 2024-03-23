import app from "./app";
// import createError from "http-errors";
import { Config } from "./config";
import { AppDataSource } from "./config/data-source";
import logger from "./config/logger";

const startServer = async () => {
    const PORT = Config.PORT;
    try {
        await AppDataSource.initialize();
        logger.info("Database connected successfully.");
        app.listen(PORT, () => {
            // eslint-disable-next-line no-console
            console.log("inside server");
            logger.info(`Listening on port ${PORT}`);
        });
    } catch (err: unknown) {
        // eslint-disable-next-line no-console
        console.log("test");
        logger.error(err);
        if (err instanceof Error) {
            logger.error(err.message);
            setTimeout(() => {
                process.exit(1);
            }, 1000);
        }
    }
};

void startServer();
