const { User } = require("../models/models")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const generateJWT = (id,email,role) =>{
    return jwt.sign({id,email,role},process.env.SECRET_KEY,{expiresIn:'30m'})
}

class UserController {

    async registration(req,res){
        try{
            const {email,password,name,family,number} = req.body

            const candidate = await User.findOne({where:{email}})
            if(candidate){
                return res.status(403).json({message:'Пользователь существует'})
            }
    
            const role = 'USER'
    
            const hashPassword = await bcrypt.hash(password,5)
            const user = await User.create({email,password:hashPassword,name,family,number,role})
            const token =  generateJWT(user.id,email,role)
            return res.json({token})
        }catch(e){
            return res.status(403).json({message:e})
        }
    }

    async login(req,res){
        try{
                const {email,password} = req.body

                const user = await User.findOne({where:{email}})

                if(!user){
                    return res.status(403).json({message:'Пользователь не существует'})
                }

                const comparePassword = bcrypt.compareSync(password,user.password)

                if(!comparePassword){
                    return res.status(403).json({message:'неверный пароль'})
                }

                const token = generateJWT(user.id,user.email,user.role)
                return res.json({token})

        }catch(e){
            return res.status(403).json({message:e})
        }
    }

    async check(req,res,next){
        try{
            const token = generateJWT(req.user.id,req.user.email,req.user.role)
            return res.json({token})
        }catch(e){
            return res.stastus(401).json({message:e})
        }
    }

}


module.exports = new UserController()