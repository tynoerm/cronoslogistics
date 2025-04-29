import mongoose from "mongoose";
import express from "express";
import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";

import truckserviceSchema from "../../models/TruckserviceModule/Truckservice.js";  // Updated import

let router = express.Router();

// Create an order
router.route("/create-truckservice").post(async (req, res, next) => {  // Updated route
  await truckserviceSchema
    .create(req.body)
    .then((result) => {
      res.json({
        data: result,
        message: "record created",  // Updated message
        status: 200,
      });
    })
    .catch((err) => {
      console.log(err);
      return next(err);
    });
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
