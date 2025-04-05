# 🥗 RescueBites

RescueBites is an Android app that bridges the gap between food donors and people in need by redistributing surplus food in real time. The app aims to reduce food waste while fighting hunger through a community-powered system.

---

## 📱 Features

- 🔐 Secure login for Donors, Beneficiaries, and Distributors
- 📸 Add food listings with image, expiry date, and location
- 🧭 Find nearby pickup points using Google Maps
- 🔔 Get notified about new food and approvals
- 📦 Confirm pickups via QR code (planned)
- 📊 Donor analytics and reports (planned)

---

## 🚀 Tech Stack

- **Android** – Kotlin & Jetpack Compose + XML
- **Firebase Authentication** – for user login/register/reset
- **Firebase Firestore** – for storing food listings
- **Firebase Cloud Messaging (FCM)** – for push notifications
- **Google Maps SDK** – for pickup locations
- **ZXing** – QR Code scanning

---

## 🧾 Functional Requirements

| Req ID | Req Statement | Line Reference |
|--------|---------------|----------------|
| R1 | The system shall provide authenticated login for users, including Beneficiaries, Donors, and Distributors. | 24 |
| R2 | The system shall allow users to reset their password using a secure recovery process. | derived |
| R3 | The system shall allow donors to list surplus food with details such as type, quantity, expiry date, and pickup location. | 28, 29 |
| R4 | The system shall allow donors to update or remove food listings when food is no longer available. | 30 |
| R5 | The system shall allow beneficiaries to browse available food listings based on location and availability. | 8, 9, 32 |
| R6 | The system shall notify beneficiaries and donors when their food requests have been approved. | 39 |
| R7 | The system shall integrate Google Maps to help users locate pickup points for food collection. | 8, 36 |
| R8 | The system shall allow distributors to manage and track deliveries for users who cannot pick up food themselves. | 37 |
| R9 | The system shall send push notifications to beneficiaries for new food listings, request approvals, and pickup reminders. | 39, 40 |
| R10 | The system shall allow beneficiaries to confirm food pickup using a QR code or manual verification. | 43 |
| R11 | The system shall allow donors to track their donations and generate reports on food saved. | 44, 45, 46 |
| R12 | The system shall require an internet connection for account creation, login, and accessing food listings. | 47, 48 |
| R13 | The system shall allow donors to upload images of food items using their camera or device storage. | 49, 50 |
| R14 | The system shall use GPS to assist beneficiaries in finding the nearest food pickup points. | 36, 51, 52 |
| R15 | The system shall ensure secure authentication and data privacy for all users. | derived |
| R16 | The system shall allow users to log out. | derived |


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
