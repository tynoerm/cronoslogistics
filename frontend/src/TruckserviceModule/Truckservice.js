import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { Button, Modal } from 'react-bootstrap';

const Truckservice = () => {
  const [truckserviceForm, setTruckserviceForm] = useState([]);
  const [truckserviceInsert, setTruckserviceInsert] = useState({});

  const [date, setDate] = useState("");
  const [driverName, setDrivername] = useState("");
  const [truckName, setTruckname] = useState("");
  const [serviceMileage, setServicemileage] = useState("");
  const [nextServicemileage, setNextservicemileage] = useState("");

  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const [error, setError] = useState("");

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  const filteredTruckservices = truckserviceForm.filter(q => {
    const truckserviceDate = q.date ? new Date(q.date).toISOString().split("T")[0] : "";
    return truckserviceDate === selectedDate;
  });

  useEffect(() => {
    axios.get("https://cronoslogistics.onrender.com/truckservice/") // API endpoint for truck service
      .then(res => setTruckserviceForm(res.data.data))
      .catch(error => console.log(error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!date || !driverName || !truckName || !serviceMileage || !nextServicemileage) {
      setError("All fields are required");
      return;
    }

    const stringPattern = /^[A-Za-z0-9\s.,!?()]+$/; // Corrected regex
    if (!stringPattern.test(driverName) || !stringPattern.test(truckName)) {
      setError("Driver Name and Truck Name should only contain letters, numbers, spaces, and basic punctuation.");
      return;
    }

    if (isNaN(serviceMileage) || isNaN(nextServicemileage) || serviceMileage <= 0 || nextServicemileage <= 0) {
      setError("Service Mileage and Next Service Mileage must be positive numbers.");
      return;
    }

    setError("");

    const truckserviceInsert = {
      date,
      driverName,
      truckName,
      serviceMileage,
      nextServicemileage
    };

    axios.post("https://cronoslogistics.onrender.com/truckservice/create-truckservice", truckserviceInsert) // Correct API endpoint for creating truck service
      .then((res) => {
        console.log({ status: res.status });
        setTruckserviceForm(prev => [...prev, truckserviceInsert]);
      })
      .catch(error => console.log(error));

    setShow(false);
  };

  return (
    <div>
      <nav className="navbar navbar-dark bg-dark border-bottom border-light py-3">
        <a className="navbar-brand text-white" href="#">
          <b>TRUCK SERVICE</b>
        </a>
      </nav>

      <div className="d-flex justify-content-between my-4">
        <Button variant="success" onClick={handleShow} className="px-4">
          <b>CREATE A SERVICE RECORD</b>
        </Button>
        <Link to="/" className="btn btn-primary px-4">
          BACK
        </Link>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="text-secondary">Truck Services created on: {selectedDate}</h2>
        <input
          type="date"
          className="form-control w-auto"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} size="xl">
        <Modal.Header closeButton>
          <Modal.Title><b>CREATE A SERVICE RECORD</b></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="date" className="form-label">Date</label>
                <input
                  type="date"
                  className="form-control"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="driverName" className="form-label">Driver Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="driverName"
                  value={driverName}
                  onChange={(e) => setDrivername(e.target.value)}
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="truckName" className="form-label">Truck Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="truckName"
                  value={truckName}
                  onChange={(e) => setTruckname(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="serviceMileage" className="form-label">Service Mileage</label>
                <input
                  type="number"
                  className="form-control"
                  id="serviceMileage"
                  value={serviceMileage}
                  onChange={(e) => setServicemileage(e.target.value)}
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="nextServicemileage" className="form-label">Next Service Mileage</label>
                <input
                  type="number"
                  className="form-control"
                  id="nextServicemileage"
                  value={nextServicemileage}
                  onChange={(e) => setNextservicemileage(e.target.value)}
                />
              </div>
            </div>

            <Button variant="primary" type="submit" className="w-100 mt-4">
              SAVE SERVICE RECORD
            </Button>
          </form>
        </Modal.Body>
      </Modal>

      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Date</th>
            <th>Driver Name</th>
            <th>Truck Name</th>
            <th>Service Mileage</th>
            <th>Next Service Mileage</th>
          </tr>
        </thead>
        <tbody>
          {filteredTruckservices.length > 0 ? (
            filteredTruckservices.map((truckservice, index) => (
              <tr key={index}>
                <td>{truckservice.date}</td>
                <td>{truckservice.driverName}</td>
                <td>{truckservice.truckName}</td>
                <td>{truckservice.serviceMileage}</td>
                <td>{truckservice.nextServicemileage}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">No truck services found for the selected date</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Truckservice;
