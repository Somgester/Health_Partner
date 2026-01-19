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

  const weightData = user.weightData;
  const bmiData = user.bmiRecords;
  const latestBmi = user.bmiRecords[user.bmiRecords.length - 1]?.bmi;

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
                className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Book New
              </button>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {[
              {
                doctor: "Dr. Sarah Wilson",
                specialty: "Cardiologist",
                date: "2024-03-20",
                time: "10:00 AM",
              },
              {
                doctor: "Dr. Michael Brown",
                specialty: "General Physician",
                date: "2024-03-25",
                time: "2:30 PM",
              },
            ].map((appointment, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <h3 className="font-medium"> doctor xyz </h3>
                    <p className="text-sm text-gray-600">cardio serugen</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">10/2/1000</p>
                  <p className="text-sm text-gray-600">10:20</p>
                </div>
              </div>
            ))}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Book an Appointment</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Specialty
                </label>
                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                  <option>Cardiology</option>
                  <option>General Medicine</option>
                  <option>Pediatrics</option>
                  <option>Orthopedics</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  value={format(selectedDate, "yyyy-MM-dd")}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Time
                </label>
                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                  <option>09:00 AM</option>
                  <option>10:00 AM</option>
                  <option>11:00 AM</option>
                  <option>02:00 PM</option>
                  <option>03:00 PM</option>
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowBookAppointment(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Book Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyHealth;
