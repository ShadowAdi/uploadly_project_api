# Avatar Upload API

A secure and scalable RESTful API that allows users to upload, retrieve, update, and delete custom avatar images with NSFW detection and cloud storage support.

## 🧠 Features

- ✅ JWT-based user authentication
- ✅ Upload, update, and delete profile images
- ✅ Image validation (JPEG/PNG, max 2MB)
- ✅ Resizing to 256x256 using Sharp
- ✅ NSFW content detection
- ✅ Cloudinary storage
- ✅ Public avatar retrieval with proper caching
- ✅ Rate limiting on upload route
- ✅ Custom error handling and logging middleware

## 📦 Tech Stack

- **Node.js** + **Express.js**
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Cloudinary** for image hosting
- **Sharp** for image processing
- **winston** for logger
- **sightengine** or API-based moderation
- **Multer** for image upload
-  **CORS**, and **express-rate-limit** for security

## 📁 Folder Structure

├── src
    ├── controllers/
    ├── middlewares/
    ├── models/
    ├── routes/
    ├── utils/
    ├── envs/
    ├── config/
    ├── server.js
├──Uploads/
logs/
├── .env.example
├── README.md
└── DevifyXAPI.postman_collection.json


## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/ShadowAdi/uploadly_project_api
cd uploadly_project_api

2. Install dependencies

npm install

3. Environment setup

Create a .env file using the .env.example template.

cp .env.example .env

4. Run the project

npm start

🔐 API Endpoints

🧑 User

Method

Endpoint

Description

POST

/api/user/register

Register a new user

POST

/api/user/login

Login existing user

GET

/api/user/me

Get authenticated user

🖼️ Avatar

Method

Endpoint

Description

POST

/api/avatar/upload

Upload new avatar (auth required)

PUT

/api/avatar/upload

Update avatar (auth required)

DELETE

/api/avatar/upload

Delete avatar (auth required)

GET

/api/avatar/user-profile/:userId

Public avatar fetch endpoint

⚠️ Upload routes are rate-limited and support only .jpeg, .png files up to 2MB.

🛡️ Security & Validation

CORS enabled

Rate-limiting with rate-limiter-flexible

File type and size validation

JWT-secured routes

NSFW moderation

⚙️ Deployment Notes

Avatar images are uploaded to Cloudinary.

Local file support is also scaffolded but currently disabled.

Default fallback avatar is returned when user has no avatar.

✅ TODO / Trade-offs

❌ Admin moderation route (not implemented)

❌ GIF support (not implemented)

❌ Test coverage (not implemented due to time)

✅ Rate limiting (implemented)

✅ Postman Collection provided

✅ Logging via middleware (Winston or console fallback)

📬 Contact

Made with ❤️ by Aditya Shukla