import express from 'express'
import { getuserbyId, getUserResume, loginUser, registerUser } from '../controllers/usercontroller.js';
import protect from '../middleware/middleware.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/data',protect, getuserbyId)
userRouter.get('/resumes', protect, getUserResume)

export default userRouter;