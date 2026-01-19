import { Route, BrowserRouter as Router, Routes, Link } from "react-router-dom"; // Import Link for navigation
import "./App.css";
import Login from "./components/LoginPage/Login";
import UserRegistrationForm from "./components/UserRegistration/UserRegistrationForm";
import UserDashboard from "./components/Dashboards/UserDashboard";
import FacilityDashboard from "./components/Dashboards/FacilityDashboard";
import FacilityRegistrationForm from "./components/FacilityRegistration/FacilityRegistrationForm";
import Home from "./pages/Home";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import VerifyPage from "./pages/VerifyPage";
import Dashboard from "./pages/Dashboard";
import PatientDashboard from "./pages/PatientDashboard";
import PatientProtectedWrapper from "./Wrapper/PatientProtectedWrapper";
import DoctorFinder from "./components/PatientComponents/DoctorFinder";
import Menstruation  from "./components/Menstruation/Menstruation"
import MyHealth from "./components/PatientComponents/MyHealth";
import AddMedicalRecord from "./components/PatientComponents/AddMedicalRecord";
import Notification from "./components/PatientComponents/Notification";
import PatientSetting from "./components/PatientComponents/PatientSetting";
import FindHospital from "./components/PatientComponents/FindHospital";
import DoctorProtectedWrapper from "./Wrapper/DoctorProtectedWrapper";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorSettings from "./components/doctorComponents/DoctorSettings"
import ManagePatients from "./components/doctorComponents/ManagePatients";
import PatientDetails from "./components/doctorComponents/PatientDetails";
import AccessControl from "./components/PatientComponents/AccessControl";
import MedicalDashboard from "./components/HospitalFacilityComponents/MainDashboard";
import MedicalRecordsPage from "./pages/MedicalRecordsPage";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<MedicalDashboard />} />
          <Route path="/register-facility" element={<FacilityRegistrationForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register/:role" element={<UserRegistrationForm />} />
          <Route path="reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/facility-dashboard" element={<FacilityDashboard />} />
          <Route path="/verify/:userID" element={<VerifyPage />} />
          <Route path="/dashboard/:" element={<Dashboard />} />
          {/* User Settings */}
          <Route
            path="/patient-dashboard/*"
            element={
              <PatientProtectedWrapper>
                <PatientDashboard />
              </PatientProtectedWrapper>
            }
          >
            <Route index element={<MyHealth />} />
            <Route path="myhealth" element={<MyHealth />} />
            <Route path="searchdoctor" element={<DoctorFinder />} />
            <Route path="menstruation" element={<Menstruation />} />
            <Route path="addmedicalrecord" element={<AddMedicalRecord />} />
            <Route path="findhospital" element={<FindHospital />} />
            <Route path="notification" element={<Notification />} />
            <Route path="user-settings" element={<PatientSetting />} />
            <Route path="access-control" element={<AccessControl />} />
            <Route path="medical-records" element={<MedicalRecordsPage />} />
          </Route>
          {/* doctor routes  */}
          <Route
            path="/doctor-dashboard/*"
            element={
              <DoctorProtectedWrapper>
                <DoctorDashboard />
              </DoctorProtectedWrapper>
            }
          >
            <Route index element={<MyHealth />} />
            <Route path="myhealth" element={<MyHealth />} />
            <Route path="menstruation" element={<Menstruation />} />
            <Route path="addmedicalrecord" element={<AddMedicalRecord />} />
            <Route path="findhospital" element={<FindHospital />} />
            <Route path="notification" element={<Notification />} />
            <Route path="user-settings" element={<DoctorSettings />} />
            <Route path="managepatients" element={<ManagePatients />} />
            <Route path="patient/:patientId" element={<PatientDetails />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
