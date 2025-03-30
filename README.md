# 🥗 RescueBites

RescueBites is an Android app that bridges the gap between food donors and people in need by redistributing surplus food in real time. The app aims to reduce food waste while fighting hunger through a community-powered system.

---

## 📱 Features

- 🔐 **User Authentication**
  - Register, Login, and Forgot Password with Firebase Authentication
  - Redirect flow based on auth state

- 👥 **User Roles**
  - Donor: Adds food listings
  - Beneficiary: Browses and requests food
  - Distributor: Handles delivery or pickups (Coming Soon)

- 🧾 **Food Listing**
  - Donors can add food items with quantity, expiry date, and pickup location

- 🗺️ **Pickup Tracking**
  - Google Maps integration for locating pickup points (Coming Soon)

- 📦 **QR Code Pickup Verification**
  - Secure pickup confirmation with QR scanning (Coming Soon)

- 🔔 **Notifications**
  - Real-time alerts for approved requests, reminders, and expiring items (Coming Soon)

- 📊 **Reports**
  - Donors can view reports on food saved and distributed (Coming Soon)

---

## 🚀 Tech Stack

- **Android** – Kotlin & Jetpack Compose + XML
- **Firebase Authentication** – for user login/register/reset
- **Firebase Firestore** – for storing food listings
- **Firebase Cloud Messaging (FCM)** – for push notifications
- **Google Maps SDK** – for pickup locations
- **ZXing** – QR Code scanning

---

## 🛠️ How to Run

1. Clone the repo:

   ```bash
   git clone https://github.com/your-username/RescueBites.git
   cd RescueBites
   ```
2. **Open in Android Studio:**

  - Open Android Studio
  - Choose **"Open an existing project"** and select the cloned `RescueBites` directory

3. **Connect Firebase:**

  - Create a project in [Firebase Console](https://console.firebase.google.com/)
  - Enable **Authentication** and **Firestore Database**
  - Download the `google-services.json` file
  - Place it inside the `app/` directory of your project

4. **Build the Project:**

  - Let Android Studio sync and download all dependencies
  - If prompted, click **Sync Now**

5. **Run the App:**

  - Connect a physical device or start an emulator
  - Click **Run ▶️** in Android Studio
  - The app should launch on your device

6. **Test the Flow:**

  - Register as a Donor, Beneficiary, or Distributor
  - Log in and verify role-based redirection
  - Try logging out and resetting password via email
