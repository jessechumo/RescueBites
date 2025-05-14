# 🥗 RescueBites

RescueBites is a cross-platform mobile app built with React Native that bridges the gap between food donors and people in need by redistributing surplus food in real time. The app aims to reduce food waste while fighting hunger through a community-powered system.

---

## 📱 Features

- 🔐 Secure login for Donors, Beneficiaries, and Distributors
- 📸 Add food listings with image, expiry date, and location
- 🧭 Find nearby pickup points using Google Maps
- 🔔 Get notified about new food and approvals
- 📦 Confirm pickups via QR code
- 📊 Donor analytics and reports (planned)

---

## 🚀 Tech Stack

- **React Native (JavaScript)** – built with functional components and hooks
- **Firebase Authentication** – for user login/register/reset
- **Firebase Firestore** – for storing food listings
- **Firebase Cloud Messaging (FCM)** – for push notifications
- **Google Maps SDK** – for locating pickup points
- **react-native-camera** – for QR code scanning
- **react-native-qrcode-svg** – for generating QR codes
- **react-native-firebase** – Firebase SDK bindings for React Native

---

## 🧾 Functional Requirements

| Req ID | Req Statement | 
|--------|---------------| 
| R1 | The system shall provide authenticated login for users, including Beneficiaries, Donors, and Distributors. |  
| R2 | The system shall allow users to reset their password using a secure recovery process. | 
| R3 | The system shall allow donors to list surplus food with details such as type, quantity, expiry date, and pickup location. |  
| R4 | The system shall allow donors to update or remove food listings when food is no longer available. |  
| R5 | The system shall allow beneficiaries to browse available food listings based on location and availability. |  
| R6 | The system shall notify beneficiaries and donors when their food requests have been approved. |  
| R7 | The system shall integrate Google Maps to help users locate pickup points for food collection. |  
| R8 | The system shall allow distributors to manage and track deliveries for users who cannot pick up food themselves. | 
| R9 | The system shall send push notifications to beneficiaries for new food listings, request approvals, and pickup reminders. |  
| R10 | The system shall allow beneficiaries to confirm food pickup using a QR code or manual verification. |  
| R11 | The system shall allow donors to track their donations and generate reports on food saved. |  
| R12 | The system shall require an internet connection for account creation, login, and accessing food listings. |  
| R13 | The system shall allow donors to upload images of food items using their camera or device storage. |  
| R14 | The system shall use GPS to assist beneficiaries in finding the nearest food pickup points. | 
| R15 | The system shall ensure secure authentication and data privacy for all users. | 
| R16 | The system shall allow users to log out. |  

---

## 📋 Use Case List

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
| UC13       | Generate Food Pickup code          |
| UC14       | Generate Saved Food Reports        |
| UC15       | Secure Authentication              |
| UC16       | Log out User                       |

---

## 📦 Design Class Diagram
     
![Screenshot From 2025-04-02 08-08-47](https://github.com/user-attachments/assets/e4ed7e87-8572-478b-b108-8048dbbd24fa)

---

## 🛠️ How to Run  

### Prerequisites

- Node.js >= 16.x
- npm or yarn
- Android Studio (for emulator + SDKs)
- Firebase project with `google-services.json`

---

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/RescueBites.git
cd RescueBites
```

### 2. Install Dependencies

```bash
npm install
# or
yarn
```

### 3. Add Firebase Config

- Go to [Firebase Console](https://console.firebase.google.com/)
- Create a project (or use existing)
- Enable:
  - **Authentication** (Email/Password)
  - **Firestore Database**
  - **Cloud Messaging**
- Download `google-services.json` and place it in `android/app/`

---

### 4. Start Metro Bundler

```bash
npx react-native start
```

### 5. Build & Run App on Android

```bash
npx react-native run-android
```

> Make sure a device or emulator is connected.

---

### ✅ For Demo

- Log in as Donor, Beneficiary, or Distributor
- Donors can add/edit/delete listings
- Beneficiaries can browse and claim food
- QR Scanner works for confirming pickup

---

## 📌 Notes

- QR scanning uses `react-native-camera` – tested on Android 10+
- Push notifications use FCM (v1 API)
- Google Maps uses API key configured in `AndroidManifest.xml`
- Notifications trigger on new food added or claim approved

---

## 💡 Future Plans

- Real-time delivery tracking with geolocation
- Analytics dashboard for donors
- Admin role for moderation

---

