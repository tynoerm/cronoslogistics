import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { Button, Modal } from 'react-bootstrap';

const Orders = () => {
    // Declare state for orders and setOrder
    const [orders, setOrders] = useState([]); // Use setOrders for updating order data
    const [date, setDate] = useState("");

    const [companyName, setCompanyName] = useState("");
    const [address, setAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [emailAddress, setEmailAddress] = useState("");
    const [pickingPoint, setPickingPoint] = useState("");
    const [contactPerson, setContactPerson] = useState("");
    const [goodsDescription, setGoodsDescription] = useState("");
    const [quantity, setQuantity] = useState("");
    const [weight, setWeight] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [paymentCurrency, setPaymentCurrency] = useState("");
    const [show, setShow] = useState(false);
    const [error, setError] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    // Fetch orders data when the component mounts
    useEffect(() => {
        axios.get("https://cronoslogistics.onrender.com/order/")
            .then(res => setOrders(res.data.data)) // Update state with fetched orders
            .catch(error => console.log(error));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!date || !companyName || !address || !phoneNumber || !emailAddress || !pickingPoint || !contactPerson || !goodsDescription || !quantity || !weight || !paymentMethod || !paymentCurrency) {
            setError("All fields are required");
            return;
        }

        setError("");

        const orderInsert = {
            date, companyName, address, phoneNumber, emailAddress, pickingPoint, contactPerson,
            goodsDescription, quantity, weight, paymentMethod, paymentCurrency
        };

        // Send data to the backend
        axios
            .post("https://cronoslogistics.onrender.com/order/create-order", orderInsert)
            .then((res) => {
                console.log({ status: res.status });
                setOrders((prev) => [...prev, orderInsert]); // Add new order to the orders state
                setShow(false);
            })
            .catch((error) => {
                console.error(error);
                setError("An error occurred while submitting the expense.");
            });
        setShow(false);
    };

    // Filter orders based on the selected date
    const filteredOrders = orders.filter(order => {
        const orderDate = order.date ? new Date(order.date).toISOString().split("T")[0] : "";
        return orderDate === selectedDate;
    });


    const handleDelete = (id) => {
        console.log("Deleting order with ID:", id);  // Log ID to check it's correct
        axios
            .delete(`https://cronoslogistics.onrender.com/order/orders/${id}`)
            .then(() => {
                setOrders((prevOrders) => {
                    // Log the orders array before filtering
                    console.log(prevOrders);
                    return prevOrders.filter((order) => {
                        // Log each order to ensure _id is present
                        console.log(order);
                        return order._id && order._id.toString() !== id;
                    });
                });
            })
            .catch((error) => {
                console.error("Error deleting order:", error);
            });
    };
 
    const [currentStatus, setCurrentStatus] = useState("pending");

    const handleStatusChange = async () => {
      const orderId = "ACTUAL_ORDER_ID";  // Replace with the correct order ID
      console.log("Sending Order ID:", orderId);  // Check the format of orderId
  
      try {
        const response = await axios.post("https://cronoslogistics.onrender.com/order/update-status", {
          orderId: orderId,  // Pass the actual order ID
          status: "delivered",  // Set status to "delivered"
        });
  
        console.log('Response:', response);
  
        if (response.status === 200) {
          setCurrentStatus("delivered");  // Update frontend status to "delivered"
        }
      } catch (error) {
        console.error("There was an error updating the status:", error);
        if (error.response) {
          console.error("Response error:", error.response.data);
        } else if (error.request) {
          console.error("Request error:", error.request);
        } else {
          console.error("Error message:", error.message);
        }
      }
    };


    return (
        <div>
            <nav className="navbar navbar-dark bg-dark border-bottom border-light py-3">
                <a className="navbar-brand text-white" href="#"><b>ORDER MANAGEMENT</b></a>
            </nav>
            <div className="d-flex justify-content-between my-4">
                <Button variant="success" onClick={handleShow} className="px-4"><b> CREATE AN ORDER</b></Button>
                <Link to="/" className="btn btn-primary px-4">BACK</Link>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="text-secondary">Orders created on: {selectedDate}</h2>
                <input type="date" className="form-control w-auto" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
            </div>
            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title><b>CREATE AN ORDER</b></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        {error && <div className="alert alert-danger">{error}</div>}

                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">Date</label>
                                <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Company Name</label>
                                <input type="text" className="form-control" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <label className="form-label">Address</label>
                            <textarea type="text" className="form-control"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-4">
                                <label className="form-label">Phone Number</label>
                                <input type="number" className="form-control"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)} />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Email Address</label>
                                <input type="text" className="form-control"
                                    value={emailAddress}
                                    onChange={(e) => setEmailAddress(e.target.value)} />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Picking Point</label>
                                <input type="text" className="form-control"
                                    value={pickingPoint}
                                    onChange={(e) => setPickingPoint(e.target.value)} />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">Contact Person</label>
                                <input type="text" className="form-control"
                                    value={contactPerson}
                                    onChange={(e) => setContactPerson(e.target.value)}
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Goods Description</label>
                                <textarea type="text" className="form-control"
                                    value={goodsDescription}
                                    onChange={(e) => setGoodsDescription(e.target.value)} />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">Quantity</label>
                                <input type="number" className="form-control"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Weight</label>
                                <input type="text" className="form-control"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)} />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">Payment Methodd</label>
                                <select className="form-control" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                                    <option value=""></option>
                                    <option value="Credit Card">Credit Card</option>
                                    <option value="Debit Card">Debit Card</option>
                                    <option value="PayPal">PayPal</option>
                                    <option value="Bank Transfer">Bank Transfer</option>
                                    <option value="Cash">Cash</option>
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Payment Currency</label>
                                <select className="form-control" value={paymentCurrency} onChange={(e) => setPaymentCurrency(e.target.value)}>
                                    <option value=""></option>
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                    <option value="GBP">GBP</option>
                                    <option value="ZAR">ZAR</option>
                                    <option value="ZWL">ZWL</option>
                                </select>
                            </div>
                        </div>

                        <Button variant="primary" type="submit" className="w-100 mt-4">SAVE ORDER</Button>
                    </form>
                </Modal.Body>
            </Modal>

            <table className="table table-striped table-bordered">
                <thead className="table-dark">
                    <tr>
                        <th>Date</th>
                        <th>Company Name</th>
                        <th>Address</th>
                        
                        <th>Contact Person</th>
                        <th>Goods Description</th>
                        <th>Quantity</th>
                        <th>Weight</th>
                        <th>Payment Method</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredOrders.length > 0 ? (
                        filteredOrders.map((order, index) => (
                            <tr key={index}>
                                <td>{order.date ? order.date.split("T")[0] : "N/A"}</td>
                                <td>{order.companyName || "N/A"}</td>
                                <td>{order.address || "N/A"}</td>

                          

                                <td>{order.contactPerson || "N/A"}</td>
                                <td>{order.goodsDescription || "N/A"}</td>
                                <td>{order.quantity || "N/A"}</td>
                                <td>{order.weight || "N/A"}</td>
                                <td>{order.paymentMethod || "N/A"}</td>
                                <td><button className="btn btn-danger" onClick={() => handleDelete(order._id)}><i>delete</i></button></td>

                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="9">No orders found for the selected date</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Orders;
