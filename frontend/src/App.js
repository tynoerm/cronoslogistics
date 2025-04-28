
import './App.css';
import Footer from './Components/Footer.js';
import axios from 'axios';

import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Dashboard from "./Dashboard.js"




import Expenses from './ExpensesModule/Expenses.js';
import Invoices from './InvoicesModule/Invoices.js';
import Truckservice from './TruckserviceModule/Truckservice.js';


import Orders from './OrdersModule/Orders.js'
import Payments from './PaymentsModule/Payments.js';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="" element={<Dashboard/>} />
    
      
        <Route path="Expenses" element={<Expenses/>} />
        <Route path="Invoices" element={<Invoices/>} />
        <Route path="Truckservice" element={<Truckservice/>} />
        <Route path="Orders" element={<Orders/>} />
        <Route path="Payments" element={<Payments/>} />

      </Routes>
    </Router>
  );
}

export default App;
