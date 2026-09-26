import app from "./app.js";
import {
    createBucket,
    deleteObject,
    getObject,
    listBuckets,
    listObjects,
    uploadObject
} from "./services/s3.service.js";

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
    try {
        const bucketName = process.env.S3_BUCKET_NAME!;

        try {
            await createBucket(bucketName);
            console.log(`Bucket created: ${bucketName}`);
        } catch (error) {
            console.log("Bucket may already exist.");
        }

        const buckets = await listBuckets();

        console.log(
            "Buckets:",
            buckets.map((bucket) => bucket.Name)
        );

        await uploadObject(
            bucketName,
            "hello.txt",
            "Hello from my DAM backend!"
        );

        console.log("Object uploaded: hello.txt");

        const objects = await listObjects(bucketName);
        console.log("Objects: ", objects.map(object => ({
            key: object.Key,
            size: object.Size,
            lastModified: object.LastModified
        })))

        const object = await getObject(bucketName, "hello.txt")
        const content = await object.Body?.transformToString();
        console.log("Object content: ", content)

        await deleteObject(bucketName, "hello.txt");
        console.log("Object deleted: hello.txt");
        const objectsAfterDelete = await listObjects(bucketName)
        console.log("Objects after delete: ", objectsAfterDelete.map(object => object.Key))

    } catch (error) {
        console.error("Failed to start:", error);
    }
}

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});