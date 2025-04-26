import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import createError from "http-errors";

import userRouter from "./routes/user.js";
import orderRouter from "./routes/order.js";
import { connectDb } from "./config/db.js";
import cookieParser from "cookie-parser";
import paymentRouter  from "./routes/payment.js"
import partnerRouter from "./routes/partner.js"
import routerContact from "./routes/contact.js"
dotenv.config();
const PORT = process.env.PORT || 3002;
const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin:process.env.CLIENT_URL, 
    credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/auth", userRouter);
app.use("/api/order", orderRouter);


//price and  location
app.use('/api/payments',paymentRouter );
app.use("/api/partner", partnerRouter)


//contact 
app.use("/api/contact",routerContact)
app.use((req, res, next) => {
  next(createError(404, "Not Found!"));
});

app.use((error, req, res, next) => {
  console.error("Error:", error.message);
  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal Server Error.",
  });
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDb();
});
