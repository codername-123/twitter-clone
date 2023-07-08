import environment from "../config/environment.config.js";

const allowedOrigin = `${environment.host}:${environment.port}`;

const corsOptions = {
  origin: allowedOrigin,
  credentials: true,
  optionsSuccessStatus: 200,
};

export default corsOptions;
