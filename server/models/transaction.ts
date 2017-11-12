import * as mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  id: String,
  address: String,
  value: Number,
  source: String
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
