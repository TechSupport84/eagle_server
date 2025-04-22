import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: "Access Denied: No Token Provided" });
  }

  jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid Token", error: err.message });
    }

    req.user = decoded;
    next();
  });
};


export  const isAdmin = (req , res , next )=>{
  if(req.user?.role === "admin"){
    return next ()
  }
  res.status(403).json({success:false, message:"access  dinied admin only."})
}