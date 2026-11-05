# Privacy Architecture & DPDP Act 2023 Compliance
**Godavari Milan (RTIH Godavari Pushkaralu 2027 Innovation Challenge PS-03)**

## 1. Compliance with the Digital Personal Data Protection (DPDP) Act, 2023
Godavari Milan is architected from the ground up to respect Indian data privacy legislation, safeguarding pilgrims, women, children, and vulnerable elders visiting Godavari Pushkaralu 2027 in Rajamahendravaram.

---

## 2. Core Privacy Principles

### 2.1 Verifiable Parental Consent for Minors (Section 9)
- Children under 18 cannot be registered without explicit, affirmative consent from a verified guardian.
- The consent screen is written in simple, plain language in Telugu, Hindi, and English.
- The registration form requires an explicit checkbox acknowledgment before saving.

### 2.2 Strict Data Minimisation (Section 6)
- The system collects only what is strictly necessary to identify a separated pilgrim:
  - First name
  - Age / Age group
  - Relation
  - Primary spoken language
  - Clothing description and last seen location
  - Optional face thumbnail for local feature vector calculation
- **No Aadhaar numbers, biometric raw scans, or permanent home addresses** are stored in public-facing tables.

### 2.3 Tiered Privacy & Concealment of Personal Identifiers
1. **Public Scan Tier (Anyone scanning a band QR or entering an ID)**:
   - Full mobile phone numbers are **strictly masked** (e.g., `+91 98*** **321`).
   - The user is provided a secure, simulated telephonic bridge (`CallGateway`) that connects finder to guardian without revealing numbers.
   - Exact home address and confidential medical notes are completely omitted.
2. **Guardian Consent Tier**:
   - If a volunteer or Samaritan requires full profile access, an urgent consent prompt is dispatched to the guardian's device.
   - If granted, temporary 10-minute view-only access is provided.
   - If unanswered within 5 minutes, the request safely auto-escalates to the Help Desk.
3. **Police & Help Desk Emergency Override Tier**:
   - Police officers and Help Desk staff can unlock full records under emergency override.
   - Every single override requires entering the Officer Access PIN (`2027`) and a formal justification.
   - The action is permanently recorded in the immutable `access_log` with timestamp, officer name, and case ID.

### 2.4 Client-Side Face Matching & Zero Biometric Transmission
- Facial feature descriptors are computed on the user's browser/device.
- Raw full-resolution photos are **never** broadcast across unauthenticated networks.
- Facial comparisons are treated as **assistive hints**; an automated algorithm is never permitted to make the final determination. Only a human officer can confirm after verifying government ID.

### 2.5 30-Day Post-Festival Purge & Storage Limitation (Section 8)
- All pilgrim records, photos, and descriptors stored for Pushkaralu 2027 are scheduled for complete and irreversible deletion 30 days after the festival conclusion (7 August 2027).
- Access logs are archived strictly for mandatory statutory audit.
