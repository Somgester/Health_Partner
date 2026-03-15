# Health_Partner: A Centralized Medical Healthcare System

A comprehensive healthcare management platform designed to connect patients, doctors, and medical facilities in a unified digital ecosystem.

## Project Overview

CMH (Centralized Medical Healthcare) is a full-stack application that enables seamless management of medical records, appointment scheduling, doctor-patient communication, and health tracking. The platform provides a secure environment for storing and sharing medical information with authorized healthcare providers.

## Features

### 🏥 For Patients

- **Digital Medical Records**: Store and manage your complete medical history in one place
- **Doctor Access Management**: Control which doctors can view your medical information
- **Medical Document Management**: Upload and organize prescriptions and medical reports
- **Health Tracking**: Monitor vital statistics like height, weight, and BMI over time
- **Menstruation Cycle Tracking**: Track and predict menstrual cycles with detailed phase information
- **Medication Reminders**: Set up reminders for taking medications on schedule
- **More features yet to come.**

### 👨‍⚕️ For Doctors

- **Patient Management**: View comprehensive medical histories of approved patients
- **Digital Prescriptions**: Issue digital prescriptions and treatment plans
- **Appointment Management**: Schedule and manage patient appointments
- **More features yet to come.**

### 🏥 For Medical Facilities

- **Facility Profile**: Maintain an online presence with facility information
- **Patient Record Access**: Access patient records with appropriate authorization
- **More features yet to come.**

## Tech Stack

### Backend
- **Node.js & Express**: RESTful API framework
- **MongoDB & Mongoose**: Database and ODM
- **JWT**: Authentication and authorization
- **Socket.io**: Real-time communication
- **Cloudinary**: Cloud storage for medical documents and images
- **Node-cron**: Scheduled tasks and reminders
- **Nodemailer & SendGrid**: Email notifications
- **Twilio**: SMS notifications and alerts

### Frontend
- **React**: UI library
- **Vite**: Build tool
- **Tailwind CSS**: Styling
- **Recharts**: Data visualization
- **Axios**: API communication
- **Socket.io-client**: Real-time updates

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB
- Cloudinary account
- SendGrid account (optional for now)
- Twilio account (optional for now)

### Installation

#### Backend Setup
1. Clone the repository
   ```
   git clone https://github.com/Somgester/CHM.git
   ```
   or
   ```
   git clone https://github.com/HARSHK2021/CHM.git
   ```
   Navigate to
   ```
   cd cmh/backend
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Set up environment variables
   Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=4000
   FRONTEND_URL=http://localhost:5173/
   MONGODB_URI=your_mongodb_connection_string
   EMAIL_FROM=your_email_id
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   GRID_API_KEY=your_sendgrid_api_key
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number
   ```

4. Start the backend server
   ```
   npm start
   ```
   For development with automatic restarts:
   ```
   npx nodemon
   ```

#### Frontend Setup
1. Navigate to the frontend directory
   ```
   cd ../frontend
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Set up environment variables
   Create a `.env` file in the frontend directory:
   ```
   VITE_BASE_URL=http://localhost:4000/api/v1
   ```

4. Start the development server
   ```
   npm run dev
   ```

## API Endpoints

### Auth Routes
- `POST /api/v1/auth/register`: Register a new user
- `POST /api/v1/auth/login`: Login and get authentication token
- `POST /api/v1/auth/send-otp`: Send OTP for verification
- `POST /api/v1/auth/verify-otp`: Verify OTP

### Patient Routes
- `GET /api/v1/patient/get-profile`: Get patient profile
- `POST /api/v1/patient/update-profile`: Update patient profile
- `POST /api/v1/patient/upload-medical-records`: Upload medical records
- `GET /api/v1/patient/medical-records`: Get all medical records
- `GET /api/v1/patient/medical-records/:id`: Get specific medical record
- `PATCH /api/v1/patient/medical-records/:id`: Update medical record

### Doctor Routes
- `GET /api/v1/doctors/profile`: Get doctor profile
- `POST /api/v1/doctors/update-profile`: Update doctor profile
- `GET /api/v1/doctors/patients`: Get doctor's patients

### Medical Facility Routes
- `GET /api/v1/facilities/profile`: Get facility profile
- `POST /api/v1/facilities/update`: Update facility profile

### Menstruation Tracking
- `POST /api/v1/patient/addmen`: Record period start
- `GET /api/v1/patient/tam`: Get current menstrual phase
- `GET /api/v1/patient/cycle`: Get cycle history

## Project Structure

```
/
├── backend/                # Backend code
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middlewares/        # Express middlewares
│   ├── models/             # Mongoose data models
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   ├── templates/          # Email templates
│   ├── utils/              # Utility functions
│   └── server.js           # Server entry point
│
└── frontend/               # Frontend code
    ├── public/             # Static assets
    └── src/                # React application
        ├── assets/         # Images and other assets
        ├── components/     # Reusable components
        ├── contexts/       # React contexts
        ├── cmhRoutes/      # API route definitions
        ├── pages/          # Application pages
        ├── Wrapper/        # Protected route wrappers
        ├── App.jsx         # Main component
        └── main.jsx        # Application entry point
```

## Key Features Implementation

### Medical Records Management
Users can upload, view, and manage their medical records including prescriptions, doctor diagnoses, and test reports.

### BMI Calculation and Tracking
The system automatically calculates BMI from user-provided height and weight measurements and tracks changes over time.

### Menstruation Cycle Tracking
Female users can track their menstrual cycles, with the system predicting future cycles and providing insights about fertility windows.

### Doctor-Patient Communication
Secure messaging system allows patients to communicate with their healthcare providers, with access controls to ensure privacy.

## Contributing?

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

<hr />
<br />
Made With Love 💖 By @Somgester and @HarshK2021
