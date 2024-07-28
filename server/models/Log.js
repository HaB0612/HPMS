const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LogSchema = new Schema({
  message: { type: String, required: true },
  level: { type: String, enum: ['info', 'warn', 'error'], default: 'info' },
  timestamp: { type: Date, default: Date.now },
  employee:  { type: Schema.Types.ObjectId, ref: 'Employee' },
  request: {
    method: { type: String },
    url: { type: String },
    headers: { type: Schema.Types.Mixed },
    body: { type: Schema.Types.Mixed }
  },
  response: {
    status: { type: Number },
    headers: { type: Schema.Types.Mixed },
    body: { type: Schema.Types.Mixed }
  },
  error: { type: Schema.Types.Mixed },
  additionalInfo: { type: Schema.Types.Mixed }
});

const Log = mongoose.model('Log', LogSchema);

module.exports = Log;
