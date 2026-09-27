# Task 1: Weather-Driven Digital Twin Enhancement
## NexusTrip / TripLedger — HackCelestial Submission

---

## 📌 Problem Statement

Weather creates complex, delayed, and cascading effects across Hospitality & Travel — influencing transportation, traveler behavior, hotel occupancy, attraction demand, restaurant demand, events, workforce availability, and resource utilization.

As an enhancement to the existing HackCelestial solution, this task requires integrating an **AI-driven Digital Twin capability** into the current NexusTrip system rather than building a separate standalone application.

---

## 🎯 Objective

Extend the existing NexusTrip (TripLedger) solution with an intelligent, continuously learning simulation layer that:

- Understands how weather-driven changes propagate through the system
- Continuously estimates how real-world entities behave under changing weather conditions
- Simulates what-if and counterfactual scenarios
- Provides probabilistic predictions with associated uncertainty
- Uses insights to improve existing trip planning functionality

---

## ✅ Mandatory Integration Requirements

### 1. 🌤️ Live Weather Integration
Integrate a real-time weather API and use live/current or forecast weather data as an input to the AI model.

**Implementation:**
- **API**: OpenWeatherMap (free tier — 1,000 calls/day)
- **Data Used**: Current weather + 5-day forecast by trip destination city
- **Caching**: MongoDB WeatherCache collection (TTL: 30 minutes)
- **Endpoint**: GET /api/v1/trips/:tripId/digital-twin/weather
- **Data Points**: Temperature, humidity, precipitation, wind speed, weather alerts

---

### 2. 🗺️ Geospatial Map Visualization
Provide a map-based visualization showing relevant locations, entities, weather conditions, and/or simulated impact propagation.

**Implementation:**
- **Library**: Leaflet.js + React-Leaflet (free, no API key required)
- **Tile Provider**: OpenStreetMap (free)
- **Weather Overlay**: OpenWeatherMap precipitation tiles
- **Features**:
  - Trip destination as center anchor pin
  - Individual booking location pins (hotel, transport, activity)
  - Color-coded risk markers: Green=Low | Yellow=Medium | Red=High | Black=Critical
  - Clickable popups: booking name, type, risk score, direct weather effect
  - Impact propagation heatmap overlay

---

### 3. 📡 Real-World Social Signal Integration
Integrate social-media or publicly available social signals to capture real-world traveler/user reactions, reports, trends, or emerging conditions related to the weather event.

**Implementation:**
- **Source**: Reddit Public JSON API (reddit.com/search.json) — no API key required
- **Query**: {trip_destination} weather — sorted by new
- **Data Extracted**: Post titles, upvotes, publish timestamps, subreddit names
- **Analysis**:
  - Sentiment scoring (-1.0 to +1.0)
  - Trending keyword extraction
  - Emerging condition detection
- **Endpoint**: GET /api/v1/trips/:tripId/digital-twin/social

---

### 4. 🔁 Digital Twin What-If Simulation
Demonstrate at least one interactive scenario where changing a weather parameter produces a corresponding change in the existing system through the Digital Twin.

**Implementation:**
- **UI**: Interactive sliders in WhatIfSimulator.jsx
- **Controllable Parameters**:
  - Rainfall Intensity (0–500 mm)
  - Temperature Delta (−20C to +20C)
  - Storm Duration (0–72 hours)
  - Wind Speed (0–200 km/h)
  - Flood Toggle (boolean)
  - Extreme Heat Toggle (boolean)
- **Engine**: Groq AI (llama-3.3-70b-versatile) — already in project .env
- **Endpoint**: POST /api/v1/trips/:tripId/digital-twin/simulate
- **Output**: Updated risk scores, cascading effects, recommended actions for all bookings

---

## 🏗️ System Architecture

`
FRONTEND (React + Vite)
└── TripWorkspace.jsx
    └── Tab: Digital Twin
        ├── WeatherPanel.jsx        ← Live weather + 5-day forecast
        ├── MapView.jsx             ← Leaflet map with risk pins
        ├── ImpactDashboard.jsx     ← AI-computed cascading effects
        ├── WhatIfSimulator.jsx     ← Parameter sliders + simulation
        └── SocialSignals.jsx       ← Reddit sentiment + trending posts

BACKEND (Node.js + Express)
└── /api/v1/trips/:tripId/digital-twin/
    ├── GET  /weather               ← weatherService.js → OpenWeatherMap
    ├── GET  /social                ← socialService.js  → Reddit API
    ├── GET  /impact                ← digitalTwinService.js → Groq AI
    └── POST /simulate              ← digitalTwinService.js → Groq AI
`

---

## 📁 New Files Created

### Backend
| File | Purpose |
|---|---|
| backend/routes/digitalTwinRoutes.js | 4 API endpoints for the Digital Twin |
| backend/services/weatherService.js | OpenWeatherMap API integration + cache |
| backend/services/socialService.js | Reddit public JSON API scraper |
| backend/services/digitalTwinService.js | Groq AI digital twin impact engine |
| backend/models/WeatherCache.js | MongoDB model for weather response caching |

