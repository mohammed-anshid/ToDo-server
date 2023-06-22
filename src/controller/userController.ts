import { Request , Response } from 'express'
import { genSalt , hash , compare } from 'bcrypt'
import jwt from 'jsonwebtoken';
import userModel from '../model/userSchema';
import toDoModel from '../model/toDoSchema';


//---> User-Signup <---//
export const userSignup = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body
        console.log(req.body)
        if( name && email && password ){
            const userEmailExists = await userModel.findOne({ email: email})
            console.log(userEmailExists)
            if(!userEmailExists) {
                const salt = await genSalt(10)
                const hashedPassword = await hash(password, salt)
                const newUser = new userModel({
                    name: name,
                    email: email,
                    password: hashedPassword
                })
                await newUser.save()
                const user = await userModel.findOne({email:email})
                let userId = user?._id
                const token = jwt.sign({userId},process.env.JWT_KEY as string ,{ expiresIn: '2d' })
                res.status(200).json({
                    status:true,
                    message: 'User created successfully',
                    token: token
                })
            }else{
                res.json({status:false,message:'email already exists'})
            }
        }else{
            res.status(400).json({status: false,message: 'Please fill all the fields'})
        }
    } catch (error) {
        res.status(500).json({status:false,message:'internal server error'})
    }
}


//---> User-Signin <---//

export const userSignin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        console.log(req.body)
        if(email && password){
            const user = await userModel.findOne({ email:email })
                if(user){
                    const userPass = user.password as string
                    const isMatched = await compare(password, userPass)
                    if( isMatched){
                        const userEmail = user.email as string
                        if(userEmail === email && isMatched){
                            const token = jwt.sign({ userId: user._id}, process.env.JWT_KEY as string, { expiresIn: '2d' })
                            res.status(200).json({
                                status:true,
                                message: 'Signin successfully',
                                token: token
                            })
                        }else{
                            res.status(400).json({auth:false,message:'Your email or password is incorrect'})
                        }
                    }else{
                        res.status(400).json({auth:false,message:'Your email or password is incorrect'})
                    }
                }else{
                    res.status(400).json({auth:false,message:'User not exist'})
                }
        }else{
            res.status(400).json({auth:false,message:'All feilds are required'})
        }
    } catch (error) {
        res.status(500).json({status:false,message:'internal server error'})
    }
}


export const userProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.userId
        if(userId){
            const userData = await userModel.findById({_id: userId})
            if(userData){
                res.status(200).json({
                    status:true,
                    message: 'Signin successfully',
                    data: userData
                })
            }else{
                res.json({status:false,message:'Something went wrong'})
            }
        }else{
            res.json({status:false,message:'Something went wrong'})
        }
    } catch (error) {
        res.status(500).json({status:false,message:'internal server error'})
    }
}

export const editProfile = async (req: Request, res: Response) => {
    try {
        const userData = req.body
        if(userData){
            const userId = userData?._id
            await userModel.findByIdAndUpdate(userId,{
                name: userData?.name,
                email: userData?.email
            })
            res.status(200).json({
                status:true,
                message: 'Profile updated successfully',
            })
        }else{
            res.json({status:false,message:'somthing went wrong'})
        }
    } catch (error) {
        res.status(500).json({status:false,message:'internal server error'})
    }
}


export const editPassword = async (req: Request, res: Response) => {
    try {
        const userId = req.query.id;
        const formData = req.body
        const userData = await userModel.findById(userId);
        if(formData && userId) {
            if(formData.password === formData.confirm){
                let isMatched = await compare(formData.password, userData?.password)
                if(isMatched) {
                    const salt = await genSalt(10)
                    const hashedPassword = await hash(formData.newPass, salt)
                    await userModel.findByIdAndUpdate(userId,{
                        password: hashedPassword
                    })
                    res.status(200).json({
                        status:true,
                        message: 'Password updated !',
                    })
                }else{
                    res.json({status:false,message:'Invalid password'})
                }
            }else{
                res.json({status:false,message:'2 passwords are must be same'})
            }
        }else{
            res.json({status:false,message:'feilds are required'})
        }
    } catch (error) {
        res.status(500).json({status:false,message:'internal server error'})
    }
}


