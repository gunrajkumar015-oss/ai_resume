import express from 'express'
import cors from 'cors'
import "dotenv/config";
import connectdb from './configs/db.js';
import userRouter from './routes/userroutes.js';
import resumeRouter from './routes/resumeRoutes.js';
import aiRouter from './routes/airoutes.js';


const app=express();



const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(cors());

app.get('/', (req, res)=> res.send("server is live..."))
app.use('/api/users', userRouter)
app.use('/api/resumes',resumeRouter)
app.use('/api/ai', aiRouter)
connectdb().then(()=>{
    app.listen(PORT,()=>{
        console.log(`server is running on port ${PORT}`);
    })
}).catch((err)=>{
    console.log("mongodb connection failed:", err);
})