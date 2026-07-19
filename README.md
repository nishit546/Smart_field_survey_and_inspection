# 📋 Smart Field Survey & Inspection App

A **React Native** mobile application built with **Expo SDK 54** for conducting, managing, and submitting field inspection surveys. Designed as a complete field-data collection tool with camera capture, GPS location tracking, contact management, and clipboard utilities.

---

## 👤 Developer

| Field | Details |
|-------|---------|
| **Name** | Nishit |
| **Student ID** | SF-2026-99 |
| **Role** | Lead Field Inspector |
| **Repository** | [GitHub](https://github.com/nishit546/Smart_field_survey_and_inspection) |

---

## 📱 Features by Module

### Module 1 — Dashboard & Navigation
- Custom **Drawer Navigator** (light themed, grouped sections)
- **Bottom Tab Navigator** (Dashboard, New Survey, History, Profile)
- Global `SurveyContext` state shared across all screens
- Dashboard shows today's survey count, quick action cards, and recent surveys

### Module 2 — Create Survey Form
- Input fields: Site Name, Client Name, Description
- Priority selector: Low / Medium / High
- Date entry with one-tap **Today** shortcut
- Real-time **attachment checklist** (Camera, Location, Contact, Notes status)
- Field validation before preview

### Module 3 — Camera
- Live camera view using `expo-camera` (`CameraView`)
- Permission request flow
- Photo capture with timestamp overlay
- Image preview with delete confirmation

### Module 4 — Location
- GPS coordinates via `expo-location`
- Foreground permission handling
- Displays Latitude, Longitude, and Accuracy
- One-tap **Copy to Clipboard** and **Refresh** buttons

### Module 5 — Contacts
- Reads device contacts via `expo-contacts`
- Real-time search filter
- Avatar initials, phone number display
- Tap a contact to link them to the active survey
- Pull-to-refresh, empty state, and simulator mock data fallback

### Module 6 — Clipboard
- Copy **Survey ID**, **Contact Number**, or **GPS Coordinates** to system clipboard
- Editable **Notes text area** linked to the active survey
- **Paste from Clipboard** button appends clipboard text to notes
- **Clear Clipboard** button wipes system clipboard

### Module 7 — Survey Preview Modal
- **Preview Mode**: View the draft survey before submitting
- **View Mode**: View a saved historical survey record
- Displays all attachments: photo, location, contact, notes
- Actions: Submit / Edit / Delete

### Module 8 — Survey History
- FlatList of all submitted surveys
- Real-time **search** by site name or client name
- **Priority filter chips**: All / High / Medium / Low
- Pull-to-refresh
- Tap a card opens Survey Details modal
- Trash icon delete with confirmation alert

---

## 🛠️ Tech Stack

| Technology | Version |
|------------|---------|
| React Native | 0.81.5 |
| Expo SDK | ~54.0.35 |
| Expo Router | ~6.0.24 |
| React Navigation Drawer | ^7.13.2 |
| React Navigation Bottom Tabs | ^7.4.0 |
| expo-camera | ~17.0.10 |
| expo-location | ~19.0.8 |
| expo-contacts | ~15.0.11 |
| expo-clipboard | ~8.0.8 |
| expo-haptics | ~15.0.8 |
| TypeScript | 5.x |

---

## 📁 Project Structure

```
smart_field_survey/
├── app/
│   ├── _layout.tsx               # Root layout + SurveyProvider
│   ├── modal.tsx                 # Survey Preview / Details modal
│   └── (drawer)/
│       ├── _layout.tsx           # Drawer navigator (custom sidebar)
│       ├── camera.tsx            # Module 3 - Camera
│       ├── location.tsx          # Module 4 - Location
│       ├── contacts.tsx          # Module 5 - Contacts
│       ├── clipboard.tsx         # Module 6 - Clipboard
│       └── (tabs)/
│           ├── _layout.tsx       # Bottom tab navigator
│           ├── index.tsx         # Module 1 - Dashboard
│           ├── new-survey.tsx    # Module 2 - Create Survey
│           ├── history.tsx       # Module 8 - Survey History
│           └── profile.tsx       # Profile screen
├── components/
│   └── CustomHeader.tsx          # Reusable header with drawer toggle
├── context/
│   └── SurveyContext.tsx         # Global state: surveys, tempSurvey
├── constants/
│   └── theme.ts                  # Color tokens (violet theme)
└── hooks/
    └── use-color-scheme.ts       # Light/dark mode hook
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Expo Go app on your mobile device, or an Android/iOS simulator

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/nishit546/Smart_field_survey_and_inspection.git

# 2. Navigate to the project folder
cd Smart_field_survey_and_inspection/smart_field_survey

# 3. Install dependencies
npm install

# 4. Start the Metro bundler (clear cache)
npx expo start -c
```

Then scan the QR code with **Expo Go** on your phone, or press `a` for Android emulator / `i` for iOS simulator.

---

## 🎨 Color Theme

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#6d28d9` | Buttons, icons, active states |
| Light tint | `#ede9fe` | Active row backgrounds |
| Dark accent | `#a78bfa` | Dark mode tints |
| Success | `#10b981` | Submit / confirm states |
| Warning | `#d97706` | Medium priority |
| Danger | `#ef4444` | High priority / delete |

---

## 📄 License

This project is developed for educational purposes as part of a mobile application development assignment.