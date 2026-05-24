import { Router } from "express";
import {
  createIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue,
  deleteIssue,
} from "./issues.controller";
import {
  verifyToken,
  requireMaintainer,
} from "../../middleware/auth.middleware";

const router = Router();

router.get("/", getAllIssues);
router.get("/:id", getSingleIssue);

router.post("/", verifyToken, createIssue);
router.patch("/:id", verifyToken, updateIssue);

router.delete("/:id", verifyToken, requireMaintainer, deleteIssue);

export default router;
