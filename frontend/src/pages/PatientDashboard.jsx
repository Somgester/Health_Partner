import React, { useState } from 'react'
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
    
    
  } from 'lucide-react';

import Sidebar from '../components/Sidebar/Sidebar';
import { UserDataContext } from "../context/UserContext";
import MyHealth from '../components/PatientComponents/MyHealth';
import { Outlet } from 'react-router-dom';


const PatientDashboard = () => {


const {user , setUser} = React.useContext(UserDataContext);
  
  

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar role="patient" />
      <div className="flex-1 ml-64 overflow-auto">
        <div className="bg-gray-100">
          <Outlet /> {/* Render the selected component here */}
        </div>
      </div>
    </div>
  )
}

export default PatientDashboard
