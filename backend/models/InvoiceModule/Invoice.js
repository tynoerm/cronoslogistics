import { Schema as _Schema, model}  from 'mongoose';
const Schema = _Schema;

let invoiceSchema = new Schema ({
date : {
      type: Date
},
clientName: {
      type: String
},
clientAddress: {
      type: String
},
goodsDescription: {
      type: String
},
quantity: {
      type: Number
},
paymentMethod: {
      type: String
},
totalamountDue: {
      type: Number
}


},{
      collection: 'invoice'
})

export default model ('invoice', invoiceSchema)