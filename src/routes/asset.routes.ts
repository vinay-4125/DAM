import { Router } from "express";
import { upload } from "../middleware/upload.middleware.ts"
import { createAsset, getAsset, getAssets, getUploadUrl, uploadAsset } from "../controllers/asset.controller";
import { getDownloadUrl } from "../controllers/asset.controller.js";


const router = Router()

router.post("/", createAsset);
router.post("/upload", upload.single("file"), uploadAsset)
router.post("/upload-url", getUploadUrl);
router.post("/download-url", getDownloadUrl)
router.get("/", getAssets)
router.get("/:key", getAsset)

export default router;