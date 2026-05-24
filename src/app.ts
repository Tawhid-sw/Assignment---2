import express from "express";
import authRouter from "./modules/auth/auth.routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use("/api/auth", authRouter);

export default app;
