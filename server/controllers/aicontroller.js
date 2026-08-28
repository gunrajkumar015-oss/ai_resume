import { model } from "mongoose";
import ai from "../configs/ai.js";
import { response } from "express";
import Resume from "../models/Resume.js";

//post  :  api/ai/enhance-pro-sum
export const enhanceProfessionalSummary = async (req,res) => {
    try {
        const { usercontent } = req.body;

        if(!usercontent){
            return res.status(400).json({message: "missings required fields"})
        }

        const response = await ai.chat.completion.create({
            model: process.env.OPENAI_MODEL,
            message: [
                {
                    role: "System",
                    content: "you are an expert in resume writing. your task is to enhance the professional summary of a resume. the summary should be 1-2 sentences also highlighting key skills, experience, and career objectives. make it compelling and ats-friendly. and only return text no options or anythings else.",                   
                },
                {
                    role: "user",
                    content: usercontent,
                }
            ],
        })

        const enhancedContent = response.choices[0].message.content;
        return res.status(200).json({enhancedContent})
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}


//post  :  api/ai/enhance-pro-desc

export const enhanceJobDescription = async (req,res) => {
    try {
        const { usercontent } = req.body;

        if(!usercontent){
            return res.status(400).json({message: "missings required fields"})
        }

        const response = await ai.chat.completion.create({
            model: process.env.OPENAI_MODEL,
            message: [
                {
                    role: "System",
                    content: "you are an expert in resume writing. your task is to enhance the job descriptions of a resume. the job description should be only in 1-2 sentences also highlighting key responsibilities and achievements.use action verbs and quantifiable results where possible. make it ats-friendly. and only return text no options or anythings else.",                   
                },
                {
                    role: "user",
                    content: usercontent,
                }
            ],
        })

        const enhancedContent = response.choices[0].message.content;
        return res.status(200).json({enhancedContent})
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

//post  :  api/ai/upload-resume


export const uploadResume = async (req,res) => {
    try {
        
        const {resumeText, title} = req.body;
        const userId = req.userId;
        
        if(!resumeText){
            return res.status(400).json({message: "missings required fields"})
        }

        const systemPrompt = "you are an expert ai agent to extract data from resume."
        const userPrompt = `
        extract data from this resume: ${resumeText} 
        provide data in the following JSON formate with no additional text before or after:

        {
    professional_summary: {type: String, default: ''},
    skills: [{type: String}],
    personal_info: {
        image: {type: String, default: ''},
        full_name: {type: String, default: ''},
        profession: {type: String, default: ''},
        email: {type: String, default: ''},
        phone: {type: String, default: ''},
        location: {type: String, default: ''},
        linkedin: {type: String, default: ''},
        website: {type: String, default: ''},
    },
    experience: [
        {
            company: {type: String},
            position: {type: String},
            start_date: {type: String},
            end_date: {type: String},
            description: {type: String},
            is_current: {type: Boolean},
        }
    ],
    project: [
        {
            name: {type: String},
            type: {type: String},           
            description: {type: String},
        }
    ],
    education: [
        {
            institution: {type: String},
            degree: {type: String},
            field: {type: String},
            graduation_date: {type: String},
            gpa: {type: String},
        }
    ],
        }
        `

        const response = await ai.chat.completion.create({
            model: process.env.OPENAI_MODEL,
            message: [
                {
                    role: "System",
                    content: systemPrompt,                   
                },
                {
                    role: "user",
                    content: userPrompt,
                }
            ],
            response_format: {type: 'json_object'}
        })

        const extractedData = response.choices[0].message.content;
        const parsedData = JSON.parse(extractedData)
        const newResume = await Resume.create({userId, title, ...parsedData})
        res.json({resumeId: newResume._id})
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}