import express from "express";
import protect from "../middleware/middleware.js";
import { enhanceJobDescription, enhanceProfessionalSummary, uploadResume } from "../controllers/aicontroller.js";


const aiRouter = express.Router();
aiRouter.post('/enhance-pro-sum', protect, enhanceProfessionalSummary)
aiRouter.post('/enhance-job-desc', protect, enhanceJobDescription)
aiRouter.post('/upload-resume', protect, uploadResume)


export default aiRouter