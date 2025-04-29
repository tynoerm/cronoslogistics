import mongoose from "mongoose";
import express from "express";
import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";

import truckserviceSchema from "../../models/TruckserviceModule/Truckservice.js";  // Updated import

let router = express.Router();


router.route("/create-truckservice").post(async (req, res, next) => {
  try {
    const result = await truckserviceSchema.create(req.body);
    res.json({
      data: result,
      message: "record created successfully",
      status: 200,
    });
  } catch (err) {
    console.error("Error inserting truck service:", err);
    res.status(500).json({ error: err.message });
  }
});

});
router.route("/").get(async (req, res, next) => {  // Updated route
  await truckserviceSchema
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



export { router as truckserviceRoutes };  // Updated export name
