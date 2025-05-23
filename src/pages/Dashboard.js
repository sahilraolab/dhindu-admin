import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Receipt,
  DollarSign,
  RotateCcw,
  Users,
  ChevronDown,
  Calendar
} from 'lucide-react';
import './Dashboard.css';

const customerGrowthData = [
  { name: 'Jan', newCustomers: 120, regularCustomers: 200 },
  { name: 'Feb', newCustomers: 150, regularCustomers: 220 },
  { name: 'Mar', newCustomers: 180, regularCustomers: 250 },
  { name: 'Apr', newCustomers: 170, regularCustomers: 230 },
  { name: 'May', newCustomers: 200, regularCustomers: 280 },
  { name: 'Jun', newCustomers: 220, regularCustomers: 300 },
  { name: 'Jul', newCustomers: 240, regularCustomers: 320 },
  { name: 'Aug', newCustomers: 230, regularCustomers: 310 },
  { name: 'Sep', newCustomers: 250, regularCustomers: 340 },
  { name: 'Oct', newCustomers: 270, regularCustomers: 360 },
  { name: 'Nov', newCustomers: 260, regularCustomers: 350 },
  { name: 'Dec', newCustomers: 280, regularCustomers: 380 },
];

const StatCard = ({ icon: Icon, title, value, percentage, trend }) => (
  <div className="card stat-card">
    <div className="stat-header">
      <div className="stat-icon">
        <Icon />
      </div>
      <div>
        <h3 className="stat-title">{title}</h3>
        <p className="stat-value">{value}</p>
      </div>
    </div>
    <div className="stat-comparison">
      Compared to ($34,584 last day)
      <span className={trend === 'up' ? 'trend-up' : 'trend-down'}>
        {percentage}
      </span>
    </div>
  </div>
);

const DeliveryMetric = ({ title, value, amount }) => (
  <div className="delivery-metric">
    <span className="delivery-metric-title">{title}</span>
    <span>{value}</span>
  </div>
);

const ProgressBar = ({ value, amount }) => (
  <div className="progress-container">
    <div className="progress-bar">
      <div className="progress-fill" style={{ width: `${value}%` }} />
    </div>
    <div className="progress-text">
      Increased by {value}% • ${amount}
    </div>
  </div>
);

const PopularItem = ({ name, value, percentage }) => (
  <div className="popular-item">
    <div className="item-name">
      <span className="item-dot" />
      <span>{name}</span>
    </div>
    <div className="item-stats">
      <span>{value}</span>
      <span className="item-percentage">({percentage})</span>
    </div>
  </div>
);

