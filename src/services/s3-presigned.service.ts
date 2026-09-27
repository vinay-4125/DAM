import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../config/aws";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"


export async function generateUploadUrl(
    bucketName: string,
    key: string,
    contentType: string
) {
    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        ContentType: contentType
    })

    const url = await getSignedUrl(
        s3Client,
        command,
        {
            expiresIn: 60 * 5
        }
    )
    return url;
}