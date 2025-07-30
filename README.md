# 🎬 Movie Streaming with Friends — Full Stack Project (Next.js + Microservices)

Watch videos together with friends, with real-time synchronized playback, chat, and video presence — all within a scalable, production-ready architecture following **SOLID principles**, **microservices**, and **modern frontend/backend separation**.

---

## 1. 🔧 Features Overview

| Feature                                             | Status         |
| --------------------------------------------------- | -------------- |
| Create / Join Rooms                                 | ✅ Implemented |
| YouTube Video Streaming                             | ✅ Implemented |
| Shared Playback Sync (Play/Pause/Seek)              | ✅ Implemented |
| Multi-user Rooms via Socket.IO                      | ✅ Implemented |
| Realtime Room Presence                              | ✅ Implemented |
| In-Room Text Chat                                   | 🔜 Planned     |
| Webcam Overlay (WebRTC)                             | 🔜 Planned     |
| Authentication                                      | 🔜 Planned     |
| Video Sharing (upload & broadcast)                  | 🔜 Planned     |
| Video Platform Integration (YouTube, Netflix, etc.) | 🔜 Planned     |

---

## 2. 🧠 Tech Stack

| Layer         | Stack                                                    |
| ------------- | -------------------------------------------------------- |
| **Frontend**  | Next.js (App Router), React 19, Tailwind CSS, TypeScript |
| **Backend**   | Node.js + Express + Socket.IO                            |
| **Auth**      | JWT + Refresh Tokens (Planned with Auth.js)              |
| **WebSocket** | Socket.IO (room-based)                                   |
| **Media**     | HTML5 Video, WebRTC (planned)                            |
| **Storage**   | Blob URLs (local), S3/Firebase (planned)                 |
| **Monorepo**  | Turborepo (apps & packages)                              |
| **Dev Tools** | ESLint, Prettier, Husky, VSCode                          |

---

## 3. 🧱 Project Architecture

```
movie-streaming-turbo/
├── apps/
│   ├── web/              → Frontend (Next.js 15)
│   └── socket-server/    → WebSocket backend (Express + Socket.IO)
├── packages/             → Shared code (planned: UI kit, auth utils)
├── public/               → Static files (optional shared video)
├── turbo.json            → Turborepo config
└── README.md
```

- **Monorepo**: Isolated apps using Turbo's caching and build orchestration.
- **Room-first design**: All socket actions scoped to room IDs.
- **Scalable foundation**: Future support for horizontal scaling with Redis pub/sub.

---

## 4. ✅ Key Design Patterns

| Pattern                    | Purpose                                        |
| -------------------------- | ---------------------------------------------- |
| **SOLID**                  | Clean module separation, testability           |
| **Factory**                | Room creation and socket channel setup         |
| **Observer**               | Syncing UI updates from Socket.IO messages     |
| **Dependency Injection**   | Planned for services (e.g., auth, video logic) |
| **Separation of Concerns** | Web, sockets, and auth are in separate layers  |
| **Microservices-ready**    | Frontend and backend deploy independently      |

---

## 5. 🧪 MVP Milestones

| Milestone                       | Status                      |
| ------------------------------- | --------------------------- |
| Basic Room Setup                | ✅                          |
| Youtube Video Playback          | ✅                          |
| Playback Sync (play/pause/seek) | ✅                          |
| Socket.IO Room-based Events     | ✅                          |
| Shared Video Sync               | ⏳ Partial (URL/Blob limit) |
| Chat UI                         | 🔜                          |
| Webcam Video (WebRTC)           | 🔜                          |
| Auth System                     | 🔜                          |
| Cloud Video Hosting             | 🔜                          |

---

## 6. 🔐 Auth Design (Planned)

- JWT-based authentication
- Refresh tokens for long-lived sessions
- Auth providers: Google OAuth (via Auth.js or NextAuth.js)
- Socket handshake with auth token validation

```ts
// Socket handshake example
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (validateToken(token)) next();
  else next(new Error("Authentication failed"));
});
```

---

## 7. 🔌 WebSocket Architecture

- **Room-scoped**: All actions (sync, chat, presence) are scoped to `roomId`
- **Client Actions**:
  - `join-room`, `playback`, `video-selected`
- **Server Relays**:
  - `sync-playback`, `video-selected`, `user-joined`, `user-left`

```ts
socket.on("playback", ({ roomId, action, currentTime }) => {
  socket.to(roomId).emit("sync-playback", { action, currentTime });
});
```

---

## 8. 📹 Video Sync Mechanism

### Current:

- Local file upload creates a Blob URL (local-only)
- Playback events broadcast to room
- All users must load the same video manually

### Limitations:

- Blob URLs are **not shareable**
- Cross-user streaming requires **hosted URLs**

### Planned:

- Upload API (Express or Firebase)
- Shareable video URLs (public access)
- Cloud or CDN delivery

---

## 9. 🔁 Sync Sources (Future)

| Source                           | Status | Sync Method              |
| -------------------------------- | ------ | ------------------------ |
| Local Video Files                | ✅     | HTML5 video + Socket.IO  |
| Hosted Files (S3, Firebase)      | 🔜     | Shareable URLs           |
| YouTube / Hotstar (experimental) | 🔜     | YouTube API + timestamps |
| Webcam Feed                      | 🔜     | WebRTC                   |

---

## 10. 📦 Deployment Plan

| Service           | Use                                |
| ----------------- | ---------------------------------- |
| **Frontend**      | Vercel                             |
| **Socket Server** | Render / Railway / Fly.io          |
| **Storage**       | S3 or Firebase                     |
| **Database**      | PlanetScale / Supabase (if needed) |

> Ensure Socket server supports WebSocket-only fallback for SSR compatibility

---

## 11. 🧪 Testing Strategy

| Layer     | Strategy                                     |
| --------- | -------------------------------------------- |
| Frontend  | Vitest + React Testing Library (planned)     |
| WebSocket | Manual E2E with multiple tabs                |
| Auth      | Postman + token validation                   |
| CI/CD     | GitHub Actions for lint/build/test (planned) |

---

## 🚀 Getting Started (Dev)

```bash
# Root
git clone https://github.com/sriniasgarnepalli/movie-straming
cd movie-streaming-turbo
npm install

# Start backend
cd apps/socket-server
node server.js

# Start frontend
cd ../web
npm run dev
```

---

## 🙌 Contributing

Open to feedback, PRs, and collaboration!

---

## 📄 License

MIT

---

## ✨ Author

Built with ❤️ by [@SrinivasGarnepalli](https://github.com/sriniasgarnepalli)
