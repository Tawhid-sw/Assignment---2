import express from "express";
import authRouter from "./modules/auth/auth.routes";
import issuesRouter from "./modules/issues/issues.routes";
import errorHandler from "./middleware/error.middleware";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("hello world");
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use("/api/auth", authRouter);
app.use("/api/issues", issuesRouter);

// global error handler
app.use(errorHandler);

export default app;
