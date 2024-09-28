const users = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userctrl = {
    register: async(req,res)=>{
        try{
            const {name,email,password} = req.body;
        
            const user = await users.findOne({email});
            if(user)return res.status(400).json({msg:"Already registered"})
            
            if(password.length < 6) return res.status(400).json({msg:"password should atleast 6 characted"})

                //password encryption
                const passwordHash = await bcrypt.hash(password,10);

                const newUser = new users({
                    name,email,password:passwordHash
                });
                await newUser.save();

                //create jwt to authentication
                const accesstoken = createAccessToken({id:newUser._id});
                const refreshtoken = createRefreshToken({id:newUser._id});

                res.cookie('refreshtoken',refreshtoken,{
                    httpOnly:true,
                    path:'/user/refreshtoken'
                })
                res.json({refreshtoken});
                
        }
        catch(error){
            return res.status(500).json({msg:error.message})
        }
    },
    login:async(req,res)=>{
        try{
              const {email,password} = req.body;
              const user = await users.findOne({email});
              if(!user) return res.status(400).json({msg:"user does not exist"});

              const isMatch = await bcrypt.compare(password,user.password);
              if(!isMatch) return res.status(400).json({msg:'Incorrect Password'})

                const accesstoken = createAccessToken({id:user._id})
                const refreshtoken = createAccessToken({id:user._id})

                res.cookie('refreshtoken',refreshtoken,{
                    httpOnly:true,
                    path:'/user/refreshtoken'
                })
                
                res.json({refreshtoken});
        }
        catch(error){
              return res.status(500).json({msg:error.message});
        }
    },
    refreshtoken: async(req,res)=>{
        try{
            const rf_token = req.cookies.refreshtoken;
            // console.log(rf_token);
            
            if(!rf_token) return res.status(400).json({msg:'please Login or Register'});

            jwt.verify(rf_token,process.env.REFRESH_TOKEN_SECRET,(err,user)=>{
                if(err)return res.status(400).json({msg:'please login'})
                const accesstoken = createAccessToken({id:user._id});
                res.json({user,accesstoken})
            })
        }
        catch(err){
            return res.status(500).json({msg:err.message});
        }
    },
    logout:async(req,res)=>{
        try{
              res.clearCookie('refreshtoken',{
                path:'/user/refreshtoken'
              })
              return res.json({msg:"Log Out"})
        }
        catch(err){
             console.log({err:err.message})
        }
    },
    getUser:async(req,res)=>{
        try{
              const use = await users.findById(req.user.id).select('-password')
              if(!use) return res.status(400).json({msg:"User not found"})
              res.json(use);
        }
        catch(err){
              console.log("error occured:")
        }
    }
}

const createAccessToken=(payload)=>{
      return jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1d'})
}
const createRefreshToken=(payload)=>{
      return jwt.sign(payload,process.env.REFRESH_TOKEN_SECRET,{expiresIn:'7d'})
}

module.exports = userctrl;