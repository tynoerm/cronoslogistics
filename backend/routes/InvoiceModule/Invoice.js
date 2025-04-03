import mongoose from "mongoose";
import express from "express";
import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";

import invoiceSchema from "../../models/InvoiceModule/Invoice.js";  // Updated import

let router = express.Router();

// Create an order
router.route("/create-invoice").post(async (req, res, next) => {  // Updated route
  await invoiceSchema
    .create(req.body)
    .then((result) => {
      res.json({
        data: result,
        message: "invoice created successfully",  // Updated message
        status: 200,
      });
    })
    .catch((err) => {
      console.log(err);
      return next(err);
    });
});

router.route("/").get(async (req, res, next) => {  // Updated route
  await invoiceSchema
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

// PDF Export Route
router.get("/download/pdf", async (req, res) => {
  try {
    const files = await invoiceSchema.find();  // Updated schema reference

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
    doc.text("Client Name", startX + colWidths[0] + colWidths[1], y, { width: colWidths[2] });
    doc.text("Client Address", startX + colWidths[0] + colWidths[1] + colWidths[2], y, { width: colWidths[3] });
    doc.text("Goods Description", startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], y, { width: colWidths[4] });
    doc.text("Quantity", startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4], y, { width: colWidths[5] });
    doc.text("Payment Method", startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4] + colWidths[5], y, { width: colWidths[6] });
    doc.text("Amount Due", startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4] + colWidths[5] + colWidths[6], y, { width: colWidths[7] });
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
      doc.text(file.clientName || "N/A", startX + colWidths[0] + colWidths[1], y, { width: colWidths[2] });
      doc.text(file.clientAddress || "N/A", startX + colWidths[0] + colWidths[1] + colWidths[2], y, { width: colWidths[3] });
      doc.text(file.goodsDescription || "N/A", startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], y, { width: colWidths[4] });
      doc.text(file.quantity || "N/A", startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4], y, { width: colWidths[5] });
      doc.text(file.paymentMethod || "N/A", startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4] + colWidths[5], y, { width: colWidths[6] });
      doc.text(file.totalamountDue || "N/A", startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4] + colWidths[5] + colWidths[6], y, { width: colWidths[7] });
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

export { router as invoiceRoutes };  // Updated export name
