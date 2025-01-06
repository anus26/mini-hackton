import dotenv from "dotenv";
dotenv.config();
import express from "express"
import connectDB from "./src/db/index.js"
import cors  from "cors"
import cookieParser  from 'cookie-parser'
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import userRoutes from "./src/routes/user.routes.js";
import productRoutes from "./src/routes/product.routes.js";

   
const app = express();
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
const JWT_TOKEN_SECRET=process.env.JWT_TOKEN_SECRET

app.get("/",(req,res)=>{
res.send("hello world")
})
console.log("Mongo URI:", process.env.MONGO_URI);

const  encryptpassword = "$2b$10$GYOgdCP7o8xn2czJ2VSiKedYc2x6abHpmcPqSLJ2L4EXwc8D1hkH."
const token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFudXNyYXphMjY1QGdtYWlsLmNvbSIsImlhdCI6MTczMzc5OTczNX0.0jbEMLel_5Kr3ZfBUnpWt51S-P33Hxl1lJOd-gwpt0o"
// encrpt password
app.post("/encryptpassword",(req,res)=>{
    const {password}=req.body
    
        bcrypt.hash(password, 10, function(err, hash) {
            // Store hash in your password DB.
            if(err)return res.status(402).json({message:"password not correct"})
                res.json({password:hash})
            });
            
          })
         app.post("/checkedpassword",(req,res)=>{
            const {password}=req.body
            bcrypt.compare(password, encryptpassword, function(err, result) {
              if(err) return res.status(402).json({message:"error"})
                if(result) return res.json({message:"password is correct"})
   res.status(404).json({message:"incorrect password"})
})   // checkedpassword
        ;
 })
// genreatetoken
app.post("/genreatetoken",(req,res)=>{
    const {email}=req.body
    const token = jwt.sign({email },JWT_TOKEN_SECRET ,);
    res.json(token)
})

// checkedtokend
app.post("/checkedtoken",(req,res)=>{
  jwt.verify(token, process.env.JWT_TOKEN_SECRET, function(err, decoded) {
    if(err) return res.json({message:"error occured"})
    console.log(decoded) // bar
  res.json(decoded)
  });
})

app.use('/api/v1',userRoutes);
app.use('/api/v1',productRoutes);



connectDB()

  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`⚙️  Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed!!!", err);
  });

