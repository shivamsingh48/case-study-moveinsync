// routes/fleetRoutes.js
import express from 'express';
import { createVehicle} from '../controllers/vehicle.controller.js';
import { assignVehicleToDriver, createDriver} from '../controllers/drivers.controller.js';
import { auth } from '../middlewares/auth.middleware.js';
import { checkPermissions } from '../middlewares/accessControl.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = express.Router();

router.use(auth);
router.use(checkPermissions('fleet:manage'));

// Vehicle routes
router.route('/vehicles').post(
    upload.fields([
        { name: 'rc', maxCount: 1 },
        { name: 'pollution', maxCount: 1 },
        { name: 'permit', maxCount: 1 }
      ]),
    createVehicle
)

// Driver routes
router.route('/drivers').post(
    upload.fields([
        { name: 'aadhaar', maxCount: 1 },
        { name: 'pan', maxCount: 1 },
        { name: 'medical', maxCount: 1 }
      ]),
    createDriver
)

router.route('/assign-driver').post(assignVehicleToDriver)

export default router;