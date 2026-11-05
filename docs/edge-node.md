# Godavari Milan — ESP32 Ghat Edge Node Specification
**RTIH Godavari Pushkaralu 2027 Innovation Challenge (Track PS-03)**

## 1. Overview & Problem Statement
During peak bathing days of Godavari Pushkaralu (such as *Adi Pushkaram* or *Maha Pushkara Snanam*), cellular carrier towers across Rajamahendravaram experience extreme network congestion or backhaul latency. Remote ghat sectors and transit parking sheds often lose internet entirely.

To maintain 100% uninterrupted lost-person reporting and band lookup, Godavari Milan supports offline **ESP32 Edge Hotspots**. Each low-cost, battery-operated ESP32 node (running MicroPython or Arduino C++) broadcasts a local ghat WiFi network (e.g., `Milan-PushkarGhat-01`) with a lightweight captive web portal.

---

## 2. Hardware Architecture & Bill of Materials (BOM)
- **Microcontroller**: ESP32-WROOM-32 or ESP32-S3 (with 8MB PSRAM and 16MB Flash)
- **Power**: 5V USB power bank or 18650 Li-ion battery shield with solar trickle charging
- **Enclosure**: IP67 waterproof polycarbonate outdoor box mounted on ghat marshal posts or patrol poles
- **Range**: ~75 to 100 meters unobstructed along the river ghat

---

## 3. Network & Captive Portal Configuration
- **WiFi Mode**: Access Point (AP) mode with Captive Portal DNS redirection
- **SSID**: `Milan-Ghat-[Location]-[NodeID]` (e.g., `Milan-Kotilingala-02`)
- **Gateway IP**: `192.168.4.1`
- **DNS Server**: Redirects all requests (`*`) to `192.168.4.1:80`

---

## 4. REST API Contract

### 4.1 Lookup Band (Masked Privacy Tier)
- **Endpoint**: `GET /lookup?id=<BAND_ID>`
- **Description**: Returns sanitized, masked pilgrim safety information. Never returns full phone number or home address.
- **Sample Request**:
  ```http
  GET /lookup?id=GM27-K7M2-1 HTTP/1.1
  Host: 192.168.4.1
  ```
- **Sample Response**:
  ```json
  {
    "status": "success",
    "band_id": "GM27-K7M2-1",
    "first_name": "Sai Krishna",
    "age_group": "child",
    "language": "te",
    "masked_phone": "+91 98*** **456",
    "stay_location": "Kotilingala Ghat Camp",
    "helpline": "112"
  }
  ```

### 4.2 Submit Found / Missing Report
- **Endpoint**: `POST /report`
- **Headers**: `Content-Type: application/json`
- **Sample Payload**:
  ```json
  {
    "id": "NODE-02-CASE-8491",
    "type": "found",
    "person_name": "Chinnu",
    "age_group": "child",
    "language": "te",
    "clothing": "Yellow shirt, blue trousers",
    "ghat": "kotilingala",
    "timestamp": "2027-06-27T10:45:00Z"
  }
  ```
- **Response**:
  ```json
  {
    "status": "queued",
    "message": "Report stored in node Flash. Nearest Help Desk is Desk 02 (Kotilingala North)."
  }
  ```

### 4.3 Export Cases Dump (For Officer Sync)
- **Endpoint**: `GET /export`
- **Description**: Authorized officer downloads flash memory case log to import into Central Godavari Milan Dashboard.
- **Response**: JSON array of all cases collected on that node.

---

## 5. Synchronization Workflow
1. **Pre-deployment**: Help Desk officer clicks **"Export Masked Lookup Table"** from the Godavari Milan Dashboard and loads `esp32_godavari_milan_masked_lookup_*.json` onto the node's SPIFFS/LittleFS storage.
2. **During Outage**: Pilgrims and volunteers connect to `Milan-Ghat-XX` WiFi to report lost persons or scan QR codes locally.
3. **Reconnection / Officer Sync**: A volunteer or roving patrol officer downloads `/export` from the node and uploads it into the **Offline Ghat Nodes** hub in Godavari Milan. The web app automatically validates schemas, deduplicates IDs, and runs client-side matching.
