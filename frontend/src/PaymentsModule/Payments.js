import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { Button, Modal, InputGroup, Form } from 'react-bootstrap';

const Payments = () => {
  const [paymentsForm, setPaymentsform] = useState([]);
  const [paymentInsert, setPaymentsinsert] = useState({});

  const [date, setDate] = useState("");
  const [companyName, setCompanyname] = useState("");
  const [paymentMethod, setPaymentmethod] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [phoneNumber, setPhonenumber] = useState("");
  const [paymentPurpose, setPaymentpurpose] = useState("");
  const [paymentAmount, setPaymentamount] = useState("");
  const [transactionId, setTransactionId] = useState("");

  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    axios.get("https://cronoslogistics.onrender.com/payment/")
        .then(res => setPaymentsform(res.data.data)) // Update state with fetched payments
        .catch(error => console.log(error));
  }, []);

  // Filter payments based on the selected date
  const filteredPayments = paymentsForm.filter(payment => {
    const paymentDate = payment.date ? new Date(payment.date).toISOString().split("T")[0] : "";
    return paymentDate === selectedDate;
  });

  // Handle submit for the payment form
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!date || !companyName || !emailAddress || !paymentMethod || !paymentAmount || !transactionId) {
      setError("All fields are required");
      return;
    }
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      setError("Payment amount must be a positive number");
      return;
    }

    setError("");

    const paymentInsert = {
      date,
      companyName,
      emailAddress,
      phoneNumber,
      paymentPurpose,
      paymentMethod,
      paymentAmount,
      transactionId,
    };

    axios
      .post("https://cronoslogistics.onrender.com/payment/create-payment", paymentInsert)
      .then((res) => {
        console.log({ status: res.status});
        setPaymentsform(prev => [...prev, paymentInsert]);  // Add the new payment
        setShow(false);
      })
     .catch((error) => {
      setError("An error occurred while submitting payments.");
     });
    setShow(false);
  };

  // Handle download of payment details as PDF
  const handleDownload = async (type) => {
    try {
      const response = await axios.get(`https://cronoslogistics.onrender.com/payments/download/${type}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `file.${type}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <div>
      <nav className="navbar navbar-dark bg-dark border-bottom border-light py-3">
        <a className="navbar-brand text-white" href="#">
          <b>PAYMENTS</b>
        </a>
      </nav>

      <div className="d-flex justify-content-between my-4">
        <Button variant="success" onClick={handleShow} className="px-4">
          <b>ADD A PAYMENT</b>
        </Button>
        <div className="d-flex justify-content-end">
          <Button variant="primary" onClick={() => handleDownload("pdf")} className="px-4">
            DOWNLOAD PDF
          </Button>
        </div>

        <Link to="/" className="btn btn-primary px-4">
          BACK
        </Link>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="text-secondary">Payments done on: {selectedDate}</h2>
        <input type="date" className="form-control w-auto" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
      </div>

      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} size="xl" aria-labelledby="payment-modal">
        <Modal.Header closeButton>
          <Modal.Title>INITIATE PAYMENT</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-danger">{error}</div>}

            {/* Payment Form Fields */}
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
                <label htmlFor="companyName" className="form-label">Company Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyname(e.target.value)}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="emailAddress" className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  id="emailAddress"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                <input
                  type="number"
                  className="form-control"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhonenumber(e.target.value)}
                />
              </div>
            </div>

            {/* Payment Details */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="paymentPurpose" className="form-label">Payment Purpose</label>
                <input
                  type="text"
                  className="form-control"
                  id="paymentPurpose"
                  value={paymentPurpose}
                  onChange={(e) => setPaymentpurpose(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="paymentAmount" className="form-label">Payment Amount</label>
                <input
                  type="number"
                  className="form-control"
                  id="paymentAmount"
                  value={paymentAmount}
                  onChange={(e) => setPaymentamount(e.target.value)}
                />
              </div>
            </div>

            {/* Payment Method and Transaction ID */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="paymentMethod" className="form-label">Payment Method</label>
                <select
                  className="form-control"
                  id="paymentMethod"
                  value={paymentMethod}
                  onChange={(e) => setPaymentmethod(e.target.value)}
                >
                  <option value=""></option>
                  <option value="credit_card">Credit Card</option>
                  <option value="debit_card">Debit Card</option>
                  <option value="paypal">PayPal</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="cash">Cash</option>
                </select>
              </div>

              <div className="col-md-6">
                <label htmlFor="transactionId" className="form-label">Transaction ID</label>
                <input
                  type="text"
                  className="form-control"
                  id="transactionId"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                />
              </div>
            </div>

            <Button variant="primary" type="submit" className="w-100 mt-4">Save Payment</Button>
          </form>
        </Modal.Body>
      </Modal>

      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Date</th>
            <th>Company Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Amount</th>
            <th>Method</th>
            <th>Transaction ID</th>
          </tr>
        </thead>

        <tbody>
          {filteredPayments.length > 0 ? (
            filteredPayments.map((payment, index) => (
              <tr key={index}>
                <td>{payment.date}</td>
                <td>{payment.companyName}</td>
                <td>{payment.emailAddress}</td>
                <td>{payment.phoneNumber}</td>
                <td>{payment.paymentAmount}</td>
                <td>{payment.paymentMethod}</td>
                <td>{payment.transactionId}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No payments found for the selected date</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Payments;
