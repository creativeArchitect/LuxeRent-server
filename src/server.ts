import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import morgan from "morgan";
import connect_database from "./config/index";
import type { Request, Response, NextFunction } from "express";
import errorMiddleware from "./middleware/error.middleware";
import userRouter from "./routes/user.routes";
import profileRouter from "./routes/profile.routes";
import clothesRouter from "./routes/clothes.routes";
import orderRouter from "./routes/order.routes";
import cors from "cors";
import helmet from "helmet";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    allowedHeaders: ["Content-type", "Authorization"],
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(
  express.raw({
    type: "application/webhook+json",
  })
);

app.use("/api/v1/user", userRouter);
app.use("/api/v1/profile", profileRouter);
app.use("/api/v1/cloth", clothesRouter);
app.use("/api/v1/order", orderRouter);

app.get("/ping", (req: Request, res: Response, next: NextFunction) => {
  res.send("PONG...");
});

app.use(errorMiddleware);
const port = process.env.PORT || 5000;

connect_database()
  .then(() => {
    app.listen(port, () => {
      console.log("Server is running on the PORT: " + port);
    });
  })
  .catch((err) => {
    console.log("ERROR: " + err);
  });