const Dashboard = () => {
  const [dateRange, setDateRange] = useState('16 Feb 2024 9:54 AM - 20th Apr 2024 9:54 AM');

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      <div className="filters-grid">
        <div className="select-wrapper">
          <select className="select-input">
            <option>Brand Name</option>
          </select>
          <ChevronDown className="select-icon" />
        </div>
        <div className="select-wrapper">
          <select className="select-input">
            <option>Outlet Name</option>
          </select>
          <ChevronDown className="select-icon" />
        </div>
        <div className="select-wrapper">
          <select className="select-input">
            <option>Outlet Code</option>
          </select>
          <ChevronDown className="select-icon" />
        </div>
      </div>

      <div className="date-range">
        <div className="date-input-wrapper">
          <input
            type="text"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="date-input"
          />
          <Calendar className="calendar-icon" />
        </div>
        <button className="btn btn-primary">Submit</button>
        <button className="btn btn-secondary">Reset</button>
      </div>

      <div className="stats-grid">
        <StatCard
          icon={Receipt}
          title="Total Orders"
          value="384,425"
          percentage="+1.4%"
          trend="up"
        />
        <StatCard
          icon={DollarSign}
          title="Total Revenue"
          value="$824,523.00"
          percentage="+1.9%"
          trend="up"
        />
        <StatCard
          icon={RotateCcw}
          title="Refunded"
          value="$4,834.00"
          percentage="+7.1%"
          trend="up"
        />
        <StatCard
          icon={Users}
          title="Total Customer"
          value="$73,635.00"
          percentage="+8.15%"
          trend="up"
        />
      </div>

      <div className="delivery-grid">
        <div className="card">
          <h3>3rd Party Delivery</h3>
          <div>
            <div>
              <DeliveryMetric title="UberEats" value={50} amount="$824,257" />
              <ProgressBar value={50} amount="824,257" />
            </div>
            <div>
              <DeliveryMetric title="DoorDash" value={15} amount="$43,548" />
              <ProgressBar value={15} amount="43,548" />
            </div>
            <div>
              <DeliveryMetric title="SkiptheDishes" value={50} amount="$43,548" />
              <ProgressBar value={50} amount="43,548" />
            </div>
          </div>
        </div>

        <div className="card">
          <h3>Taxes & Tips</h3>
          <div>
            <div>
              <DeliveryMetric title="Discount Usage" value={25} amount="$324,257" />
              <ProgressBar value={25} amount="324,257" />
            </div>
            <div>
              <DeliveryMetric title="Coupon Usage" value={15} amount="$43,548" />
              <ProgressBar value={15} amount="43,548" />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Customer Growth</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={customerGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="newCustomers" 
                stroke="#f97316" 
                strokeWidth={2}
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="regularCustomers" 
                stroke="#cbd5e1" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-legend">
          <div className="legend-item">
            <div className="legend-dot dot-orange" />
            <span>New Customer</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot dot-gray" />
            <span>Regular Customer</span>
          </div>
        </div>
      </div>

      <div className="orders-grid">
        <div className="card">
          <h3>In-House Orders</h3>
          <div>
            <div>
              <DeliveryMetric title="Dine In" value={25} amount="$824,257" />
              <ProgressBar value={25} amount="824,257" />
            </div>
            <div>
              <DeliveryMetric title="Takeaway" value={15} amount="$43,548" />
              <ProgressBar value={15} amount="43,548" />
            </div>
            <div>
              <DeliveryMetric title="Quick Bill" value={50} amount="$43,548" />
              <ProgressBar value={50} amount="43,548" />
            </div>
          </div>
        </div>

        <div className="card">
          <h3>Popular Category</h3>
          <div className="circular-chart">
            <div className="circle circle-1" />
            <div className="circle circle-2" />
            <div className="circle circle-3" />
            <div className="circle circle-4" />
          </div>
          <div>
            <PopularItem name="Burger" value="1,346" percentage="35%" />
            <PopularItem name="Dessert" value="6,274" percentage="25%" />
            <PopularItem name="Drinks" value="6,274" percentage="25%" />
            <PopularItem name="Snacks" value="6,274" percentage="15%" />
          </div>
        </div>

        <div className="card">
          <h3>Payment Types</h3>
          <div className="circular-chart">
            <div className="circle circle-1" />
            <div className="circle circle-2" />
            <div className="circle circle-3" />
            <div className="circle circle-4" />
          </div>
          <div>
            <PopularItem name="Cash" value="1,346" percentage="35%" />
            <PopularItem name="Card" value="6,274" percentage="25%" />
            <PopularItem name="Mobile Card" value="6,274" percentage="25%" />
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Popular Items</h3>
        <div className="popular-items-grid">
          <div>
            <PopularItem name="Burger" value="1,346" percentage="35%" />
            <PopularItem name="Dessert" value="6,274" percentage="25%" />
          </div>
          <div>
            <PopularItem name="Dessert" value="6,274" percentage="25%" />
            <PopularItem name="Dessert" value="6,274" percentage="25%" />
          </div>
          <div>
            <PopularItem name="Dessert" value="6,274" percentage="25%" />
            <PopularItem name="Dessert" value="6,274" percentage="25%" />
          </div>
          <div>
            <PopularItem name="Dessert" value="6,274" percentage="25%" />
            <PopularItem name="Dessert" value="6,274" percentage="25%" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;