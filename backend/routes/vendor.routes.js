import {Router} from 'express'
import { createVendor } from '../controllers/vendor.controller.js'
import { auth } from '../middlewares/auth.middleware.js'
import { login, logout } from '../controllers/auth.controller.js'
import {checkPermissions} from '../middlewares/accessControl.middleware.js'


const vendorRouter=Router()

vendorRouter.route('/login').post(login)

vendorRouter.use(auth)
vendorRouter.route('/create-vendor').post(checkPermissions("vendor:create"),createVendor)
vendorRouter.route('/logout').post(logout)

export {vendorRouter}