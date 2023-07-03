import express from "express";
import router from "../routes/index.js";
import morgan from "../middleware/morgan.middleware.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan);
app.use("/api", router);

export default app;
