import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;

let ordersSchema = new Schema({
  date: {
    type: Date,
  },
  companyName: {
    type: String,
  },
  address: {
    type: String,
  },
  phoneNumber: {
    type: Number,
  },
  emailAddress: {
    type: String,
  },
  pickingPoint: {
    type: String,
  },
  contactPerson: {
    type: String,
  },
  goodsDescription: {
    type: String,
  },
  quantity: {
    type: Number,
  },
  weight: {
    type: Number,
  },
  paymentMethod: {
    type: String,
  },
  paymentCurrency: {
    type: String,
  },
  // The `status` field that we need to track the order status
  status: {
    type: String,
    default: "pending", // Default value when the order is created
  },
}, {
  collection: 'order',
});

export default model('order', ordersSchema);
