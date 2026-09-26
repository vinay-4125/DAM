# DAM Project — Progress & Handoff

## 1. Project Overview

Project: Digital Asset Management (DAM)

Current backend:

* Node.js
* Express.js
* ES Modules
* AWS SDK
* Multer for file uploads
* Docker / Docker Compose
* PostgreSQL planned/used for application data
* AWS S3 planned for asset storage

Project directory in WSL:

```text
/home/vinay/projects/DAM
```

Windows equivalent location:

```text
\\wsl.localhost\Ubuntu-24.04\home\vinay\projects\DAM
```

---

## 2. Current Development Environment

Development is being done inside:

```text
WSL Ubuntu 24.04
```

Docker is available inside WSL.

Current Docker version:

```text
Docker version 29.2.1
```

npm is available:

```text
npm 11.19.0
```

Node/NVM is being configured inside WSL.

Important:

Windows and WSL have separate Node/NVM environments.

The Windows environment has its own NVM/Node installation, but it is not automatically available inside WSL.

For this project, development should preferably continue inside WSL.

---

## 3. Project Location

Current project:

```bash
cd ~/projects/DAM
```

Do NOT confuse this with the older Windows project location:

```text
E:\newrun\dam
```

Inside WSL, that Windows location is:

```text
/mnt/e/newrun/dam
```

The current DAM project being worked on is:

```text
/home/vinay/projects/DAM
```

---

## 4. package.json

Current package configuration:

```json
{
  "name": "dam",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "node src/app.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "module",
  "dependencies": {
    "@aws-sdk/client-s3": "^3.1141.0",
    "express": "^5.2.1"
  }
}
```

Note:

The `dev` script is:

```bash
npm run dev
```

It runs:

```bash
node src/app.js
```

This is an Express server, NOT a Vite/Next.js frontend server.

---

## 5. Current Express Server

Current `src/app.js`:

```js
import express from "express"

const app = express()

app.use(express.json())

app.get("/", (req,res)=>{
    res.json({
        message: "AWS Node.js learning server is running",
    })
})

const PORT = 3000

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})
```

Server:

```text
http://localhost:3000
```

Root endpoint:

```http
GET /
```

Expected response:

```json
{
  "message": "AWS Node.js learning server is running"
}
```

Start server:

```bash
npm run dev
```

---

## 6. File Upload Work

Multer was introduced for handling file uploads.

Install:

```bash
npm install multer
```

The request uses:

```text
multipart/form-data
```

In Postman:

```text
Body → form-data
```

Example:

```text
KEY       TYPE       VALUE
--------------------------------
asset     File       image.jpg
```

The field name is NOT required to be `"file"`.

The name is arbitrary.

For example:

```js
upload.single("asset")
```

means Postman must use:

```text
asset
```

The important rule is:

```text
Multer field name == Postman field name
```

Example:

```js
upload.single("file")
```

matches:

```text
file → File
```

And:

```js
upload.single("asset")
```

matches:

```text
asset → File
```

---

## 7. Multer Errors Encountered

### Error

```text
MulterError: Field name missing
```

Meaning:

The multipart request contained a file field without a field name.

Fix:

In Postman:

```text
Body → form-data
```

Make sure the KEY is not empty.

---

### Error

```text
MulterError: Unexpected file field
```

Meaning:

The field name sent by Postman does not match the field name configured in Multer.

Example:

Backend:

```js
upload.single("asset")
```

Postman must send:

```text
asset
```

Not:

```text
file
image
upload
```

unless the backend is changed accordingly.

---

## 8. Postman File Upload

Typical request:

```http
POST http://localhost:3000/upload
```

Body:

```text
form-data
```

Example:

```text
asset     | File | image.jpg
title     | Text | Product Banner
description | Text | Homepage banner
```

Do NOT manually set:

```text
Content-Type: multipart/form-data
```

Postman should generate the multipart boundary automatically.

---

## 9. Docker

Docker is installed and working inside WSL.

Check:

```bash
docker --version
```

Current version:

```text
Docker version 29.2.1
```

Docker Compose is also available.

Check:

```bash
docker compose version
```

---

## 10. Docker Compose

A Docker Compose configuration exists in:

```text
~/projects/DAM
```

Running:

```bash
docker compose up -d
```

successfully pulled:

```text
floci/floci:latest
```

and created:

```text
dam_default
dam_floci-data
dam-floci-1
```

The command output previously showed:

```text
✔ Image floci/floci:latest Pulled
✔ Network dam_default Created
✔ Volume dam_floci-data Created
✔ Container dam-floci-1 Created
```

Important:

`Created` does NOT necessarily mean the container is running.

Check all containers with:

```bash
docker compose ps -a
```

Check running containers:

```bash
docker compose ps
```

Check logs:

```bash
docker compose logs
```

Follow logs:

```bash
docker compose logs -f
```

If Compose says:

```text
no configuration file provided: not found
```

make sure you are inside:

```bash
cd ~/projects/DAM
```

before running Docker Compose commands.

---

## 11. Current Docker Issue To Continue

The latest known state was:

```bash
docker compose ps
```

returned only the table headers and no running containers.

This means the container is currently not running.

Next commands:

```bash
cd ~/projects/DAM
docker compose ps -a
```

Then:

```bash
docker compose logs
```

Find out why:

```text
dam-floci-1
```

