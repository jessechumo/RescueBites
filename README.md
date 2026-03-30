# RescueBites

RescueBites is a cross-platform mobile app built with React Native that bridges the gap between food donors and people in need by redistributing surplus food in real time. The app reduces food waste while fighting hunger through a community-powered system.

---

## Features

- Secure login for Donors, Beneficiaries, and Distributors
- Add food listings with image, expiry date, and pickup location
- Browse available food listings with real-time search
- Google Maps integration to view and locate food pickup points
- GPS location used to record pickup coordinates and center the map
- Push notifications for new listings, claim approvals, and denials
- QR code confirmation for food pickup
- Donor analytics dashboard with reports on donations and approved claims
- Distributor delivery management
- Secure logout

---

## Tech Stack

- **React Native (JavaScript)** - functional components and hooks
- **Firebase Authentication** - login, registration, and password reset
- **Firebase Firestore** - food listings, claims, and user data
- **Firebase Cloud Messaging (FCM)** - push notifications
- **react-native-maps** - Google Maps pickup point display
- **@react-native-community/geolocation** - GPS for capturing and centering pickup locations
- **react-native-vision-camera** - camera access for QR scanning and photos
- **react-native-image-picker** - gallery and camera image selection
- **Cloudinary** - food image hosting
- **react-native-firebase** - Firebase SDK bindings for React Native

---

## Functional Requirements

| Req ID | Req Statement | Status |
|--------|---------------|--------|
| R1 | Authenticated login for Beneficiaries, Donors, and Distributors | Done |
| R2 | Password reset via secure recovery process | Done |
| R3 | Donors list surplus food with type, quantity, expiry date, and pickup location | Done |
| R4 | Donors update or remove food listings | Done |
| R5 | Beneficiaries browse available food listings by location and availability | Done |
| R6 | Notify beneficiaries and donors when food requests are approved | Done |
| R7 | Google Maps integration for locating food pickup points | Done |
| R8 | Distributors manage and track deliveries | Done |
| R9 | Push notifications for new food listings, request approvals, and pickup reminders | Done |
| R10 | Beneficiaries confirm food pickup via QR code or manual verification | Done |
| R11 | Donors track donations and generate reports | Done |
| R12 | Internet connection required for account creation, login, and listings | Done |
| R13 | Donors upload food images via camera or device storage | Done |
| R14 | GPS to assist beneficiaries in finding nearest food pickup points | Done |
| R15 | Secure authentication and data privacy | Done |
| R16 | Users can log out | Done |

---

## Use Case List

| Use Case # | Use Case Name                      |
|------------|------------------------------------|
| UC1        | Register User                      |
| UC2        | Log in User                        |
| UC3        | Reset Password                     |
| UC4        | Add Food Listing                   |
| UC5        | Update Food Listing                |
| UC6        | Browse Food                        |
| UC7        | Approve Food Request               |
| UC8        | Locate Pickup Points               |
| UC9        | Track Delivery                     |
| UC10       | Notify New Food Listing            |
| UC11       | Notify Request Approval            |
| UC12       | Send Food Pickup Reminder          |
| UC13       | Generate Food Pickup Code          |
| UC14       | Generate Saved Food Reports        |
| UC15       | Secure Authentication              |
| UC16       | Log out User                       |

---

## Design Class Diagram

![Screenshot From 2025-04-02 08-08-47](https://github.com/user-attachments/assets/e4ed7e87-8572-478b-b108-8048dbbd24fa)

---

## How to Run

### Prerequisites

- Node.js >= 18.x
- npm or yarn
- Android Studio (for emulator and SDKs) or a physical Android device
- Firebase project with `google-services.json`
- Google Maps API key (enabled for Android)

---

### 1. Clone the Repo

```bash
git clone https://github.com/jessechumo/RescueBites.git
cd RescueBites
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Add Firebase Config

- Go to [Firebase Console](https://console.firebase.google.com/)
- Create a project or use an existing one
- Enable Authentication (Email/Password), Firestore Database, and Cloud Messaging
- Download `google-services.json` and place it in `android/app/`

### 4. Add Google Maps API Key

- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Enable the Maps SDK for Android
- Create an API key and copy it
- Open `android/app/src/main/AndroidManifest.xml`
- Replace `YOUR_GOOGLE_MAPS_API_KEY` with your actual key

### 5. Start Metro Bundler

```bash
npx react-native start
```

### 6. Build and Run on Android

```bash
npx react-native run-android
```

Make sure a device or emulator is connected.

---

## Installing on a Physical Android Phone

There are two ways to install the app on a physical device without the Play Store.

### Option A: USB (ADB)

1. Enable Developer Options on the phone: go to Settings > About Phone > tap Build Number 7 times.
2. Enable USB Debugging under Settings > Developer Options.
3. Connect the phone to your computer via USB.
4. Verify the device is recognized:
   ```bash
   adb devices
   ```
5. Run the app directly:
   ```bash
   npx react-native run-android
   ```
   The app will be built and installed on the phone automatically.

### Option B: APK Side-load

1. Build a release APK:
   ```bash
   cd android
   ./gradlew assembleRelease
   ```
   The APK will be at `android/app/build/outputs/apk/general/release/app-general-release.apk`

2. Transfer the APK to the phone via USB, email, or cloud storage.

3. On the phone, go to Settings > Security (or Apps) and enable "Install from Unknown Sources" or "Allow from this source."

4. Open the APK file on the phone using a file manager and tap Install.

---

## Notes

- QR scanning uses `react-native-vision-camera` - tested on Android 10+
- Push notifications use FCM (legacy HTTP API). Replace the server key in `utils/notifications.js` with your own from the Firebase Console under Project Settings > Cloud Messaging.
- Google Maps requires a valid API key configured in `AndroidManifest.xml`
- GPS coordinates are captured automatically when a donor submits a food listing. The Map screen shows markers only for listings that have coordinates stored.
- Camera and microphone permissions are requested at runtime

---

## Future Plans

- Real-time delivery tracking with live geolocation
- Admin role for content moderation
- Export donation reports as PDF

---
