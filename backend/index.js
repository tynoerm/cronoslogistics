import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import cors from "cors";

const app = express();
app.use(express.json());

const corsOptions = {
  origin: "https://cronoslogistics.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
};
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true })); 


// MongoDB Connection
const mongoURI = process.env.MONGO_URI || "mongodb+srv://tinomutendaishemutemaringa:2fuVI0eXLlRwG71p@cluster0.wzm4cz9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoURI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// Importing Routes
import { quotationRoutes } from './routes/SalesModule/quotation.js';
import { expensesRoutes } from './routes/ExpensesModule/expenses.js';
import { stocksRoutes } from './routes/StockModule/stocks.js';
import { salesRoutes } from './routes/SalesModule/sales.js';


import {ordersRoutes } from './routes/OrdersModule/Orders.js'
import { invoiceRoutes } from './routes/InvoiceModule/Invoice.js';
import {paymentRoutes} from './routes/PaymentsModule/Payments.js'

// Route Use
app.use("/quotation", quotationRoutes);
app.use("/expense", expensesRoutes);
app.use("/stock", stocksRoutes);
app.use("/salesmodel", salesRoutes);

app.use("/invoice", invoiceRoutes)
app.use("/order", ordersRoutes)
app.use("/payment", paymentRoutes)

// Start Server
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log("Server running on port " + port);
});