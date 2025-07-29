const mongoose = require('mongoose');

const ContractSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  extractedText: {
    type: String,
    required: true,
  },
   summary: {
    type: String,
    required: true,
  },
  riskyClauses: [
    {
      type: {
        type: String,
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
      reason: {
        type: String,
        required: true,
      },
    },
  ],
  suggestions: {
    type: [String],
    required: true,
  },
  riskScore: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Contract', ContractSchema);
