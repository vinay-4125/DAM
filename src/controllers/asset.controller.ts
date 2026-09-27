import { Request, Response } from "express";
import { getObject, listObjects, uploadObject } from "../services/s3.service";
import { v4 as uuidv4 } from "uuid"
import { generateUploadUrl } from "../services/s3-presigned.service";
import { generateDownloadUrl } from "../services/s3-presigned.service.js";


export async function createAsset(req: Request, res: Response) {
    try {

        const { key, content } = req.body;

        if (!key || !content) {
            return res.status(400).json({
                message: "key and content are required"
            })
        }

        const bucketName = process.env.S3_BUCKET_NAME;

        if (!bucketName) {
            return res.status(500).json({
                message: "S3 bucket is not configured"
            })
        }

        await uploadObject(bucketName, key, content)

        return res.status(201).json({
            message: "Asset uploaded successfully",
            key,
            bucket: bucketName
        })
    } catch (error) {
        console.error("Create asset error:", error)
        return res.status(500).json({
            message: "Failed to upload asset"
        })
    }
}

export async function getAssets(_req: Request, res: Response) {
    try {
        const bucketName = process.env.S3_BUCKET_NAME;
        if (!bucketName) {
            return res.status(500).json({
                message: "S3 bucket is not configured"
            })
        }
        const objects = await listObjects(bucketName)

        return res.status(200).json({
            assets: objects.map(object => ({
                key: object.Key,
                size: object.Size,
                lastModified: object.LastModified,
                owner: object.Owner
            }))
        })
    } catch (error) {
        console.error("Get assets error:", error);
        return res.status(500).json({
            message: "Failed to fetch assets"
        })
    }
}

export async function getAsset(req: Request, res: Response) {
    try {
        const { key } = req.params;
        if (!key) {
            return res.status(400).json({
                message: "Asset key is required"
            })
        }

        const bucketName = process.env.S3_BUCKET_NAME;
        if (!bucketName) {
            return res.status(500).json({
                message: "S3 bucket is not configured"
            })
        }

        const object = await getObject(bucketName, key);

        const content = await object.Body?.transformToString();

        return res.status(200).json({
            key,
            content,
            contentType: object.ContentType,
            size: object.ContentLength,
            lastModified: object.LastModified
        })
    } catch (error) {
        console.error("Get asset error:", error);
        return res.status(500).json({ message: "Failed to fetch asset" })
    }
}

export async function uploadAsset(req: Request, res: Response) {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "File is required"
            })
        }

        const bucketName = process.env.S3_BUCKET_NAME;

        if (!bucketName) {
            return res.status(500).json({
                message: "S3 bucket is not configured"
            })
        }

        const assetId = uuidv4();
        const s3Key = `assets/${assetId}/${req.file.originalname}`
        await uploadObject(bucketName, s3Key, req.file.buffer, req.file.mimetype, {
            assetId,
            originalName: req.file.originalname
        })

        return res.status(201).json({
            message: "Asset uploaded successfully",
            originalName: req.file.originalname,
            s3Key,
            contentType: req.file.mimetype,
            size: req.file.size
        })
    } catch (error) {
        console.error("Upload asset error:", error);
        return res.status(500).json({
            message: "Failed to upload asset"
        })
    }
}

export async function getUploadUrl(req: Request, res: Response) {
    try {
        const { fileName, contentType } = req.body;
        if (!fileName || !contentType) {
            return res.status(400).json({
                message: "filename and contentType are required"
            })
        }

        const bucketName = process.env.S3_BUCKET_NAME;
        if (!bucketName) {
            return res.status(500).json({
                message: "S3 bucket is not configured"
            })
        }

        const assetId = crypto.randomUUID();
        const key = `assets/${assetId}/${fileName}`
        const uploadUrl = await generateUploadUrl(bucketName, key, contentType)
        return res.status(200).json({
            assetId,
            key,
            uploadUrl
        })
    } catch (error) {
        console.error("Generate upload URL error:", error)
        return res.status(500).json({
            message: "Failed to generate upload URL"
        })
    }
}

export async function getDownloadUrl(req: Request, res: Response) {
    try {
        const { key } = req.body;
        if (!key) {
            return res.status(400).json({
                message: "key is required"
            })
        }

        const bucketName = process.env.S3_BUCKET_NAME;
        if (!bucketName) {
            return res.status(500).json({
                message: "S3 bucket is not configured"
            })
        }

        const downloadUrl = await generateDownloadUrl(bucketName, key)
        return res.status(200).json({ downloadUrl })
    } catch (error) {
        console.error("Generate download URL error:", error);
        return res.status(500).json({
            message: "Failed to generate download URL"
        })
    }
}