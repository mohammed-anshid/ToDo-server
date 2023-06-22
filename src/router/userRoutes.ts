import express , { Router } from 'express';
import { addTasks, addToDosToTask, authentication, editPassword, editProfile, getTasks, handleCheckBoxStatus, userProfile, userSignin, userSignup } from '../controller/userController';
import { verifyToken } from '../middlewares/verifyToken';


const router :Router = express.Router();

router.post('/auth',verifyToken,authentication)
router.post('/signup',userSignup)
router.post('/signin',userSignin)
router.get('/profile',verifyToken,userProfile)
router.patch('/profile',verifyToken,editProfile)
router.patch('/security',verifyToken,editPassword)
router.get('/tasks',verifyToken,getTasks)
router.post('/todos',verifyToken,addToDosToTask)
router.post('/add',verifyToken,addTasks)
router.patch('/checkbox',verifyToken,handleCheckBoxStatus)

export default router ;