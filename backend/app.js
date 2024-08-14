const express = require("express");
const connectDB = require("./config/db"); 
const bodyParser = require("body-parser");
// const swaggerUi = require("swagger-ui-express");
// const swaggerDocument = require("./swagger.json");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const prefix = process.env.NODE_ENV === "production" ? "/api" : "";

// Connect to MongoDB
connectDB();

// Enable CORS for all origins (Not recommended for production)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

// Middleware
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false })); 
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const bookingsRouter = require("./api/routes/bookingRoutes");
const roomsRouter = require("./api/routes/roomsRoutes");
const usersRouter = require("./api/routes/usersRoutes");

app.use(prefix + "/bookings", bookingsRouter);
app.use(prefix + "/rooms", roomsRouter);
app.use(prefix + "/users", usersRouter);

// Start the server
app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}, Using API prefix: '${prefix}'`
  );
});