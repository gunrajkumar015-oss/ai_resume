import User from "../models/User.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Resume from "../models/Resume.js";


const generatetoken = (userId)=>{
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '7d'})
    return token;
}


//post: api/users/register
export const registerUser = async (req, res) =>{
    try {
        const {name, email, password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({message: "missings requird fields"})
        }
        const user = await User.findOne({email})
        if(user){
            return res.send({message: "user already exist"})
        }

        const hashedpassword = await bcrypt.hash(password, 10)
        const newuser = await User.create({
            name, email, password: hashedpassword
        })

        //return success messg
        const token = generatetoken(newuser._id)
        newuser.password = undefined;

        return res.status(201).json({message: 'user created succesfull', token, user: newuser})

    } catch (error) {
        return res.status(400).json({message:error.message})        
    }
}

//post: api/users/login

export const loginUser = async (req, res) =>{
    try {
        const {name, email, password} = req.body;
        //check if user exit.
        const user = await User.findOne({email})
        if(!user){
            return res.send({message: "invalid email or password"})
        }
        //check if password is correct.
        if(!user.comparePassword(password)){
            return res.send({message: 'invalid email or password'})
        }    

        //return success messg
        const token = generatetoken(user._id)
        user.password = undefined;

        return res.status(200).json({message: 'login sucessfull', token, user})

    } catch (error) {
        return res.status(400).json({message:error.message})        
    }
}

//get: api/users/data

export const getuserbyId = async (req, res) =>{
    try {
         const userId= Request.userId;   

        // if user exist
        const user = await user.findById(userId)
        if(!user){
            return res.send({message: "user not found"})
        }
        user.password = undefined;    
        return res.status(200).json({user})

    } catch (error) {
        return res.status(400).json({message:error.message})        
    }
}


//controller for getting resume
//get: /api/users/resumes

export const getUserResume = async (req, res) =>{
    try {
        const userId = req.userId;

        const resume = await Resume.find({userId})
        return res.status(200).json({resume})
    } catch (error) {
        return res.status(400).json({message:error.message})
    }
}