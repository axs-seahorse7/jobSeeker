const mongoose = require('mongoose');
const { session } = require('passport');
const plm = require('passport-local-mongoose');  
const Post = require('./post');

mongoose.connect('mongodb://127.0.0.1:27017/user');

const userSchema = mongoose.Schema({
    profile:{
        type:String
    },
    username:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    picture:[{
        type:mongoose.Schema.Types.ObjectId, 
        ref:"post"
    }] ,

    post:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"post"
    }]
});

userSchema.plugin(plm);

module.exports = mongoose.model('user', userSchema);