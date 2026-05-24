import { Router } from "express";

const authRouter = Router();

authRouter.post("/signup", (req, res) => {
  res.send("signup");
});
authRouter.post("/login", (req, res) => {
  res.send("login");
});

export default authRouter;
