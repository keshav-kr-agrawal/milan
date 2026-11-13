# Godavari Milan (గోదావరి మిలన్ / गोदावरी मिलन)
**"The thread that brings you home."**
> Entry for **Ratan Tata Innovation Hub (RTIH) Godavari Pushkaralu 2027 Innovation Challenge**  
> **Track PS-03: Lost-Person Identification and Reunification Assistance**  
> *Festival Dates: 26 June – 7 July 2027 | Rajamahendravaram, Andhra Pradesh*

---

## ⚠️ Prototype Disclaimer
*Built for the RTIH Godavari Pushkaralu 2027 Innovation Challenge (Track PS-03). Prototype demonstration, not an official government service. Does not use any official state emblems or logos.*

---

## 1. Quick Start & Setup

### Prerequisites
- Node.js v18+ (tested on Node v22.19.0)
- npm v9+

### Installation & Launch
```bash
# Clone and enter workspace
git clone <repo-url>
cd milan

# Install dependencies
npm install

# Run build-time key-parity check & start dev server
npm run check:i18n
npm run dev
```

App will start locally at `http://localhost:5173`.

---

## 2. Key Features

| Feature | Description |
| :--- | :--- |
| **100% Trilingual Readiness** | Telugu (`te`), Hindi (`hi`), and English (`en`) across every single button, validation, modal, and paragraph. Strict build-time key parity check (`scripts/check-i18n-parity.cjs`). |
| **Temple-Town Dawn Aesthetics** | Authentic Indian color palette (Kesari `#C8691A`, Haldi `#D9A21B`, Kumkum `#A3261E`, Neel `#1F2A5C`, Godavari Teal `#1F6F78`, Chandan `#F4E9D4`). Custom SVG Kolam borders, Gopuram silhouette, and Raksha Sutra (holy thread) accents. |
| **Elder & Accessibility Mode** | Dedicated **Simple Mode (60+)** with >=20px text, icon+word on every button, Web Speech API read-aloud (`te-IN`, `hi-IN`, `en-IN`), text size controls (A-, A, A+, A++), and Dark Mode. |
| **Offline-First PWA & Dexie.js** | Full IndexedDB local storage. Reports queue offline with back-off sync. |
| **Privacy Tiers & DPDP Act 2023** | Public lookup conceals full phone numbers (masked e.g. `+91 98*** **321`). Zero address leaks. Masked `CallGateway` telephony simulation. Audited Help Desk override with PIN `2027`. |
| **Waterproof Wristband & ID Card** | QR codes encode `GM27:<BandID>`. Strict 3-print limit per member on family devices to prevent unauthorized duplication. Print stylesheets for 25x200mm band & CR80 card. |
| **Help Desk Command Hub** | PIN-gated triage dashboard (`2027`), live safety KPIs, interactive SVG Ghat Board, and mandatory 4-step reunification checklist before closing cases. |
| **ESP32 Ghat Edge Nodes** | Offline hotspot sync support (`/docs/edge-node.md`). Export sanitized masked lookup tables; import offline JSON dumps. |

---

## 3. How to Swap Gateway Adapters for Production

The codebase uses an adapter pattern in [`src/services/adapters.ts`](file:///Users/keshav/milan/src/services/adapters.ts):

### A. Swapping SMS OTP Gateway (Twilio / Exotel / Gupshup)
Open `src/services/adapters.ts` and replace `SmsOtpGateway`:
```typescript
export class SmsOtpGateway {
  static async sendOtp(phone: string) {
    // Production: Call your backend or SMS provider API
    const res = await fetch('https://api.exotel.com/v1/Accounts/AC/SMS/send', {
      method: 'POST',
      headers: { 'Authorization': `Basic ${process.env.EXOTEL_SECRET}` },
      body: JSON.stringify({ to: phone, message: 'Your Godavari Milan OTP is 123456' })
    });
    return res.json();
  }
}
```

### B. Swapping Masked Telephony Gateway (`CallGateway`)
Replace `CallGateway.initiateMaskedCall`:
```typescript
export class CallGateway {
  static async initiateMaskedCall(targetBandId: string, guardianMaskedPhone: string) {
    // Production: Connect via Twilio Proxy, Exotel Voice Bridge, or Kaleyra Number Masking
    return await fetch('/api/telephony/masked-bridge', {
      method: 'POST',
      body: JSON.stringify({ bandId: targetBandId })
    });
  }
}
```

---

## 4. Documentation Index
- 📋 [**Jury Demo Script (3-Minute Click Path)**](file:///Users/keshav/milan/docs/demo-script.md)
- 🔒 [**Privacy Architecture & DPDP Act 2023**](file:///Users/keshav/milan/docs/privacy.md)
- 📡 [**ESP32 Edge Node Hardware Specification**](file:///Users/keshav/milan/docs/edge-node.md)
- 🛕 [**Cultural & Festival Content Verification Checklist**](file:///Users/keshav/milan/docs/content-verification.md)

---

## 5. Build & Validation Scripts
```bash
# Validate that all 257 keys match in en.json, te.json, and hi.json with zero missing translations
npm run check:i18n

# Type-check and produce optimized production bundle
npm run build
```
# milan
