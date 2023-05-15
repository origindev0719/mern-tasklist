import { Router } from "express";
import * as UserController from "../controllers/user.controller";
import * as TaskController from "../controllers/task.controller";

const router = Router();

router.post("/register", UserController.register);
router.post("/signin", UserController.signin);
router.post("/vaildAuth", UserController.validAuth);

router.post("/createTask", TaskController.createTask);
router.post("/updateTask", TaskController.updateTask);
router.get("/getTask", TaskController.getTask);
router.get("/removeTask/(:id)", TaskController.removeTask);

router.post("/searchTask", TaskController.searchTask);
router.post("/filterTask", TaskController.filterTask);

export default router;
