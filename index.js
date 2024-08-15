const express = require('express');
const app = express();

require('dotenv').config();
require('./config/db');
app.use(express.json());

const userRoute = require("./routes/userRoute");
const trasactionRoutes = require("./routes/transactionRoute");
const requestRoutes = require("./routes/requestsRoute");

app.use("/api/users", userRoute);
app.use("/api/transactions", trasactionRoutes);
app.use("/api/requests", requestRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Application is running on ${PORT}`));