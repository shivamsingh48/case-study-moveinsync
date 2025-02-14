import {Router} from 'express'
import { createVendor } from '../controllers/vendor.controller.js'
import { auth } from '../middlewares/auth.middleware.js'
import { login } from '../controllers/auth.controller.js'
// import { app } from '../app.js'

const vendorRouter=Router()

vendorRouter.route('/login').post(login)

vendorRouter.use(auth)
vendorRouter.route('/create-vendor').post(createVendor)


export {vendorRouter}