import { Router } from "express";
import { upload } from "../middleware/upload.middleware.ts"
import { createAsset, getAsset, getAssets, uploadAsset } from "../controllers/asset.controller";


const router = Router()

router.post("/", createAsset);
router.post("/upload", upload.single("file"), uploadAsset)
router.get("/", getAssets)
router.get("/:key", getAsset)

export default router;