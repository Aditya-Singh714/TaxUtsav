import express from "express";
const router = express.Router();

import { calculateHRA, calculateHRAGet } from "../controllers/hraController.js";

router.post("/calculate-hra", calculateHRA);

router.get("/calculate-hra", calculateHRAGet);

export default router;
