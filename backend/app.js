import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';

const app=express();

app.use(cors({
    origin:process.env.ORIGIN,
    methods:["GET","POST","PATCH","DELETE","PUT"],
    credentials:true,
}))

app.use(express.static("public"))

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

import { vendorRouter } from './routes/vendor.routes.js';
import seedRouter from './routes/seed.routes.js'
import { delegationRouter } from './routes/delegation.routes.js';
import fleetRouter from './routes/fleet.routes.js'
import superVendorRouter from './routes/superVendor.routes.js'
import { errorHandler } from './middlewares/error.middleware.js';

app.use('/api/v1/seed',seedRouter)
app.use('/api/v1/vendor',vendorRouter)
app.use('/api/v1/delegation',delegationRouter)
app.use('/api/v1/fleet',fleetRouter)
app.use('/api/v1/super-vendor',superVendorRouter)

app.use(errorHandler)

export {app};