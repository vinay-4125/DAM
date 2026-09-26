import express from "express";
import assetRoutes from "./routes/asset.routes.ts"

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
    res.json({
        message: "DAM backend is running"
    });
});

app.use("/api/assets", assetRoutes)
export default app;