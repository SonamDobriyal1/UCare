# UCare API (Firestore + Gemini)

## Run

- Install deps: `npm install`
- Start API: `npm run dev:server`
- Health: `GET http://localhost:4000/api/health`

## Env

- `PORT` (default: 4000)
- `CORS_ORIGIN` (comma-separated list; default allows all origins)
- `GEMINI_API_KEY` (Google AI Studio API key)
- `FIREBASE_PROJECT_ID` (optional if present in service account)
- `FIREBASE_SERVICE_ACCOUNT` (JSON string) **or** `GOOGLE_APPLICATION_CREDENTIALS` (path)
- `JWT_SECRET` (required for login/signup)

Example `FIREBASE_SERVICE_ACCOUNT` value (escaped newlines in `private_key`):
```json
{"type":"service_account","project_id":"...","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"..."}
```

## Auth

The API uses a simple email/password login with JWT.

- `POST /api/auth/signup`
- `POST /api/auth/login`

Send the token in `Authorization: Bearer <token>`.

## Endpoints

- `GET /api/health`
- `GET /api/users/me` (auth)
- `PUT /api/users/me` (auth)
- `GET /api/posts?category=&q=&limit=&offset=`
- `POST /api/posts`
- `POST /api/posts/:id/like`
- `GET /api/posts/:id/replies`
- `POST /api/posts/:id/replies`
- `POST /api/contact`
- `POST /api/chat`
- `GET /api/chat/:sessionId`
- `GET /api/dashboard` (auth)

## Payloads

`POST /api/auth/signup`
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "min-8-chars"
}
```

`POST /api/auth/login`
```json
{
  "email": "jane@example.com",
  "password": "min-8-chars"
}
```

`POST /api/posts`
```json
{
  "title": "Small wins matter",
  "body": "Today marks 30 days...",
  "category": "Recovery",
  "authorName": "Anonymous",
  "anonymous": true
}
```

`POST /api/posts/:id/replies`
```json
{
  "body": "Thanks for sharing...",
  "authorName": "Sarah",
  "anonymous": false
}
```

`PUT /api/users/me`
```json
{
  "displayName": "Jane Doe",
  "photoUrl": "https://...",
  "bio": "Recovering and learning.",
  "location": "Austin"
}
```

`POST /api/contact`
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "message": "Looking for support options."
}
```

`POST /api/chat`
```json
{
  "message": "I'm feeling overwhelmed",
  "sessionId": "optional-existing-session-id"
}
```
