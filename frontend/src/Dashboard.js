import React from "react";
import TopMenu from "./Components/TopMenu.js";
import { Link } from "react-router-dom";
import Footer from './Components/Footer.js';

import { FaShoppingCart, FaRegMoneyBillAlt, FaWarehouse } from 'react-icons/fa';

const Dashboard = () => {
  return (
    <div style={styles.container}>
      <TopMenu />
      
      <div style={styles.dashboardContent}>
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {/* Sales Module Card */}
          <div className="col">
            <div className="card shadow-lg rounded">
              <div className="card-body">
                <div style={styles.cardHeader}>
                  <FaShoppingCart style={styles.icon} />
                  <h5 className="card-title">ORDERS</h5>
                </div>
                <p className="card-text">order management</p>
                <Link to="/Orders" className="btn btn-primary">Next</Link>
              </div>
            </div>
          </div>

          <div className="col">
            <div className="card shadow-lg rounded">
              <div className="card-body">
                <div style={styles.cardHeader}>
                  <FaWarehouse style={styles.icon} />
                  <h5 className="card-title">INVOICES</h5>
                </div>
                <p className="card-text">invoices management</p>
                <Link to="/Invoices" className="btn btn-primary">Next</Link>
              </div>
            </div>
          </div>

          <div className="col">
            <div className="card shadow-lg rounded">
              <div className="card-body">
                <div style={styles.cardHeader}>
                  <FaShoppingCart style={styles.icon} />
                  <h5 className="card-title">PAYMENTS</h5>
                </div>
                <p className="card-text">payment management</p>
                <Link to="/Payments" className="btn btn-primary">Next</Link>
              </div>
            </div>
          </div>



  {/* Stock Module Card */}


          {/* Expenses Module Card */}
          <div className="col">
            <div className="card shadow-lg rounded">
              <div className="card-body">
                <div style={styles.cardHeader}>
                  <FaRegMoneyBillAlt style={styles.icon} />
                  <h5 className="card-title">EXPENSES</h5>
                </div>
                <p className="card-text">expenses management</p>
                <Link to="/Expenses" className="btn btn-primary">Next</Link>
              </div>
            </div>
          </div>

        
        </div>
      </div>

      <Footer />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  dashboardContent: {
    flex: 1,
    padding: '30px',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '15px',
  },
  icon: {
    fontSize: '30px',
    marginRight: '15px',
    color: '#61dafb', // Matching the icon color with React default color
  },
};

export default Dashboard;
