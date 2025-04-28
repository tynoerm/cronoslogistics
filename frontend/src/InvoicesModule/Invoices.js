import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { Button, Modal } from 'react-bootstrap';

const Invoices = () => {
  const [invoicesForm, setInvoicesForm] = useState([]);
  const [invoicesInsert, setInvoicesInsert] = useState({});

  const [date, setDate] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [goodsDescription, setGoodsDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [totalAmountDue, setTotalAmountDue] = useState("");

  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const [error, setError] = useState("");

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  const filteredInvoices = invoicesForm.filter(q => {
    const invoiceDate = q.date ? new Date(q.date).toISOString().split("T")[0] : "";
    return invoiceDate === selectedDate;
  });

  useEffect(() => {
    axios.get("https://cronoslogistics.onrender.com/invoice/")
      .then(res => setInvoicesForm(res.data.data))
      .catch(error => console.log(error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!date || !clientName || !clientAddress || !goodsDescription || !paymentMethod) {
      setError("All fields are required");
      return;
    }

    const stringPattern = /^[A-Za-z0-9\s.,!?()]+$/; // Corrected regex
    if (!stringPattern.test(clientName) || !stringPattern.test(clientAddress) || !stringPattern.test(paymentMethod)) {
      setError("Client Name, Client Address, and Payment Method should only contain letters, numbers, spaces, and basic punctuation.");
      return;
    }

    if (isNaN(quantity) || quantity <= 0 || isNaN(totalAmountDue) || totalAmountDue <= 0) {
      setError("Quantity and Total Amount Due must be positive numbers.");
      return;
    }

    setError("");

    const invoiceInsert = {
      date,
      clientName,
      clientAddress,
      goodsDescription,
      quantity,
      paymentMethod,
      totalAmountDue
    };

    axios.post("https://cronoslogistics.onrender.com/invoice/create-invoice", invoiceInsert)
      .then((res) => {
        console.log({ status: res.status });
        setInvoicesForm(prev => [...prev, invoiceInsert]);
      })
      .catch(error => console.log(error));

    setShow(false);
  };

  return (
    <div>
      <nav className="navbar navbar-dark bg-dark border-bottom border-light py-3">
        <a className="navbar-brand text-white" href="#">
          <b>INVOICES</b>
        </a>
      </nav>

      <div className="d-flex justify-content-between my-4">
        <Button variant="success" onClick={handleShow} className="px-4">
          <b>CREATE AN INVOICE</b>
        </Button>
        <Link to="/" className="btn btn-primary px-4">
          BACK
        </Link>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="text-secondary">Invoices created on: {selectedDate}</h2>
        <input
          type="date"
          className="form-control w-auto"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} size="xl">
        <Modal.Header closeButton>
          <Modal.Title><b>CREATE AN INVOICE</b></Modal.Title>
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
                <label htmlFor="clientName" className="form-label">Client Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="clientName"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="clientAddress" className="form-label">Client Address</label>
                <input
                  type="text"
                  className="form-control"
                  id="clientAddress"
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="quantity" className="form-label">Quantity</label>
                <input
                  type="number"
                  className="form-control"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-12">
                <label htmlFor="goodsDescription" className="form-label">Goods Description</label>
                <textarea
                  className="form-control"
                  id="goodsDescription"
                  value={goodsDescription}
                  onChange={(e) => setGoodsDescription(e.target.value)}
                  rows="4"
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="paymentMethod" className="form-label">Payment Method</label>
                <select
                  className="form-control"
                  id="paymentMethod"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="">Select Payment Method</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>

              <div className="col-md-6">
                <label htmlFor="totalAmountDue" className="form-label">Total Amount Due</label>
                <input
                  type="number"
                  className="form-control"
                  id="totalAmountDue"
                  value={totalAmountDue}
                  onChange={(e) => setTotalAmountDue(e.target.value)}
                />
              </div>
            </div>

            <Button variant="primary" type="submit" className="w-100 mt-4">
              SAVE INVOICE
            </Button>
          </form>
        </Modal.Body>
      </Modal>

      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Date</th>
            <th>Client Name</th>
            <th>Client Address</th>
            <th>Description</th>
            <th>Quantity</th>
            <th>Payment Method</th>
            <th>Total Amount Due</th>
          </tr>
        </thead>
        <tbody>
          {filteredInvoices.length > 0 ? (
            filteredInvoices.map((invoice, index) => (
              <tr key={index}>
                <td>{invoice.date}</td>
                <td>{invoice.clientName}</td>
                <td>{invoice.clientAddress}</td>
                <td>{invoice.goodsDescription}</td>
                <td>{invoice.quantity}</td>
                <td>{invoice.paymentMethod}</td>
                <td>{invoice.totalAmountDue}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">No invoices found for the selected date</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Invoices;
