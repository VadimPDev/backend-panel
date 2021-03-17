const sequelize = require("../db")
const {DataTypes} = require('sequelize')


const User = sequelize.define('user',{
    id:{type:DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
    email:{type:DataTypes.STRING,unique:true},
    password:{type:DataTypes.STRING},
    name:{type:DataTypes.STRING},
    family:{type:DataTypes.STRING},
    number:{type:DataTypes.STRING},
    balance:{type:DataTypes.INTEGER,defaultValue:0},
    role:{type:DataTypes.STRING,defaultValue:'USER'}
})

const Server = sequelize.define('server',{
    id:{type:DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
    s_slots:{type:DataTypes.INTEGER},
    s_port:{type:DataTypes.INTEGER},
    s_password:{type:DataTypes.STRING},
    s_status:{type:DataTypes.INTEGER,defaultValue:0},
    s_reg:{type:DataTypes.DATE},
    s_end:{type:DataTypes.DATE},
    s_mysql:{type:DataTypes.INTEGER},
})

const Location = sequelize.define('location',{
    id:{type:DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
    l_ip:{type:DataTypes.STRING,unique:true},
    l_password:{type:DataTypes.STRING},
    l_name:{type:DataTypes.STRING},
    l_port:{type:DataTypes.INTEGER},
    l_status:{type:DataTypes.INTEGER},
    l_cores:{type:DataTypes.INTEGER},
    l_ram:{type:DataTypes.INTEGER},
})

const Version = sequelize.define('version',{
    id:{type:DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
    v_name:{type:DataTypes.STRING},
    v_code:{type:DataTypes.STRING},
})

const Game = sequelize.define('game',{
    id:{type:DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
    g_name:{type:DataTypes.STRING},
    g_code:{type:DataTypes.STRING,unique:true},
    g_status:{type:DataTypes.INTEGER},
    g_min_port:{type:DataTypes.INTEGER},
    g_max_port:{type:DataTypes.INTEGER},
    g_min_slots:{type:DataTypes.INTEGER},
    g_max_slots:{type:DataTypes.INTEGER},
    g_price:{type:DataTypes.INTEGER},
})

User.hasMany(Server)
Server.belongsTo(User)

Location.hasMany(Server)
Server.belongsTo(Location)

Game.hasMany(Server)
Server.belongsTo(Game)

Game.hasMany(Version)
Version.belongsTo(Game)

Version.hasMany(Server)
Server.belongsTo(Version)

module.exports = {
    User,
    Server,
    Location,
    Game,
    Version
}