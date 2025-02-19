import mongoose from "mongoose";

//subSchema for license
const licenseSchema = new mongoose.Schema({
  licenseNumber: {
    type: String,
    required: true,
    unique: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  }
});

const driverSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  contactNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  license: licenseSchema,
  assignedVehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle'
  },
  status: {
    type: String,
    enum: ['AVAILABLE', 'ON_TRIP', 'INACTIVE'],
    default: 'AVAILABLE'
  },
  documents: [{
    type: {
      type: String,
      enum: ['AADHAAR', 'PAN', 'MEDICAL_CERTIFICATE']
    },
    documentNumber: String,
    fileUrl: String,
    expiryDate: Date
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Custom method to check license validity
driverSchema.methods.isLicenseValid = function() {
  return this.license.expiryDate > Date.now() && this.license.verified;
};

// Pre-save hook for status validation
driverSchema.pre('save', function(next) {
  if (!this.isLicenseValid()) {
    this.status = 'INACTIVE';
  }
  next();
});

export const Driver = mongoose.model('Driver', driverSchema);