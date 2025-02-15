import 'dotenv/config'
import { connectMongoDB } from './config/db.js';
import { app } from './app.js';
import './utils/documentChecker.js'; // Start cron job

const PORT=process.env.PORT || 8000

connectMongoDB()
.then(()=>{
    app.listen(PORT,()=>{
        console.log("Server started at port - ",PORT);
    })
})
.catch((error)=>{
    app.on("error",(error)=>{
        console.log("ERR: ",error);
    })
})