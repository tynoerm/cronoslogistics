
import './App.css';
import Footer from './Components/Footer.js';
import axios from 'axios';

import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Dashboard from "./Dashboard.js"

import SalesModuleDashboard from './SalesModule/Dashboard.js';
import Sales from "./SalesModule/Sales.js"

import Expenses from './ExpensesModule/Expenses.js';
import Invoices from './InvoicesModule/Invoices.js';
import Quotation from './SalesModule/Quotation.js';
import SalesReports from './SalesModule/SalesReports.js';
import Orders from './OrdersModule/Orders.js'
import Payments from './PaymentsModule/Payments.js';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="" element={<Dashboard/>} />
        <Route path="Sales" element={<Sales/>} />
        <Route path="SalesModuleDashboard" element={<SalesModuleDashboard/>} />    
        <Route path="Quotation" element={<Quotation/>} />
        <Route path="Expenses" element={<Expenses/>} />
        <Route path="Invoices" element={<Invoices/>} />
        <Route path="SalesReports" element={<SalesReports/>} />
        <Route path="Orders" element={<Orders/>} />
        <Route path="Payments" element={<Payments/>} />

      </Routes>
    </Router>
  );
}

export default App;
