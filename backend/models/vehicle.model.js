import mongoose from "mongoose";

//SubSchema for handling documents
const documentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['RC', 'PERMIT', 'POLLUTION'],
    required: true
  },
  documentNumber: String,
  expiryDate: {
    type: Date,
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  verificationDate: Date
});

const vehicleSchema = new mongoose.Schema({
  registrationNumber: {
    type: String,
    required: true,
    unique: true
  },
  model: {
    type: String,
    required: true
  },
  seatingCapacity: {
    type: Number,
    required: true,
    min: 1
  },
  fuelType: {
    type: String,
    enum: ['PETROL', 'DIESEL', 'ELECTRIC', 'CNG'],
    required: true
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  documents: [documentSchema],
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'UNDER_MAINTENANCE'],
    default: 'ACTIVE'
  },
  assignedDriver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for faster querying
vehicleSchema.index({ vendor: 1, status: 1 });
vehicleSchema.index({ registrationNumber: 1 }, { unique: true });

// Pre-save validation for documents
vehicleSchema.pre('save', function(next) {
  const requiredDocs = ['RC', 'POLLUTION'];
  const existingDocTypes = this.documents.map(doc => doc.type);
  
  if (!requiredDocs.every(doc => existingDocTypes.includes(doc))) {
    return next(new Error('Missing required documents'));
  }
  next();
});

export const Vehicle = mongoose.model('Vehicle', vehicleSchema);