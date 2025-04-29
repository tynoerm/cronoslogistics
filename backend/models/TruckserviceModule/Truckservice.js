import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;

let truckserviceSchema = new Schema({
  date: {
    type: Date,
    required: true
  },
  driverName: {
    type: String,
    required: true
  },
  truckName: {
    type: String,
    required: true
  },
  serviceMileage: {
    type: Number,
    required: true
  },
  nextServicemileage: {
    type: Number,
    required: true
  }
}, {
  collection: 'truckservice'
});

export default model('TruckService', truckserviceSchema);
