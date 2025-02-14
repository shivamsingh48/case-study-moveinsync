import { Router } from 'express';
import { createSuperVendor } from '../controllers/seed.controller.js'

const router=Router()

router.post('/super-vendor', 
  (req, res, next) => {
    if (process.env.ALLOW_SEEDING === 'true') next();
    else res.status(403).end();
  },
  createSuperVendor
);

export default router