import mongoose from "mongoose";
import express from "express";
import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";
import { ObjectId } from 'mongoose';

import ordersSchema from "../../models/OrdersModule/Orders.js";  // Updated import

let router = express.Router();

//create an expense (petty cash)
router.route("/create-order").post(async (req, res, next) => {
  await ordersSchema
      .create(req.body)
      .then((result) => {
          res.json({
              data: result,
              message: "record created successfully",
              status: 200,
          });
      })
      .catch((err) => {
          console.log(err); // FIX: Change `console.log(data.err)` to `console.log(err)`
          return next(err);
      });
});


router.route("/").get(async (req, res, next) => {  // Updated route
  await ordersSchema
    .find()
    .then((result) => {
      res.json({
        data: result,
        message: "Orders fetched successfully",  // Updated message
        status: 200,
      });
    })
    .catch((err) => {
      return next(err);
    });
});

// DELETE order by ID
router.delete("/orders/:id", async (req, res) => {
  try {
    console.log("Delete request received for ID:", req.params.id);
    const { id } = req.params;
    const deletedOrder = await ordersSchema.findByIdAndDelete(id);
    if (!deletedOrder) {
      console.log("Order not found");
      return res.status(404).json({ error: "Order not found" });
    }
    console.log("Order deleted:", deletedOrder);
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ error: "Error deleting order" });
  }
});



router.post("/update-status", async (req, res) => {
  const { status, orderId } = req.body;

  try {
    // Check if orderId is valid ObjectId format
    if (!ObjectId.isValid(orderId)) {
      return res.status(400).send({ message: "Invalid order ID format" });
    }

    // Convert orderId to ObjectId if it's valid
    const orderObjectId = ObjectId(orderId);

    // Find the order by _id (converted to ObjectId)
    const order = await ordersSchema.findOne({ _id: orderObjectId });

    if (!order) {
      return res.status(404).send({ message: "Order not found!" });
    }

    // Update the order status
    order.status = status;

    // Save the updated order
    await order.save();

    console.log(`Updated order status to: ${order.status}`);  // Debugging purpose

    return res.status(200).send({ message: "Status updated successfully!" });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).send({ message: "Internal server error!", error: error.message });
  }
});
// PDF Export Route
router.get("/download/pdf", async (req, res) => {
  try {
    const files = await ordersSchema.find();  // Updated schema reference

    // Create PDF (A4 size: 595 x 842)
    const doc = new PDFDocument({ size: "A4", margin: 40 });
    res.setHeader("Content-Disposition", 'attachment; filename="orders_report.pdf"');  // Updated filename
    res.setHeader("Content-Type", "application/pdf");
    doc.pipe(res);  // Send PDF to response

    // Title
    doc.fontSize(18).font("Helvetica-Bold").text("Order Report", { align: "center", underline: true });  // Updated title
    doc.moveDown(2);

    // Column Headers
    const startX = 40;
    let y = doc.y;
    const colWidths = [30, 70, 80, 100, 80, 80, 80, 60, 80];  // Adjusted widths to fit A4 page

    doc.fontSize(10).font("Helvetica-Bold");
    doc.text("No.", startX, y, { width: colWidths[0] });
    doc.text("Date", startX + colWidths[0], y, { width: colWidths[1] });
    doc.text("Company Name", startX + colWidths[0] + colWidths[1], y, { width: colWidths[2] });
    doc.text("Contact Person", startX + colWidths[0] + colWidths[1] + colWidths[2], y, { width: colWidths[3] });
    doc.text("Picking Point", startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], y, { width: colWidths[4] });
    doc.text("Goods Description", startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4], y, { width: colWidths[5] });
    doc.text("Quantity", startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4] + colWidths[5], y, { width: colWidths[6] });
    doc.text("Weight", startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4] + colWidths[5] + colWidths[6], y, { width: colWidths[7] });
    doc.text("Payment Method", startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4] + colWidths[5] + colWidths[6] + colWidths[7], y, { width: colWidths[8] });

    // Draw Header Separator
    doc.moveDown(0.5);
    doc.moveTo(startX, doc.y).lineTo(555, doc.y).stroke();
    doc.moveDown();

    // Data Rows
    doc.fontSize(9).font("Helvetica");
    let rowHeight = 15;
    let maxRowsPerPage = 40;  // Ensuring content fits A4 page

    files.forEach((file, index) => {
      y = doc.y;
      const formattedDate = file.date ? file.date.toISOString().split("T")[0] : "N/A";

      doc.fontSize(9).font("Helvetica");
      doc.text(`${index + 1}`, startX, y, { width: colWidths[0] });
      doc.text(formattedDate, startX + colWidths[0], y, { width: colWidths[1] });
      doc.text(file.companyName || "N/A", startX + colWidths[0] + colWidths[1], y, { width: colWidths[2] });
      doc.text(file.contactPerson || "N/A", startX + colWidths[0] + colWidths[1] + colWidths[2], y, { width: colWidths[3] });
      doc.text(file.pickingPoint || "N/A", startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], y, { width: colWidths[4] });
      doc.text(file.goodsDescription || "N/A", startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4], y, { width: colWidths[5] });
      doc.text(file.quantity || "N/A", startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4] + colWidths[5], y, { width: colWidths[6] });
      doc.text(file.weight || "N/A", startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4] + colWidths[5] + colWidths[6], y, { width: colWidths[7] });
      doc.text(file.paymentMethod || "N/A", startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4] + colWidths[5] + colWidths[6] + colWidths[7], y, { width: colWidths[8] });

      doc.moveDown(0.5);
      doc.moveTo(startX, doc.y).lineTo(555, doc.y).stroke();
      doc.moveDown();
    });

    doc.end();  // Close the document
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating PDF");
  }
});

export { router as ordersRoutes };  // Updated export name