export const getTasks = async (req: Request, res: Response) => {
    try {
        const tasks = await toDoModel.find()
        console.log(tasks)
        res.status(200).json({
            status:true,
            message: 'success!',
            data : tasks
        })
    } catch (error) {
        res.status(500).json({status:false,message:'internal server error'})
    }
}

export const addTasks = async (req: Request , res:Response) => {
    try {
        const userId = req.userId
        console.log(req.body)
        const task : string = req.body.task
        if(userId && task) {
            const newTask = new toDoModel({
               userId : userId,
               title  : task
            })
            await newTask.save()
            res.status(200).json({
                status:true,
                message: 'Task added successfully',
            })
        }else{
            res.json({status:false,message:'Somthing went wrong'})
        }
    } catch (error) {
        res.status(500).json({status:false,message:'internal server error'})
    }
}

export const editTask = async (req: Request, res: Response) => {
    try {
        const taskId = req.query.id;
        const task = req.query.task
        if(taskId && task){
            await toDoModel.findByIdAndUpdate({_id:taskId},{
                title: task
            })
            res.status(200).json({
                status:true,
                message: 'updated successfully',
            })
        }else{
            res.json({status:false,message:'Somthing went wrong'})
        }
    } catch (error) {
        res.status(500).json({status:false,message:'internal server error'})
    }
}
 
export const removeTask = async (req: Request, res: Response) => {
    try {
        const taskId = req.query.id;
        if(taskId) {
            await toDoModel.findByIdAndDelete({_id:taskId})
            res.status(200).json({
                status:true,
                message: 'deleted successfully',
            })
        }else{
            res.json({status:false,message:'Somthing went wrong'})
        }
    } catch (error) {
        res.status(500).json({status:false,message:'internal server error'})
    }
}

export const addToDosToTask =  async (req: Request, res: Response) => {
    try {
        console.log(req.body)
        const { taskId } = req.body;
        const todo =  req.body.formData.todo

        console.log(taskId,'----',todo);
        if(taskId && todo){
            const task = await toDoModel.findById({_id:taskId});
            task?.todos.push({
                todo: todo
            });
            task?.save();
            res.status(200).json({
                status:true,
                message: 'Task added successfully',
            })
        }else{
            res.json({status:false,message:'Somthing went wrong'})
        }
    } catch (error) {
        res.status(500).json({status:false,message:'internal server error'})
    }
}

export const removeToDo = async (req: Request, res: Response) => {
    try {
        const { taskId , todoId } = req.body
        if(taskId && todoId){
            const task = await toDoModel.findById({_id:taskId})
            const index = task?.todos.findIndex((element:any)=> element._id.toString() === todoId)
            if (index === -1) {
                return res.json({ status: false, message: 'Element not found' });
            }
            task?.todos?.splice(index, 1);
            await task?.save();
            res.status(200).json({
                status:true,
                message: 'Deleted successfully',
            })
        }else{
            res.json({status:false,message:'failed'})
        }
    } catch (error) {
        res.status(500).json({status:false,message:'internal server error'})
    }
}


export const handleCheckBoxStatus = async (req: Request, res: Response) => {
    try {
        const { taskId,todoId,type } = req.body
        console.log(req.body)
        
            const task = await toDoModel.findOneAndUpdate(
            { _id: taskId },
            { $set: { "todos.$[elem].completed": type } },
            { arrayFilters: [{ "elem._id": todoId }],
              new: true
            })
            res.status(200).json({
                status:true,
                message: 'success',
            })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({status:false,message:'internal server error'})
    }
}

export const authentication = (req: Request, res:Response) => {
    res.status(200).json({
        status:true,
        message: 'Task added successfully',
    })
}