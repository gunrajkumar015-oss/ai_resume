import jwt from 'jsonwebtoken'


const protect = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token){
        return res.status(401).json({message: 'unathorized'})

    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = decoded.userId;
        next();
    } catch {
        return res.status(401).json({message: 'unathorized'});
    }
} 

export default protect;