import mongoose from "mongoose";
{/* 
const connectdb = async ()=>{
    try {
        mongoose.connection.on("connect", ()=>{
            console.log("database connected succesfully")
        })
        let mongodburi = process.env.MONOGODB_URL;
        const projectname = "resume-builder";

        if(!mongodburi){
            throw new Error("mongodb_url environment variable not set")            
        }
        if(!mongodburi.endsWith('/')){
            mongodburi =mongodburi.slice(0, -1)
        }

        await mongoose.connect(`${mongodburi}/${projectname}`)
    } catch (error){
        console.error("error connecting to mongodb:", error)
    }
   
}
*/}
const connectdb = async ()=>{
    try {
        const mongodburi = process.env.MONOGODB_URL;
        
        if(!mongodburi){
            throw new Error("mongodb_url environment variable not set")            
        }
        const conn = await mongoose.connect(mongodburi);
        console.log(`mongodb connected: ${conn.connection.host}`)           
    } catch (error){
        console.error("error connecting to mongodb:", error.message);
        process.exit(1);
    }
   
}

export default connectdb