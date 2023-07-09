import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import router from "../routes/index.js";
import morgan from "../middleware/morgan.middleware.js";
import corsOptions from "../config/cors.config.js";
import deserializeUser from "../middleware/deserializeUser.middleware.js";

const app = express();

app.disable("x-powered-by");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// This is to tell this express app that it is behind a reverse proxy (ex: NGINX or caddy)
// app.set("trust proxy", true);

app.use(cors(corsOptions));
app.use(helmet());
app.use(morgan);
app.use(deserializeUser);

app.use("/api", router);

export default app;
