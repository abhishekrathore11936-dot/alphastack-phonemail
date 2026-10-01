# 📱 PhoneMail (Alphastack Buildathon Project)

PhoneMail is a next-generation communication platform that bridges traditional email and real-time messaging by using **phone numbers as email IDs** (e.g., `9876543210@phonemail.com`)[cite: 7]. Built with a mobile-first philosophy, it combines a WhatsApp-inspired chat interface with robust backend synchronization[cite: 7, 10].

---

## 🌟 Key Features

* **Phone-Number-as-Email-ID**: Seamlessly map telephone numbers to secure email handles[cite: 7].
* **WhatsApp-Inspired Mobile Client**: 
  * Onboarding flow (Language selection, Terms & Conditions, Phone Verification, and OTP/Password authentication)[cite: 7, 10].
  * Unified chat inbox organized by conversations rather than separate folders[cite: 8].
  * Filter chips for quick sorting: **All, Unread, Favourites, and Attachments**[cite: 8].
  * Interactive features including voice notes, document attachments, AI smart replies, and message forwarding/starring.
* **Real-Time WebSocket Sync**: Instant multi-session messaging powered by Node.js and Socket.io.
* **Live Notifications & Simulation**: Real-time alerts simulating official communications (Electricity Board bills, DigiLocker transcripts, Bank alerts, and Academic updates).

---

## 🛠️ Tech Stack

* **Frontend**: React, Vite, Socket.io-client[cite: 9, 10]
* **Backend**: Node.js, Express, Socket.io[cite: 9, 10]
* **Containerization**: Docker & Docker Compose

---

## 📂 Project Structure

```text
alphastack-phonemail/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── Dockerfile
├── mobile-client/
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
└── docker-compose.yml