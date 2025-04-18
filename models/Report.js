const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  month: {
    type: String,
    required: true
  },
  attendancePercentage: {
    type: Number,
    required: true
  },
  complaints: {
    type: Number,
    required: true
  },
  leaves: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Report', ReportSchema);