import { Router } from "express";
import toDosRoute from "./todos";

const router = Router();

router.use("/todos", toDosRoute);

export default router;
