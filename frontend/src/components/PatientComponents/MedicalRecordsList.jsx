import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import axios from "axios";
import {
  Clock,
  Calendar,
  User,
  Home,
  FileText,
  Activity,
  ArrowLeft,
  ScanHeart,
  Stethoscope,
  Loader,
} from "lucide-react";
import { CMH_ROUTES } from "../../cmhRoutes/cmh.routes";

const MedicalRecordsList = () => {
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedicalRecords = async () => {
      try {
        setLoading(true);
        // Get token from localStorage
        const token = localStorage.getItem("token");
        const id = localStorage.getItem("id");
       
        
        if (!id) {
          throw new Error("Ran Into an error while fetching your records");
        }

        if (!token) {
          throw new Error("Authentication required");
        }

        //get specific
        // Fetch medical records for the authenticated user
        const response = await axios.get(`${CMH_ROUTES.GET_MEDICAL_RECORD_BY_ID}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setRecords(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching medical records:", err);
        setError(
          err.response?.data?.message || "Failed to fetch medical records"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMedicalRecords();
  }, []);

  const getStatusColor = (status) => {
    return status === "recovered"
      ? "bg-green-100 text-green-800"
      : status === "critical"
      ? "bg-red-100 text-red-800"
      : "bg-yellow-100 text-yellow-800";
  };

  const handleCardClick = (record) => {
    setSelectedRecord(record);
  };

  const handleBack = () => {
    setSelectedRecord(null);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center bg-white p-8 rounded-lg shadow-sm">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-700">Loading medical records...</p>
        </div>
      </div>
    );
  }

  if (selectedRecord) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="w-full">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-700 hover:text-gray-900 mb-6 bg-white px-4 py-2.5 rounded-lg shadow-sm border border-gray-200 transition-all"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Records
          </button>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {selectedRecord.condition}
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    selectedRecord.recoveryStatus
                  )}`}
                >
                  {selectedRecord.recoveryStatus.charAt(0).toUpperCase() +
                    selectedRecord.recoveryStatus.slice(1)}
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>
                    Diagnosed:{" "}
                    {format(
                      new Date(selectedRecord.dateDiagnosed),
                      "MMM dd, yyyy"
                    )}
                  </span>
                </div>

                {selectedRecord.symptoms.length > 0 && (
                  <div className="flex items-start text-gray-600">
                    <Activity className="w-5 h-5 mr-2 mt-1" />
                    <div className="flex flex-wrap gap-2">
                      {selectedRecord.symptoms.map((symptom, idx) => (
                        <span
                          key={idx}
                          className="bg-gray-100 px-3 py-1.5 rounded-md text-sm"
                        >
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedRecord.doctor && (
                  <div className="flex items-center text-gray-600">
                    <User className="w-5 h-5 mr-2" />
                    <span>Dr. {selectedRecord.doctor}</span>
                  </div>
                )}

                {selectedRecord.hospital && (
                  <div className="flex items-center text-gray-600">
                    <Home className="w-5 h-5 mr-2" />
                    <span>{selectedRecord.hospital}</span>
                  </div>
                )}
              </div>

              {selectedRecord.medicines.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-medium text-gray-900 mb-4">
                    Medicines
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedRecord.medicines.map((medicine, idx) => (
                      <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                        <div className="font-medium text-gray-900">
                          {medicine.name}
                        </div>
                        <div className="text-sm text-gray-600 mt-2">
                          {medicine.dosage && (
                            <div>Dosage: {medicine.dosage}</div>
                          )}
                          {medicine.frequency && (
                            <div>Frequency: {medicine.frequency}</div>
                          )}
                          {medicine.duration && (
                            <div>Duration: {medicine.duration}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedRecord.additionalNotes && (
                <div className="mt-8">
                  <h3 className="text-xl font-medium text-gray-900 mb-4">
                    Additional Notes
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start text-gray-600">
                      <FileText className="w-5 h-5 mr-2 mt-1" />
                      <p>{selectedRecord.additionalNotes}</p>
                    </div>
                  </div>
                </div>
              )}

              {(selectedRecord.prescriptionImages?.length > 0 ||
                selectedRecord.medicalReports?.length > 0) && (
                <div className="mt-8">
                  <h3 className="text-xl font-medium text-gray-900 mb-4">
                    Documents
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedRecord.prescriptionImages?.map((image, idx) => (
                      <a
                        key={idx}
                        href={image}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-100 text-blue-700 px-4 py-3 rounded-lg text-center hover:bg-blue-200 transition-colors"
                      >
                        View Prescription {idx + 1}
                      </a>
                    ))}
                    {selectedRecord.medicalReports?.map((report, idx) => (
                      <a
                        key={idx}
                        href={report}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-purple-100 text-purple-700 px-4 py-3 rounded-lg text-center hover:bg-purple-200 transition-colors"
                      >
                        View Report {idx + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>
                    Created{" "}
                    {format(new Date(selectedRecord.createdAt), "MMM dd, yyyy")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="w-full">
        <div className="mb-6 flex items-center gap-4 p-6 bg-white shadow-sm rounded-lg">
          <div className="bg-blue-100 p-3 rounded-lg">
            <Stethoscope className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Medical Records</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {records.map((record, index) => (
            <div
              key={record._id || index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer transition-all hover:shadow-md hover:border-gray-300"
              onClick={() => handleCardClick(record)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {record.condition}
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      record.recoveryStatus
                    )}`}
                  >
                    {record.recoveryStatus.charAt(0).toUpperCase() +
                      record.recoveryStatus.slice(1)}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-5 h-5 mr-2" />
                    <span>
                      Diagnosed:{" "}
                      {format(new Date(record.dateDiagnosed), "MMM dd, yyyy")}
                    </span>
                  </div>

                  {record.symptoms.length > 0 && (
                    <div className="flex items-start text-gray-600">
                      <Activity className="w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                      <div className="flex flex-wrap gap-2">
                        {record.symptoms.slice(0, 2).map((symptom, idx) => (
                          <span
                            key={idx}
                            className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-sm"
                          >
                            {symptom}
                          </span>
                        ))}
                        {record.symptoms.length > 2 && (
                          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-sm">
                            +{record.symptoms.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {record.doctor && (
                    <div className="flex items-center text-gray-600">
                      <User className="w-5 h-5 mr-2" />
                      <span>Dr. {record.doctor}</span>
                    </div>
                  )}

                  {record.hospital && (
                    <div className="flex items-center text-gray-600">
                      <Home className="w-5 h-5 mr-2" />
                      <span>{record.hospital}</span>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>
                      Created{" "}
                      {format(new Date(record.createdAt), "MMM dd, yyyy")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {records.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-7xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Medical Records Yet
            </h3>
            <p className="text-gray-600">
              You haven't added any medical records yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalRecordsList;
