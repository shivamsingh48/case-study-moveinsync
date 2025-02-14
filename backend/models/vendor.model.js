import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const vendorSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
    },
  email: { 
    type: String, 
    required: true, 
    unique: true 
    },
  password: { 
    type: String, 
    required: true 
    },
  role: { 
    type: String, 
    enum: ['SUPER', 'REGIONAL', 'CITY', 'LOCAL'],
    required: true
  },
  parent: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Vendor' 
    },
  permissions: [
    { type: String }
    ],
  delegatedPermissions: [
    { type: String }
    ],
  createdAt: { 
    type: Date, 
    default: Date.now 
    }
},{
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add hierarchy virtuals
vendorSchema.virtual('subvendors', {
  ref: 'Vendor',               // Reference to the Vendor model
  localField: '_id',           // Local field (parent's `_id`)
  foreignField: 'parent'       // Field in the child referencing the parent
});

// Pre-save hook for default permissions
vendorSchema.pre('save', function(next) {
  if (!this.permissions || this.permissions.length === 0) {
    this.permissions = this.getDefaultPermissions();
  }
  next();
});

// In Vendor model pre-save hook
vendorSchema.pre('save', function(next) {
  if (this.role === 'SUPER' && this.parent) {
    return next(new Error('Super vendor cannot have parent'));
  }
  next();
});

//Used pre hook for actomatically encrpt password before saving in database
vendorSchema.pre("save",async function(next){
    const salt=await bcrypt.genSalt();
    this.password=await bcrypt.hash(this.password,salt);
    next()
})


//Decalred method to check passord to encrpted password
vendorSchema.methods.isPasswordCheck=async function(password){
  console.log(this.password);
    return await bcrypt.compare(password,this.password)
}




vendorSchema.methods.getDefaultPermissions = function () {
    const permissionsMap = {
      SUPER: ['*'],                        // Full access for Super Vendors
      REGIONAL: ['vehicle:create', 'driver:create'], // Regional permissions
      CITY: ['vehicle:read', 'driver:read'],         // City permissions
      LOCAL: ['booking:manage']            // Local permissions
    };
    return permissionsMap[this.role] || []; // Default to an empty array if role is invalid
};

// Instance method for permissions check
vendorSchema.methods.hasPermission = function(requiredPermission) {
  return this.permissions.includes('*') || 
         this.permissions.includes(requiredPermission) ||
         this.delegatedPermissions.includes(requiredPermission);
};
  

export const Vendor=mongoose.model("Vendor",vendorSchema);