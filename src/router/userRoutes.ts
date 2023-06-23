import express , { Router } from 'express';
import { addTasks, addToDosToTask, authentication, editPassword, editProfile, editTask, getTasks, handleCheckBoxStatus, removeTask, removeToDo, userProfile, userSignin, userSignup } from '../controller/userController';
import { verifyToken } from '../middlewares/verifyToken';


const router :Router = express.Router();
// authentication routes //
router.post('/auth',verifyToken,authentication)    

// User signup & signin Management routes //
router.post('/signup',userSignup)                   // user signup
router.post('/signin',userSignin)                   // user signin

// User Profile Management routes //
router.get('/profile',verifyToken,userProfile)      // Get Profiole
router.patch('/profile',verifyToken,editProfile)    // Edit Profile
router.patch('/security',verifyToken,editPassword)  // Edit Password

// User Task and Todo list Management routes //
router.get('/tasks',verifyToken,getTasks)           // Get All Tasks
router.patch('/edit-task',editTask)                 // Edit Task
router.patch('/delete-task',verifyToken,removeTask) // Delete Task
router.post('/todos',verifyToken,addToDosToTask)    // Add Todo to Task List
router.patch('/remove-todo',verifyToken,removeToDo) // Remove Todo from Task
router.post('/add',verifyToken,addTasks)            // Add Task
router.patch('/checkbox',verifyToken,handleCheckBoxStatus)  // Todo Checkbox Status

export default router ;