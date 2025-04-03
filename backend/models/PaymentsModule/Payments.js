import { Schema as _Schema, model}  from 'mongoose';
const Schema = _Schema;

let paymentSchema = new Schema ({
date : {
      type: Date
},
companyName: {
      type: String
},
emailAddress: {
      type: String
},
phoneNumber: {
      type: Number
},
paymentPurpose: {
      type: String
},
paymentMethod: {
      type: String
},
paymentAmount: {
      type: Number
},
transactionId: {
      type: String
}



},{
      collection: 'payment'
})

export default model ('payment', paymentSchema)