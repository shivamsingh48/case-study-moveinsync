import {Router} from 'express'
import {auth} from '../middlewares/auth.middleware.js'
import {checkPermissions} from '../middlewares/accessControl.middleware.js'
import { forceVerifyDriverLicense, forceVerifyVehicleDocuments, getDashboardData, overrideVehicleOperation } from '../controllers/dashboard.controller.js'

const router=Router()

router.use(auth)
router.use(checkPermissions('super:override'))

router.route('/dashboard').get(getDashboardData)
router.route('/override/vehicle/:vehicleId').patch(overrideVehicleOperation)
router.route('/override/vehicle-documents/:vehicleId').patch(forceVerifyVehicleDocuments)
router.route('/override/driver-documents/:driverId').patch(forceVerifyDriverLicense)

export default router