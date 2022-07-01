const express = require("express");
const app = express();
require("./db/conn");
const User = require("./models/users")
const path = require("path");
const { urlencoded } = require("express");
const bcrypt = require("bcrypt")
const jwt =require("jsonwebtoken");
require('dotenv').config();
const cookieParser =require("cookie-parser") // using cookie parser to fatch cookie value from cookie , cookie parser using as middle ware need to set first


const staticpath = path.join(__dirname,"../public");
app.use(express.static(staticpath));
app.set("view engine","hbs");
// app.use(express.json()); //without json is also this web works
app.use(express.urlencoded({extended:false}));
app.use(cookieParser()); 

app.get("/", (req ,res)=>{
    res.render("index", {
        vart : true
    } );
})
app.get("/registration", (req ,res)=>{
    res.render("registration");

})
app.get("/login", (req ,res)=>{
    res.render("login");

})

app.get("/secret" ,async (req,res) =>{
    try {
        const token =req.cookies.jwt;
    const varifyuser = jwt.verify(token,process.env.SECRET_KEY);
    console.log(varifyuser);

    const userdetail = await User.findOne({ _id:varifyuser._id})
    console.log(userdetail);
    res.render("secret",{
        val : userdetail ,
        named : userdetail.name
    });
        
    } catch (error) {
        res.status(401).send(error);
    }
    
})


app.post("/login", async(req ,res)=>{
    try {
        const userdetail =  await User.findOne({
            email: req.body.email
        })
        //  userdetail =req.body.email  --> if (userdetail.password == req.body.password)
        // console.log(userdetail);
        // if(userdetail.password ===   req.body.password)
        if( await bcrypt.compare( req.body.password , userdetail.password ) )
        {
            console.log(req.body);
            // console.log("ssss");
            
            userdetail.token = jwt.sign( {_id:userdetail._id} , process.env.SECRET_KEY );
            userdetail.save();

            res.cookie("jwt", userdetail.token,{ /*expires: new Date(Date.now()+40000) ,*/ httpOnly : true });
            
            res.render("index",{ 
                vart : false,
                named : userdetail.name
        }) ;
        }
        else
            res.send("Invalid credentials pppswd")
    } catch (error) {
        res.send("Invalid creeddential")
    }


})
app.post("/registration",async (req ,res)=>{
    
    try {
        
        if( req.body.password === req.body.cpassword )
        {
            const hashpass = await bcrypt.hash(req.body.password , 10);
            const create =new User(
                {
                    username: req.body.username,
                    name: req.body.name,
                    email: req.body.email,
                    password: hashpass ,
                    cpassword: hashpass ,
                    // token : jwt.sign( {_id:this._id} , "mynameismanish" ),
                    
                }
            );
            

            create.token = jwt.sign( {_id:create._id} , process.env.SECRET_KEY );//TO HIDE secrert from code uses dotenv file
            //we will use this. instead of create. in method (function)// await this.save();// this keyword used in middle wear method in model folder , this will point toward instance by which method is called
            
            res.cookie("jwt", create.token,{ /*expires: new Date(Date.now()+40000) ,*/ httpOnly : true }); //res.cookie() func inbuilt in nodejs 
            // Date.now() :current time in milisec

            const us=await create.save();
            // console.log(us);
            // console.log(req.body);
            res.status(200).render("index", {
                vart : false,
                named : req.body.name
            } );
        }
        else
            res.send("password are not maching")   
        
    } catch (error) {
        res.status(400).send(error);     
    }
    

})

app.listen(8000,()=> {
    console.log(`htpps://localhost:8000`);
}

)