# Push Notification PWA

A Progressive Web Application with push notification capabilities using React, Node.js, Firebase, and MongoDB.

## Project Structure

```
.
├── client/                 # React PWA frontend
├── server/                 # Node.js backend
├── .gitignore             # Git ignore file
└── README.md              # Project documentation
```

## Features

- React PWA with modern UI
- Push notifications using Firebase Cloud Messaging
- User token management with MongoDB
- Secure backend API
- Service Worker for offline capabilities

## Prerequisites

- Node.js (v16 or higher)
- MongoDB
- Firebase account
- npm or yarn

## Setup Instructions

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   MONGODB_URI=your_mongodb_uri
   FIREBASE_SERVICE_ACCOUNT=your_firebase_service_account_json
   PORT=5000
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your Firebase configuration:
   ```
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   REACT_APP_API_URL=http://localhost:5000
   ```

4. Start the development server:
   ```bash
   npm start
   ```

## Building for Production

### Frontend
```bash
cd client
npm run build
```

### Backend
```bash
cd server
npm run build
```

## License

MIT # push
