import mongoose, { Schema , model } from 'mongoose';

const toDoSchema : Schema = new Schema ({

    userId :{
        type: mongoose.Types.ObjectId,
        ref:'users'
    },

    title :{
        type:String
    },

    todos : [{

        todo :{
            type:String
        },

        completed :{
            type:Boolean,
        }
    }]

    
},{timestamps:true});

export default model('toDos',toDoSchema);