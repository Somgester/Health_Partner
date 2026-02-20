import {
  Activity,
  Calendar,
  MessageSquare,
  Pill as Pills,
  Clock,
  Heart,
  Search,
  Plus,
  ChevronDown,
  WeightIcon,
  RulerIcon,
  ChartCandlestickIcon,
  ChartColumnStackedIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";

import { format } from "date-fns";
import WeightChart from "./WeightChart";
import ConditionChart from "./ConditionChart";
import { UserDataContext } from "../../context/UserContext";
import BMIChart from "./BMIChart";
import axios from "axios";
import { CMH_ROUTES } from "../../cmhRoutes/cmh.routes";
const host = `${import.meta.env.VITE_BASE_URL}`;

const MyHealth = () => {
  const { user, setUser } = React.useContext(UserDataContext);
  const [showBookAppointment, setShowBookAppointment] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Appointment booking states
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [appointmentReason, setAppointmentReason] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isBooking, setIsBooking] = useState(false);
  
  // Upcoming appointments
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const weightData = user.weightData;
  const bmiData = user.bmiRecords;
  const latestBmi = user.bmiRecords[user.bmiRecords.length - 1]?.bmi;

  // Fetch doctors when modal opens
  useEffect(() => {
    if (showBookAppointment) {
      const fetchDoctors = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/doctor/all-doctors`
          );
          if (response.data && Array.isArray(response.data.doctors)) {
            setDoctors(response.data.doctors);
          }
        } catch (error) {
          console.error('Error fetching doctors:', error);
        }
      };
      fetchDoctors();
    }
  }, [showBookAppointment]);

  // Fetch available slots when doctor and date change
  useEffect(() => {
    if (selectedDoctor && appointmentDate) {
      const fetchSlots = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/patient/appointments/slots?doctorId=${selectedDoctor}&date=${appointmentDate}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            }
          );
          if (response.data && response.data.availableSlots) {
            setAvailableSlots(response.data.availableSlots);
            setAppointmentTime(''); // Reset time when date changes
          }
        } catch (error) {
          console.error('Error fetching slots:', error);
          setAvailableSlots([]);
        }
      };
      fetchSlots();
    }
  }, [selectedDoctor, appointmentDate]);

  // Handle appointment booking
  const handleBookAppointment = async (e) => {
    e.preventDefault();
    
    if (!selectedDoctor || !appointmentDate || !appointmentTime) {
      alert('Please fill in all required fields');
      return;
    }

    setIsBooking(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/patient/appointments/book`,
        {
          doctorId: selectedDoctor,
          appointmentDate: appointmentDate,
          appointmentTime: appointmentTime,
          reason: appointmentReason || 'General checkup'
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data && response.data._id) {
        alert('Appointment booked successfully!');
        setShowBookAppointment(false);
        setSelectedDoctor('');
        setAppointmentDate('');
        setAppointmentTime('');
        setAppointmentReason('');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert(error.response?.data?.message || 'Failed to book appointment');
    } finally {
      setIsBooking(false);
    }
  };

  //fetch active meditation
  useEffect(() => {
    const fetchActiveMedication = async () => {
      try {
        const response = await axios.get(
          `${host}/patient/activeMedicine/${user._id}`
        );
        setUser((prevUser) => ({
          ...prevUser,
          activeMedication: response.data.activeMedication,
        }));
      } catch (error) {
        console.error("Error fetching active medication:", error);
      }
    };

    fetchActiveMedication();
  }, []);

  // Fetch upcoming appointments
  useEffect(() => {
    const fetchUpcomingAppointments = async () => {
      try {
        setLoadingAppointments(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/patient/appointments?status=scheduled`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        if (response.data && Array.isArray(response.data.appointments)) {
          // Filter for future appointments only
          const now = new Date();
          const futureAppointments = response.data.appointments
            .filter(apt => new Date(apt.appointmentDate) >= now)
            .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));
          setUpcomingAppointments(futureAppointments);
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoadingAppointments(false);
      }
    };

    fetchUpcomingAppointments();
  }, []);

  return (
    <div className="p-5">
      <div className="mb-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {user.firstName}
        </h1>
        <p className="text-gray-600">Your health dashboard</p>
      </div>

      {/* Health Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white flex justify-between rounded-xl p-6 shadow-sm border border-gray-100">
          {/* Weight */}
          <div className="flex-1 flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <WeightIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-center">
              <p className="text-gray-600">Weight</p>
              <h3 className="text-lg font-bold">{user.weight} kg</h3>
            </div>
          </div>

          {/* Height */}
          <div className="flex-1 flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <RulerIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-center">
              <p className="text-gray-600">Height</p>
              <h3 className="text-lg font-bold">{user.height} cm</h3>
            </div>
          </div>

          {/* BMI */}
          <div className="flex-1 flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <ChartColumnStackedIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-center">
              <p className="text-gray-600">BMI</p>
              <h3 className="text-lg font-bold">{latestBmi}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-600">BloodGroup</p>
              <h3 className="text-xl font-bold">A+</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Pills className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-600">Medications</p>
              <h3 className="text-2xl font-bold">{user.activeMedication}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold mb-4">Health Trends</h2>
          <ConditionChart />
        </div>
        <div className="flex flex-col gap-5">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold mb-4">Weight Trends</h2>
            <WeightChart data={weightData} />
          </div>
          <div>
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold mb-4"> BMI Trends</h2>
              <BMIChart data={bmiData} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Appointments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Upcoming Appointments</h2>
              <button
                onClick={() => setShowBookAppointment(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors cursor-pointer"
              >
                <Plus className="w-5 h-5" />
                Book New
              </button>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {loadingAppointments ? (
              <div className="text-center py-8 text-gray-500">
                <p>Loading appointments...</p>
              </div>
            ) : upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appointment) => {
                const doctorName = appointment.doctor?.firstName && appointment.doctor?.lastName 
                  ? `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`
                  : 'Doctor';
                const appointmentDate = new Date(appointment.appointmentDate);
                const formattedDate = appointmentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                
                return (
                  <div
                    key={appointment._id}
                    onClick={() => setSelectedAppointment(appointment)}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center space-x-4">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <div>
                        <h3 className="font-medium">{doctorName}</h3>
                        <p className="text-sm text-gray-600">{appointment.reason || 'General Checkup'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formattedDate}</p>
                      <p className="text-sm text-gray-600">{appointment.appointmentTime}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No upcoming appointments</p>
              </div>
            )}
          </div>
        </div>

        {/* Medication Schedule */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold">Today&apos;s Medications</h2>
          </div>
          <div className="p-6 space-y-4">
            {[
              {
                name: "Lisinopril",
                dosage: "10mg",
                time: "8:00 AM",
                status: "taken",
              },
              {
                name: "Metformin",
                dosage: "500mg",
                time: "2:00 PM",
                status: "upcoming",
              },
            ].map((medication, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <h3 className="font-medium"> medine name</h3>
                    <p className="text-sm text-gray-600">medinuce dose </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">medicine time </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      medication.status === "taken"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {medication.status.charAt(0).toUpperCase() +
                      medication.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showBookAppointment && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Book an Appointment</h2>
                <button
                  onClick={() => setShowBookAppointment(false)}
                  className="text-blue-100 hover:text-white transition-colors p-2 hover:bg-blue-600 rounded-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <form onSubmit={handleBookAppointment} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Select Doctor
                </label>
                <select 
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="w-full rounded-lg border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                  required
                >
                  <option value="">Choose a doctor...</option>
                  {doctors.map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                      Dr. {doctor.firstName} {doctor.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="w-full rounded-lg border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Time Slot
                </label>
                <select 
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  className="w-full rounded-lg border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                  required
                >
                  <option value="">Choose a time...</option>
                  {availableSlots.map((slot, index) => (
                    <option key={index} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Reason for Visit
                </label>
                <textarea
                  value={appointmentReason}
                  onChange={(e) => setAppointmentReason(e.target.value)}
                  className="w-full rounded-lg border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                  rows="3"
                  placeholder="Describe your symptoms or reason for visit..."
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowBookAppointment(false)}
                  className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isBooking}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 cursor-pointer font-bold"
                >
                  {isBooking ? 'Booking...' : 'Book Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Appointment Details</h2>
                  <p className="text-blue-100">Scheduled with {selectedAppointment.doctor?.firstName} {selectedAppointment.doctor?.lastName}</p>
                </div>
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="text-blue-100 hover:text-white transition-colors p-2 hover:bg-blue-600 rounded-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Status Badge */}
              <div className="mb-6">
                <span className={`px-4 py-2 rounded-full text-sm font-bold capitalize inline-block ${
                  selectedAppointment.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                  selectedAppointment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                  selectedAppointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {selectedAppointment.status}
                </span>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                {/* Left Column */}
                <div>
                  {/* Doctor Card */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        👨‍⚕️
                      </div>
                      Doctor
                    </h3>
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                      <p className="text-gray-900 font-bold text-lg">
                        Dr. {selectedAppointment.doctor?.firstName} {selectedAppointment.doctor?.lastName}
                      </p>
                      {selectedAppointment.doctor?.email && (
                        <p className="text-sm text-gray-600 mt-2 flex items-center gap-2">
                          <span>📧</span>
                          {selectedAppointment.doctor.email}
                        </p>
                      )}
                      {selectedAppointment.doctor?.phone && (
                        <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                          <span>📱</span>
                          {selectedAppointment.doctor.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Reason */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        📝
                      </div>
                      Reason
                    </h3>
                    <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                      <p className="text-gray-900 font-medium">{selectedAppointment.reason || 'General Checkup'}</p>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div>
                  {/* Date & Time */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        📅
                      </div>
                      Date & Time
                    </h3>
                    <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                      <p className="text-gray-900 font-medium">
                        {new Date(selectedAppointment.appointmentDate).toLocaleDateString('en-US', { 
                          weekday: 'short',
                          month: 'short', 
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-3xl font-bold text-green-600 mt-2">{selectedAppointment.appointmentTime}</p>
                    </div>
                  </div>

                  {/* Consultation Mode */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        💻
                      </div>
                      Mode
                    </h3>
                    <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                      <p className="text-gray-900 font-medium capitalize">{selectedAppointment.consultationMode || 'Both'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              {selectedAppointment.notes && (
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Additional Notes</h3>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedAppointment.notes}</p>
                </div>
              )}

              {selectedAppointment.consultationMode === 'online' && selectedAppointment.meetingLink && (
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Meeting Link</h3>
                  <a 
                    href={selectedAppointment.meetingLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <span>🔗</span>
                    Join Meeting
                  </a>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-bold transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setSelectedAppointment(null);
                    // TODO: Implement reschedule functionality
                  }}
                  className="flex-1 px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold transition-colors"
                >
                  Reschedule
                </button>
                <button
                  onClick={() => {
                    setSelectedAppointment(null);
                    // TODO: Implement cancel functionality
                  }}
                  className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyHealth;
