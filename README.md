# Send SMS App

Minimal Next.js + TypeScript app to send SMS via **Traccar SMS Gateway** (Cloudflared tunnel).


## 🔹 Features
- Simple frontend form: phone number, message, send button
- Status messages: Sending, Success, Error
- Turkish character support (`ü, ı, ğ, ş, ç`)
- Backend API route `/api/send-sms` calls SMS Gateway
- Works via Cloudflared public tunnel to your phone
- Easy integration for OTP or reminder systems


## 🔹 System Architecture

Frontend Form (Next.js)  
│  
▼  
API Route (`/api/send-sms`)  
│  
▼  
SMS Sending Function (`/lib/sendSms.ts`)  
│  
▼  
Cloudflared Tunnel ([https://xxxx.trycloudflare.com](https://xxxx.trycloudflare.com))  
│  
▼  
Traccar SMS Gateway (Android Phone)  
│  
▼  
SMS Sent to Recipient

---




- **Frontend:** Takes user input (phone number + message) and calls backend.
- **API Route:** Receives request and forwards to SMS sending function.
- **SMS Function:** Sends POST request with JSON `{ to, message }` and `Authorization` header.
- **Cloudflared:** Exposes phone's local HTTP port to the internet.
- **Traccar SMS Gateway:** Phone app sends real SMS via mobile network.



## 🔹 Prerequisites

- Node.js 18+ and npm/yarn
- Android phone with Traccar SMS Gateway installed
- Cloudflared installed on phone or local machine
- SMS Gateway endpoint (local IP:port) and API key ready
- Optional: Termux for running Cloudflared on phone



## 🔹 Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd <project-folder>
````

### 2. Environment Variables

Create `.env.local`:

```env
SMS_URL=https://xxxx.trycloudflare.com
SMS_KEY=<TELEFON_LOCAL_API_KEY>
```

* `SMS_URL`: Cloudflared public URL tunneling to phone
* `SMS_KEY`: Traccar SMS Gateway API key

---

### 3. Install Packages

```bash
npm install
```

Packages include:

* **Next.js** (frontend + API routes)
* **React** (UI)
* **TypeScript** (typed JS)
* **node-fetch** (HTTP requests, if not native fetch)
* Dev dependencies: ESLint, Prettier, TypeScript

---

### 4. Run the App

```bash
npm run dev
```

Open browser at [http://localhost:3000](http://localhost:3000).

---

## 🔹 File Structure & Responsibilities

| File                    | Responsibility                                                |
| ----------------------- | ------------------------------------------------------------- |
| `pages/index.tsx`       | Frontend form (phone + message + send button + status)        |
| `pages/api/send-sms.ts` | API route receiving frontend request, calls SMS function      |
| `lib/sendSms.ts`        | SMS sending helper using fetch POST with Authorization header |
| `.env.local`            | Environment variables for SMS URL and API key                 |
| `tsconfig.json`         | TypeScript configuration                                      |
| `package.json`          | Project dependencies and scripts                              |

---

## 🔹 SMS Sending Logic

```ts
// lib/sendSms.ts
export async function sendSms(to: string, message: string) {
  const res = await fetch(process.env.SMS_URL!, {
    method: "POST",
    headers: {
      "Authorization": process.env.SMS_KEY!,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({ to, message }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`SMS failed: ${res.status} ${text}`);
  }

  return true;
}
```

* Uses **Cloudflared public URL** + **API key**.
* `charset=utf-8` ensures Turkish characters are sent correctly.
* Works for manual tests (curl) and backend automation.

---

## 🔹 Cloudflared Tunnel Setup (Optional: Termux / Phone)

```bash
pkg update && pkg upgrade -y
pkg install wget tar -y
wget https://bin.equinox.io/c/bNyj1mQVY4c/cloudflared-stable-linux-arm64.tgz
tar -xvzf cloudflared-stable-linux-arm64.tgz
chmod +x cloudflared
./cloudflared tunnel --url http://10.x.x.x:8082
```

* Replaces `10.x.x.x:8082` with your phone's SMS Gateway local IP
* Gives you a **public URL** (`https://xxxx.trycloudflare.com`)
* Use this URL in `SMS_URL`

---

## 🔹 Manual curl Test

```bash
curl -X POST "https://xxxx.trycloudflare.com" \
  -H "Authorization: <API_KEY>" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d '{"to":"+905551112233","message":"Merhaba, Türkçe karakterler: ü, ı, ğ"}'
```

* Tests if SMS Gateway + Cloudflared pipeline works

## Notes for Windows:

Use backticks ` at the end of each line in PowerShell (not \) for line continuation.

Double quotes " are for JSON strings, but inner quotes must be escaped as \".

You can also put it all on one line if you prefer:

```bash
curl -X POST "https://xxxx.trycloudflare.com" -H "Authorization: 03b5a583-ce58-40fa-9f33-8d055f7941d9" -H "Content-Type: application/json; charset=utf-8" -d "{\"to\":\"+905551112233\",\"message\":\"Merhaba, Türkçe karakterler: ü, ı, ğ\"}"
```

This works in both PowerShell and CMD, as long as you handle escaping correctly.

---

## 🔹 Next Steps / Recommendations

* Add OTP / scheduled SMS logic using database (PostgreSQL / Neon)
* Use Vercel Scheduler for periodic messages
* Optional: Reserved Cloudflared domain for stable URL
* Monitor battery & background permissions on Android
* Add logging / error tracking in production

---

## 🔹 Notes

* No OTP or database logic included; base app for sending test SMS
* Works on **anywhere-internet** scenario via Cloudflared tunnel
* Turkish character support enabled
* Minimal, clean, production-ready starter

---

## 🔹 Quick Setup Steps
* Prepare your Android phone: install **Traccar SMS Gateway** and **Termux**.
* Install **Cloudflared** via Termux on your phone.
* Retrieve the **local service endpoint** and **API token** from the SMS Gateway app.
* Expose the local endpoint to the internet using **Cloudflared**.
* Connect your Next.js app to the API using environment variables and verify with a **curl** test on your computer.
* This app provides a **basic Next.js implementation** for sending SMS.



---

## 🔹 License

MIT © 2025