stopped/exited.

Do NOT assume the reason until the logs are checked.

---

## 12. Git

Before committing, check:

```bash
git status
```

Review changes:

```bash
git diff
```

Stage:

```bash
git add .
```

Check staged files:

```bash
git status
```

Commit:

```bash
git commit -m "feat: add file upload support"
```

Check latest commit:

```bash
git log -1 --oneline
```

---

## 13. Important Git Safety

Never commit AWS credentials or other secrets.

`.gitignore` should include:

```gitignore
node_modules/
.env
.env.*
!.env.example
```

AWS keys, database passwords, API keys and tokens must remain outside Git.

If environment variables are needed, create:

```text
.env.example
```

with placeholder values.

Example:

```env
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=
DATABASE_URL=
```

Do NOT put actual credentials in `.env.example`.

---

## 14. Continuing On Another Device

On the new device:

### Install

* Git
* WSL 2
* Ubuntu
* Node.js / NVM
* Docker

Then clone the repository:

```bash
git clone <REPOSITORY_URL>
```

Enter the project:

```bash
cd DAM
```

Install dependencies:

```bash
npm install
```

Create the environment file:

```bash
cp .env.example .env
```

Then fill in the actual environment variables.

Start backend:

```bash
npm run dev
```

Start Docker services:

```bash
docker compose up -d
```

Check:

```bash
docker compose ps
```

---

## 15. Current API

### Health / Root Endpoint

```http
GET /
```

URL:

```text
http://localhost:3000/
```

Response:

```json
{
  "message": "AWS Node.js learning server is running"
}
```

---

## 16. Planned DAM Architecture

Expected overall architecture:

```text
Frontend
   |
   v
Express API
   |
   +--------------------+
   |                    |
   v                    v
PostgreSQL             AWS S3
   |                    |
   |                    |
Metadata              Asset Files
```

For an asset upload:

```text
Client
   |
   | multipart/form-data
   v
Express API
   |
   v
Multer
   |
   v
Upload Service
   |
   +----> AWS S3
   |
   +----> PostgreSQL metadata
```

---

## 17. DAM Asset Concept

An asset is the actual digital file managed by the DAM.

Examples:

```text
Images
Videos
PDFs
Documents
Audio
Design files
```

The physical file should eventually live in object storage such as S3.

PostgreSQL should store metadata such as:

```text
asset_id
filename
original_filename
mime_type
file_size
s3_key
s3_url
title
description
created_at
updated_at
```

---

## 18. Future DAM Features

Planned/possible features:

### Assets

* Upload asset
* Download asset
* Delete asset
* Update metadata
* Asset preview
* Asset versioning
* Asset search
* Asset filtering
* Asset categories
* Asset taxonomy

### Metadata

* Title
* Description
* Filename
* MIME type
* File size
* Dimensions
* Created date
* Updated date
* Custom metadata

### Taxonomy

Organize assets using:

```text
Taxonomy
   └── Category
        └── Subcategory
             └── Asset
```

### Campaigns

Assets can be associated with campaigns.

### Collections

Assets can be grouped into collections without necessarily moving the physical file.

### Global Search

Future search should allow searching across:

```text
Assets
Posts
Campaigns
Collections
Taxonomy
Metadata
```

Potential searchable fields:

```text
title
filename
asset ID
description
metadata
tags
```

---

## 19. AI-Powered Asset Search

A future feature is natural-language/AI search.

Example:

User searches:

```text
"Find images of people working in an office"
```

The system should be able to find relevant assets even when the exact phrase does not exist in the asset's filename or metadata.

Possible architecture:

```text
User query
    |
    v
Embedding model
    |
    v
Vector representation
    |
    v
Vector search
    |
    v
Relevant DAM assets
```

This can later be combined with PostgreSQL + vector capabilities.

---

## 20. Current Priority

Continue in this order:

1. Verify Docker Compose container status.
2. Fix the Floci container if it is exiting.
3. Finish Multer upload endpoint.
4. Test file upload from Postman.
5. Add AWS S3 upload service.
6. Add PostgreSQL connection.
7. Create asset database schema.
8. Save uploaded asset metadata.
9. Connect S3 object key with PostgreSQL asset record.
10. Add asset retrieval/download endpoint.
11. Add asset deletion.
12. Add proper error handling.
13. Add validation.
14. Add authentication/authorization.
15. Build frontend asset management UI.

---

## 21. Useful Commands

### Project

```bash
cd ~/projects/DAM
```

### Install dependencies

```bash
npm install
```

### Run backend

```bash
npm run dev
```

### Docker

```bash
docker compose up -d
docker compose ps
docker compose ps -a
docker compose logs
docker compose logs -f
docker compose down
```

### Git

```bash
git status
git diff
git add .
git commit -m "feat: add file upload support"
git log -1 --oneline
git pull
git push
```

### Node

```bash
node --version
npm --version
nvm --version
```

---

## 22. Important Current State

Last known working environment:

```text
OS environment: WSL Ubuntu 24.04
Project: ~/projects/DAM
Docker: 29.2.1
npm: 11.19.0
Backend: Express.js
Backend port: 3000
Module system: ES Modules
```

The next session should start by checking:

```bash
cd ~/projects/DAM
git status
docker compose ps -a
docker compose logs
```

Then continue from the current Docker/Multer/S3 implementation instead of recreating the project.
