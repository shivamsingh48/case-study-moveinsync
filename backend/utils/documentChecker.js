import cron from 'node-cron';
import { Driver } from '../models/driver.model.js';

const checkDocumentExpiry = async () => {
  const expiredDrivers = await Driver.find({
    $or: [
      { 'license.expiryDate': { $lt: new Date() } },
      { 'documents.expiryDate': { $lt: new Date() } }
    ]
  });

  expiredDrivers.forEach(async driver => {
    driver.status = 'INACTIVE';
    await driver.save();
    
    console.log(`${driver.fullName} documents are expired please update it!`);
  });
};

// Run daily at midnight
cron.schedule('0 0 * * *', checkDocumentExpiry);