# Backend API Documentation: Commit31 Lost and Found

This directory contains the backend codebase for the **Commit31 Lost and Found** platform, built with **Node.js**, **Express**, **MongoDB**, and **Socket.IO**. It features a robust MVC architecture, JWT-based authentication, real-time messaging via WebSockets, and integrated security middleware.

---

## 📂 Folder Structure

```text
backend/
├── config/
│   └── db.js                  # MongoDB connection setup
├── controllers/
│   ├── authController.js      # Registration and login logic with JWT
│   ├── userController.js      # User profile operations
│   ├── itemController.js      # Item CRUD operations
│   ├── claimController.js     # Claim management
│   └── messageController.js   # Messaging between users
├── middlewares/
│   └── authMiddleware.js      # JWT token verification (protect middleware)
├── models/
│   ├── userModel.js           # User schema (with bcrypt password hashing)
│   ├── itemModel.js           # Lost/Found item schema
│   ├── claimModel.js          # Item claim/verification schema
│   └── messageModel.js        # User-to-user messaging schema
├── routes/
│   ├── auth.js                # Auth routes (/api/auth)
│   ├── user.js                # User routes (/api/users)
│   ├── item.js                # Item routes (/api/items)
│   ├── claim.js               # Claim routes (/api/claims)
│   └── message.js             # Message routes (/api/messages)
├── utils/
│   ├── generateToken.js       # JWT token generation utility
│   └── socket.js              # Socket.IO user tracking & notification helpers
├── validators/
│   ├── authValidator.js       # Auth input validation
│   ├── userValidator.js       # User input validation
│   └── messageValidator.js    # Message input validation
├── .env                       # Environment variables
├── package.json
└── server.js                  # Entry point and server configuration
```

---

## Getting Started

### Prerequisites

* **Node.js** (v14 or higher)
* **MongoDB** (Local instance or MongoDB Atlas)

### Installation

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the `backend/` directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/uni_find
   JWT_SECRET=your_super_secret_key
   JWT_EXPIRE=7d
   CORS_ORIGIN=http://localhost:3000
   ```

---

## 🏃 Running the Server

```bash
npm run dev     # Development mode (nodemon)
npm start       # Production mode
```

The backend will start at: `http://localhost:5000`

---

## 🔑 Authentication Flow

1. **Register/Login:** User sends credentials and receives a **JWT**.
2. **Authorization Header:** Include the token in all protected requests:
   ```text
   Authorization: Bearer <your_token>
   ```
3. **Verification:** The `protect` middleware verifies the token before granting access.

---

## 🛣️ API Routes

### 1. Authentication Routes (`/api/auth`)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/register` | Registers a new user and returns a JWT |
| `POST` | `/login` | Authenticates user and returns a JWT |

**Register Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "role": "student",
  "contactNumber": "9876543210"
}
```
> `role` defaults to `student`. `role` and `contactNumber` are optional.

**Response (both register & login):**
```json
{
  "_id": "...",
  "email": "john@example.com",
  "role": "student",
  "message": "User registered successfully",
  "token": "eyJhbGciOi..."
}
```

---

### 2. User Routes (`/api/users`) 🔒

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/me` | Get current user's profile |
| `GET` | `/` | List all users (excludes current user, supports `?search=`) |
| `GET` | `/:id` | Get public profile of a specific user |
| `PATCH` | `/profile` | Update name and/or contactNumber |
| `PATCH` | `/email` | Update email (requires current password) |
| `PATCH` | `/password` | Change password (requires current password) |

**List Users Query:** `GET /api/users?search=alice` — searches by name or email (case-insensitive, max 50 results).

**Public Profile Response:**
```json
{
  "_id": "...",
  "name": "Alice",
  "email": "alice@example.com",
  "role": "student",
  "contactNumber": "9876543210",
  "createdAt": "2026-01-15T10:30:00.000Z"
}
```

**Update Profile:**
```json
{
  "name": "New Name",
  "contactNumber": "9876543210"
}
```
> Both fields are optional — send only what you want to update.

**Update Email:**
```json
{
  "currentPassword": "yourpassword",
  "newEmail": "newemail@example.com"
}
```

**Change Password:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```
> Email and password changes require the current password for security verification.

---

### 3. Item Routes (`/api/items`) 🔒

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/` | Create a new lost/found item |
| `GET` | `/` | List all items |
| `GET` | `/:id` | Get a specific item |
| `PUT` | `/:id` | Update an item |
| `DELETE` | `/:id` | Delete an item |

---

### 4. Claim Routes (`/api`) 🔒

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/claims` | Create a new claim on an item |
| `GET` | `/items/:id/claims` | Get all claims for an item |
| `PATCH` | `/claims/:id/status` | Update claim status (approve/reject) |

---

### 5. Message Routes (`/api/messages`) 🔒

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/` | Send a message to another user about an item |
| `GET` | `/conversations` | List conversations (latest message per partner) |
| `GET` | `/with/:userId` | Get full message thread with a user |
| `GET` | `/unread/count` | Get unread message count |
| `PATCH` | `/:id/read` | Mark a message as read |

**Send Message Request Body:**
```json
{
  "receiver": "<user_id>",
  "item": "<item_id>",
  "content": "Hey, I think I found your wallet!"
}
```

**Query Parameters:**
- `GET /with/:userId?item=<itemId>` — Filter messages by a specific item

**Validation Rules:**
- Cannot send a message to yourself
- Receiver and item must be valid and exist in the database
- Content cannot be empty
- Only the receiver can mark a message as read
- Invalid IDs return `400` with a clear error

> 🔒 = Requires `Authorization: Bearer <token>` header

---

## 🔌 Real-Time (Socket.IO)

The backend uses **Socket.IO** for real-time communication, integrated alongside Express on the same HTTP server.

### Connection

Clients connect to the server's root namespace with their JWT:

```js
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  auth: { token: "<your_jwt>" },
});
```

### Authentication

Socket connections are authenticated via middleware that verifies the JWT from `socket.handshake.auth.token`. Unauthorized connections are rejected.

### Events

| Event | Direction | Payload | Description |
|---|---|---|---|
| `new_message` | Server → Client | Full populated message object | Emitted to the receiver when a new message is sent |

### User Tracking

The `utils/socket.js` module tracks connected users in memory using a `Map<userId, Set<socketId>>`, supporting multiple connections per user. Helper functions:

- `addUser(userId, socketId)` — Track a new connection
- `removeUser(socketId)` — Remove on disconnect
- `getSockets(userId)` — Get all socket IDs for a user
- `notifyUser(io, userId, event, data)` — Emit an event to all of a user's sockets

---

## 📊 Database Schemas

| Collection | Description |
|---|---|
| **User** | Accounts with name, email, hashed password, role, and contact info |
| **Item** | Lost/Found item reports with category, location, and status tracking |
| **Claim** | Verification requests linking a claimer to a found item with proof |
| **Message** | Direct messages between users, linked to a specific item |
