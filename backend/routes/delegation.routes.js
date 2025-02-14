import {Router} from 'express'
import {auth} from '../middlewares/auth.middleware.js'
import {checkPermissions} from '../middlewares/accessControl.middleware.js'
import { delegate, revoke } from '../controllers/delegation.controller.js'

const delegationRouter=Router()

delegationRouter.use(auth)
delegationRouter.use(checkPermissions("delegation:manage"))

delegationRouter.route('/delegate').post(delegate)
delegationRouter.route('/revoke').post(revoke)

export {delegationRouter}