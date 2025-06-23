# 📐 Avatar Upload API – Architecture & Trade-offs

This document outlines the architectural decisions and trade-offs made during the development of the Avatar Upload API.

---

## 🧩 Overview

The Avatar Upload API enables users to upload, update, retrieve, and delete profile images with built-in security, validation, and content moderation.

---

## 🛠️ Tech Stack

| Component          | Technology           |
|--------------------|----------------------|
| Runtime            | Node.js (v20+)       |
| Framework          | Express.js           |
| Authentication     | JSON Web Tokens (JWT)|
| Database           | MongoDB (Mongoose)   |
| Image Upload       | Multer               |
| Image Processing   | Sharp                |
| Image Hosting      | Cloudinary           |
| NSFW Moderation    | Sightengine API      |
| Rate Limiting      | express-rate-limit   |
| Logging            | Custom Winston logger|

---

## 📦 Core Modules

### 1. **User Module**
- Handles user registration, login, and fetching user details.
- Authenticated using JWT.
- Middleware: `CheckAuth` verifies JWT and injects user into `req`.

### 2. **Avatar Module**
- Endpoints for:
  - `Upload`: Accepts file via `Multer`, processes with `Sharp`, and uploads to **Cloudinary**.
  - `Update`: Replaces the existing Cloudinary image.
  - `Delete`: Removes image and reverts to a default avatar.
  - `Retrieve`: Public endpoint with caching headers.

---

## 🧠 Image Moderation

- Integrated **Sightengine API** to detect NSFW content on uploaded images.
- If content is flagged as NSFW, the image is rejected before upload.


---

## 📏 Validation & Security

- Files are validated for:
  - MIME type (`image/jpeg`, `image/png`)
  - Size limit (2MB)
- Rate limiting applied on upload endpoint to prevent spam/abuse.
- All sensitive operations require a valid JWT.

---

## 🖼️ Storage Strategy

- **Cloudinary** used for storing user avatars.
- Filenames are unique per user using their ID.
- Uploaded images are resized to `256x256` via Sharp before upload.

---

## 🔥 Error Handling

- Custom `CustomTryCatch` wrapper to avoid repetitive `try/catch`.
- Centralized `CustomErrorHandler` middleware handles all errors consistently with proper HTTP codes and messages.
- Custom `AppError` class so every error has some properties.

---

## 🚧 Trade-offs

| Area           | Decision                     | Trade-off |
|----------------|------------------------------|-----------|
| GIF Support     | ❌ Not implemented           | Limited functionality |
| Admin Endpoints | ❌ Not implemented           | No moderation UI |
| Tests           | ❌ Not included (manual only)| Less coverage |
| File Storage    | ✅ Cloudinary only           | Faster delivery, no local storage fallback |
| NSFW Detection  | ✅ Sightengine               | Requires API key, adds latency |

---

## 🧑‍🔧 Future Improvements

- ✅ Add unit/integration tests (Jest + Supertest)
- ✅ Add role-based admin endpoints
- ✅ Add support for GIFs and other formats
- ✅ Integrate caching (e.g., Redis) for avatar retrieval
- ✅ Dashboard for avatar moderation

---

## 👨‍💻 Author

Made by **Aditya Shukla**  
[GitHub](https://github.com/ShadowAdi/) • [Email](shadowshukla76@gmail.com)

