import imagekit from "../configs/imagekit.js";
import Resume from "../models/Resume.js";
import fs from 'fs'

//post: /api/resume/create
export const createResume = async (req, res) => {
    try {
        const userId = req.userId;
        const {title} = req.body;

        //create new resume
        const newresume = await Resume.create({userId, title})
        return res.status(201).json({message:"resume created successfully", resume: newresume})

    } catch (error) {
        return res.status(400).json({message:error.message})
    }
}


//delete: /api/resume/delete
export const deleteResume = async (req, res) => {
    try {
        const userId = req.userId;
        const {resumeId} = req.params;

        await Resume.findOneAndDelete({userId, _id: resumeId})
        return res.status(200).json({message:"resume deleted successfully"})

    } catch (error) {
        return res.status(400).json({message:error.message})
    }
}


//get: /api/resume/get
export const getResumeById = async (req, res) => {
    try {
        const userId = req.userId;
        const {resumeId} = req.params;

        const resume = await Resume.findOne({userId, _id: resumeId})

        if(!resume){
            return res.status(404).json({message:"resume not found"})
        }

        resume.__v = undefined;
        resume.createdAt=undefined;
        resume.updatedAt=undefined;
        return res.status(200).json({resume})

    } catch (error) {
        return res.status(400).json({message:error.message})
    }
}

//get: /api/resume/public
export const getPublicResumeById = async (req, res) =>{
    try {
        const {resumeId} = req.params;
        const resume = await Resume.findOne({public: true, _id: resumeId})

        if(!resume){
            return res.status(404).json({message:"resume not found"})
        }

        return res.status(200).json({resume})

    } catch (error) {
        return res.status(400).json({message:error.message})
    }
}

//put: /api/resume/update

export const updateResume = async (req, res) =>{
    try {
        const userId = req.userId;
        const {resumeId, resumeData, removeBackground} = req.body;
        const image = req.file;

        let resumeDataCopy;
        if(typeof resumeData === 'string') {
            resumeDataCopy = await JSON.parse(resumeData);
        }else{
            resumeDataCopy = structuredClone(resumeData)
        } 
/// for image kit io
        if (image){

            const imagebufferdata = fs.createReadStream(image.path)

            const response = await imagekit.files.upload({
                file: imagebufferdata,
                fileName: 'resume.png',
                folder: 'user-resume',
                transformation: {
                    pre: 'w-300,h-300,fo-face,z-0.75' + (removeBackground ? ',e-bgremoved' : '')
                }
            });

            resumeDataCopy.personal_info.image = response.url
        }
//// ..
        const resume = await Resume.findOneAndUpdate({userId, _id: resumeId}, resumeDataCopy, {returnDocument: 'after'})

        return res.status(200).json({message: 'saved successfully', resume})

    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

