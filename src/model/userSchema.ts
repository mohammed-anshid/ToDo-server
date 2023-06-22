import { Schema , model } from 'mongoose';

const userSchema : Schema = new Schema ({
    
    name :{
        type:String,
    },
    email :{
        type:String,   
    },
    password :{
        type:String,
        trim:true
    }
    
},{timestamps:true});

export default model('users',userSchema);