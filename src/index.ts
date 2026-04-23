import express from "express";
import cors from "cors";
import subjectsRouter from "./routes/subjects";
import securityMiddleware from "./middleware/security";

const app = express();
const PORT = 8000;
const frontendUrl = process.env.FRONTEND_URL;

if (!frontendUrl) {
  throw new Error("FRONTEND_URL environment variable is not defined");
}

app.use(
  cors({
    origin: frontendUrl,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json());

app.use(securityMiddleware);

app.use("/api/subjects", subjectsRouter);

app.get("/", (_req, res) => {
  res.json({ message: "Classroom backend is running." });
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
