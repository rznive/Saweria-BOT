require("dotenv").config();
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swaggerConfig");
const transactionHistoryHandler = require("./routes/transactionHistory");
const balanceSaldoHandler = require("./routes/balanceSaldo");
const logger = require("./config/logger");

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes",
});

app.use((req, res, next) => {
  logger.info(`[${req.method}] ${req.originalUrl} - IP: ${req.ip}`);
  next();
});

app.use(limiter);

app.get("/", (req, res) => {
  const serverTime = new Date(Date.now()).toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
  });

  res.json({
    status: "Server is running healthy",
    message: "Welcome to Saweria PAYMENT API",
    endpoints: ["/api/transactionHistory", "/api/balanceSaldo"],
    serverTime,
  });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // Swagger API DOCS tapi engga enggan membuat
app.use("/api/transactionHistory", transactionHistoryHandler);
app.use("/api/balanceSaldo", balanceSaldoHandler);

app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});
