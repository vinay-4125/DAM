import { CreateBucketCommand, DeleteObjectCommand, GetObjectCommand, ListBucketsCommand, ListObjectsV2Command, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../config/aws";


export async function createBucket(bucketName: string) {
    const command = new CreateBucketCommand({
        Bucket: bucketName
    })
    return await s3Client.send(command)
}

export async function listBuckets() {
    const command = new ListBucketsCommand();
    const response = await s3Client.send(command)
    return response.Buckets ?? [];
}

export async function uploadObject(bucketName: string, key: string, body: string | Buffer, contentType?: string) {
    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: body,
        ContentType: contentType
    })
    return await s3Client.send(command)
}

export async function listObjects(bucketName: string) {
    const command = new ListObjectsV2Command({
        Bucket: bucketName
    });
    const response = await s3Client.send(command)
    return response.Contents ?? [];
}

export async function getObject(bucketName: string, key: string) {
    const command = new GetObjectCommand({ Bucket: bucketName, Key: key })
    const response = await s3Client.send(command)
    return response
}

export async function deleteObject(bucketName: string, key: string) {
    const command = new DeleteObjectCommand({ Bucket: bucketName, Key: key })
    return await s3Client.send(command);
}