### Frontend
| File | Purpose |
|---|---|
| frontend/src/components/DigitalTwin/DigitalTwinTab.jsx | Main Digital Twin container |
| frontend/src/components/DigitalTwin/WeatherPanel.jsx | Live weather display |
| frontend/src/components/DigitalTwin/MapView.jsx | Leaflet geospatial map |
| frontend/src/components/DigitalTwin/ImpactDashboard.jsx | Cascading effects dashboard |
| frontend/src/components/DigitalTwin/WhatIfSimulator.jsx | Interactive what-if sliders |
| frontend/src/components/DigitalTwin/SocialSignals.jsx | Social signal sentiment panel |

### Minimal Changes to Existing Files
| File | Change |
|---|---|
| backend/server.js | +1 line: register digitalTwinRoutes |
| backend/.env | +1 line: OPENWEATHER_API_KEY |
| frontend/src/pages/TripWorkspace.jsx | +3 lines: import + tab item + panel render |

---

## 🤖 AI Digital Twin — Data Model

### Impact Entity (per Booking)
`json
{
  "bookingId": "string",
  "bookingName": "string",
  "type": "accommodation | transportation | activity | meal",
  "riskLevel": "low | medium | high | critical",
  "riskScore": 0.0,
  "directEffect": "string",
  "cascadingEffects": ["string"],
  "recommendedAction": "string",
  "probabilityOfImpact": 0.0,
  "confidenceInterval": [0.0, 0.0],
  "affectedParticipants": 0
}
`

### Twin State Response
`json
{
  "overallRiskScore": 0.0,
  "twinState": "normal | degraded | critical",
  "weatherSnapshot": {},
  "entities": [],
  "propagationChain": [],
  "narrativeSummary": "string",
  "generatedAt": "ISO timestamp",
  "isSimulation": false
}
`

### What-If Simulation Payload
`json
{
  "scenario": {
    "weatherParam": "rainfall | temperature | wind | storm_duration",
    "rainfallMm": 0,
    "tempDeltaCelsius": 0,
    "windKph": 0,
    "stormDurationHours": 0,
    "floodRisk": false,
    "extremeHeat": false,
    "location": "string"
  }
}
`

---

## 🌐 External APIs and Dependencies

| Service | Type | Auth Required | Cost |
|---|---|---|---|
| OpenWeatherMap | Weather data | API Key (free) | Free (1000 calls/day) |
| Reddit JSON API | Social signals | None | Free |
| OpenStreetMap | Map tiles | None | Free |
| Leaflet.js | Map library | None | Free (npm) |
| Groq (llama-3.3-70b) | AI reasoning | Already in .env | Already configured |

---

## 🎬 Demo Walkthrough (For Judges)

1. Open any trip with bookings (e.g., Mumbai Monsoon Trip)
2. Click the Digital Twin tab in TripWorkspace
3. WeatherPanel shows live rain data + 5-day forecast for Mumbai
4. Map View shows hotel/flight/activity pins colored red/yellow/green by risk
5. Impact Dashboard: Hotel flagged red — High flood risk on access road → transport delay cascade → meal booking disrupted
6. Social Signals: Reddit posts — "Mumbai roads flooded" trending, sentiment score: -0.73
7. What-If Simulator: Drag Rainfall to 350mm, Storm Duration to 12h, click Run Simulation
8. Updated Dashboard: Hotel = Critical, Flight = High, Tour = Cancelled (recommended), cost impact estimated 18400 INR
9. Reset: Click Back to Live Data — real forecast data restored

---

## 📊 Key Differentiators

- **Cascading Effect Engine**: Not just weather → single entity impact, but full chain: weather → hotel access → transport → participant delay → meal booking → refund trigger
- **Probabilistic Output**: Every prediction comes with a confidence interval, not just a risk label
- **Zero System Disruption**: Entire feature is additive — existing trip management, ledger, settlements untouched
- **Real Social Proof**: Reddit sentiment corroborates AI predictions with ground-truth traveler reports
- **Interactive Counterfactuals**: Judges can live-demo scenario changes in the browser

---

## 🔧 Environment Variables Required

`env
# Add to backend/.env
OPENWEATHER_API_KEY=your_free_key_from_openweathermap.org

# Already present — used for AI engine
GROQ_API_KEY=existing
OPENROUTER_API_KEY=existing
`

---

## 📅 Implementation Timeline

| Phase | Task | Duration |
|---|---|---|
| 1 | Backend weather service + MongoDB cache | ~1 hr |
| 2 | Social signal service (Reddit) | ~30 min |
| 3 | Groq AI digital twin impact engine | ~1.5 hr |
| 4 | Register all 4 backend endpoints | ~15 min |
| 5 | Frontend: 6 new components + Leaflet map | ~2 hr |
| 6 | Add Digital Twin tab to TripWorkspace | ~15 min |
| 7 | UI polish, animations, testing | ~1 hr |
| **Total** | | **~6.5 hrs** |

---

*Task defined by HackCelestial organizers as a mandatory enhancement to the existing Hospitality and Travel solution.*
