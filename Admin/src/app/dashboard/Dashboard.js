import React, { Component, useEffect, useState } from 'react';
// import { Doughnut } from 'react-chartjs-2';
import CountUp from 'react-countup';
import axios from 'axios';
import Atropos from 'atropos/react';
import "./Dashboard.css";
import { Link, useHistory } from 'react-router-dom';
import Conflictgame from './Conflictgame';

const $ = require("jquery")
$.Datatable = require("datatables.net");


const Dashboard = () => {

  const beckendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
  const beckendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  const nodeMode = process.env.NODE_ENV;
  if (nodeMode === "development") {
    var baseUrl = beckendLocalApiUrl;
  } else {
    baseUrl = beckendLiveApiUrl;
  }


  const history = useHistory()

  const [Admin, setAdmin] = useState()
  const [today, setToday] = useState(false)
  const admin = () => {
    const access_token = localStorage.getItem("token")
    const headers = {
      Authorization: `Bearer ${access_token}`
    }
    axios.get(baseUrl+`total/admin`, { headers })
      .then((res) => {
        setAdmin(res.data)
      })
  }


  const [User, setUser] = useState()
  const user123 = () => {
    const access_token = localStorage.getItem("token")
    const headers = {
      Authorization: `Bearer ${access_token}`
    }
    axios.get(baseUrl+`total/user`, { headers })
      .then((res) => {
        setUser(res.data)
      })
  }

  const [ACTIVE, setACTIVE] = useState()
  const actives = () => {
    const access_token = localStorage.getItem("token")
    const headers = {
      Authorization: `Bearer ${access_token}`
    }
    axios.get(baseUrl+`total/active`, { headers })
      .then((res) => {
        setACTIVE(res.data)
      }).catch((e) => {
        if (e.response.status === 401) {

          localStorage.removeItem("token")
          history.push("/adminlogin")
          //place your reentry code
        }
      })
  }
  const [BLOCKED, setBLOCKED] = useState()
  useEffect(() => {
    const access_token = localStorage.getItem("token")
    const headers = {
      Authorization: `Bearer ${access_token}`
    }
    axios.get(baseUrl+`total/block`, { headers })
      .then((res) => {
        setBLOCKED(res.data)
      })
  }, [])



  // CHALLANGE OVERVIEW

  const [COMPLETED, setCOMPLETED] = useState()
  const comp = () => {
    const access_token = localStorage.getItem("token")
    const headers = {
      Authorization: `Bearer ${access_token}`
    }
    axios.get(baseUrl+`challange/completed`, { headers })
      .then((res) => {
        setCOMPLETED(res.data)
      })
  }

  const [ACTIVE1, setACTIVE1] = useState()
  const active = () => {
    const access_token = localStorage.getItem("token")
    const headers = {
      Authorization: `Bearer ${access_token}`
    }
    axios.get(baseUrl+`challange/active`, { headers })
      .then((res) => {
        setACTIVE1(res.data)
      })
  }

  const [ONGOING, setONGOING] = useState()
  const ongoings = () => {
    const access_token = localStorage.getItem("token")
    const headers = {
      Authorization: `Bearer ${access_token}`
    }
    axios.get(baseUrl+`challange/running`, { headers })
      .then((res) => {
        setONGOING(res.data)
      })
  }

  const [CANCELLED, setCANCELLED] = useState()
  const cancelled = () => {
    const access_token = localStorage.getItem("token")
    const headers = {
      Authorization: `Bearer ${access_token}`
    }
    axios.get(baseUrl+`challange/cancelled`, { headers })
      .then((res) => {
        setCANCELLED(res.data)
      })
  }

  // deposite api start


  const [totalDeposit, setTotalDeposit] = useState(0)
  const totalDepositfunc = () => {
    const access_token = localStorage.getItem("token")
    const headers = {
      Authorization: `Bearer ${access_token}`
    }
    axios.get(baseUrl+`total/deposit`, { headers })
      .then((res) => {
        setTotalDeposit(res.data)
      })
  }
  const [totalPending, setTotalPending] = useState(0)
  const totalPendingfunc = () => {
    const access_token = localStorage.getItem("token")
    const headers = {
      Authorization: `Bearer ${access_token}`
    }
    axios.get(baseUrl+`count/new/deposit`, { headers })
      .then((res) => {
        setTotalPending(res.data)
      })
  }
  const [totalRejected, setTotalRejected] = useState(0)
  const totalRejectedfunc = () => {
    const access_token = localStorage.getItem("token")
    const headers = {
      Authorization: `Bearer ${access_token}`
    }
    axios.get(baseUrl+`count/rejected/deposit`, { headers })
      .then((res) => {
        setTotalRejected(res.data)
      })
  }


  // deposite api end

  // withdrawl api start


  const [totalWithdrawl, setTotalWithdrawl] = useState(0)
  const totalWithdrawlfunc = () => {
    const access_token = localStorage.getItem("token")
    const headers = {
      Authorization: `Bearer ${access_token}`
    }
    axios.get(baseUrl+`total/withdraw`, { headers })
      .then((res) => {
        setTotalWithdrawl(res.data)
      })
  }
  const [totalPendingWithdrawl, setTotalPendingWithdrawl] = useState(0)
  const totalPendingWithdrawlfunc = () => {
    const access_token = localStorage.getItem("token")
    const headers = {
      Authorization: `Bearer ${access_token}`
    }
    axios.get(baseUrl+`count/new/withdrawl`, { headers })
      .then((res) => {
        setTotalPendingWithdrawl(res.data)
      })
  }
  const [totalRejectedWithdrawl, setTotalRejectedWithdrawl] = useState(0)
  const totalRejectedWithdrawlfunc = () => {
    const access_token = localStorage.getItem("token")
    const headers = {
      Authorization: `Bearer ${access_token}`
    }
    axios.get(baseUrl+`count/rejected/withdrawl`, { headers })
      .then((res) => {
        setTotalRejectedWithdrawl(res.data)
      })
  }


  // witdrawl api end

  const [Some, setSome] = useState()
  const Some1 = () => {
    const access_token = localStorage.getItem("token")
    const headers = {
      Authorization: `Bearer ${access_token}`
    }
    axios.get(baseUrl+`challange/some`, { headers })
      .then((res) => {
        setSome(res.data)
        $('table').dataTable();
      })
  }
  const [todayData, setTodayData] = useState();
  const todayApi= ()=>{
    const access_token = localStorage.getItem("token")
    const headers = {
      Authorization: `Bearer ${access_token}`
    }
    axios.get(baseUrl+`all/user/data/get`, { headers })
      .then((res) => {
        setTodayData(res.data);
        //console.log(res.data);   
      })
      .catch((error)=>{
        console.log(error);
      })
  }

  useEffect(() => {
    comp()
    actives()
    user123()
    admin()
    active()
    ongoings()
    cancelled()
    totalDepositfunc();
    totalPendingfunc();
    totalWithdrawlfunc();
    totalPendingWithdrawlfunc();
    totalRejectedWithdrawlfunc();
    todayApi();
    // Some1()
  }, [])





  // CHALLANGE OVERVIEW

  return (
    <div className="">
      <Conflictgame />
      {/* <Deposits />
       <Conflictgame/> */}
       <div className="custom-control custom-switch float-right" >
        <input type="checkbox" className="custom-control-input" id="customSwitch1" onClick={()=>setToday(value => !value)} />
        <label className="custom-control-label" htmlFor="customSwitch1">{today==false?'OVERVIEW':'TODAY'}</label>
      </div>
      {!today&&<div>
        <h3 className='mt-3'>
          ALL USER OVERVIEW
        </h3>
        <div className="row mt-5">
  <Atropos
    rotateXMax={10}
    rotateYMax={10}
    shadowScale={0.9}
    stretchX={50}
    className="col-xl-3 col-sm-6 grid-margin stretch-card"
    style={{ pointerEvents: "auto" }} // Fix scrolling issue
  >
    <div
  className="card"
  style={{
    background: "white",
    borderRadius: "10px",
    border: "1px solid #f0f0f0",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
    transition: "all 0.2s ease",
    padding: "20px"
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.08)";
    e.currentTarget.style.borderColor = "#e0e0e0";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.03)";
    e.currentTarget.style.borderColor = "#f0f0f0";
  }}
>
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <div>
      <p style={{ 
        color: "#7e8fa9",
        fontSize: "14px",
        fontWeight: "500",
        marginBottom: "8px",
        textTransform: "uppercase",
        letterSpacing: "0.5px"
      }}>
        Total Admin
      </p>
      <h3 style={{ 
        color: "#2c3e50",
        fontSize: "28px",
        fontWeight: "600",
        margin: "0"
      }}>
        <CountUp 
          start={0} 
          end={Admin || 0} 
          duration={1}
          separator=","
        />
      </h3>
    </div>
    <div style={{
      width: "40px",
      height: "40px",
      borderRadius: "8px",
      background: "rgba(74, 144, 226, 0.1)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#4a90e2"
    }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    </div>
  
      </div>
    </div>
  </Atropos>
          <Atropos rotateXMax={15} shadowScale={0.7} rotateYMax={15} stretchX={50} className="col-xl-3 col-sm-6 grid-margin stretch-card">
           <div
  className="card"
  style={{
    background: "white",
    borderRadius: "10px",
    border: "1px solid #f0f0f0",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
    transition: "all 0.2s ease",
    padding: "20px"
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.08)";
    e.currentTarget.style.borderColor = "#e0e0e0";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.03)";
    e.currentTarget.style.borderColor = "#f0f0f0";
  }}
>
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <div>
      <h4 style={{ 
        color: "#7e8fa9",
        fontSize: "14px",
        fontWeight: "normal",
        marginBottom: "8px",
        textTransform: "uppercase",
        letterSpacing: "0.5px"
      }}>
        TOTAL USER
      </h4>
      <div style={{ display: "flex", alignItems: "center" }}>
        <h3 style={{ 
          color: "#2c3e50",
          fontSize: "28px",
          fontWeight: "600",
          margin: "0",
          paddingTop: "16px"
        }}>
          <CountUp 
            start={0} 
            delay={0.1} 
            duration={0.8} 
            end={User || 0} 
          />
        </h3>
      </div>
    </div>
    <div style={{
      width: "40px",
      height: "40px",
      borderRadius: "8px",
      background: "rgba(74, 144, 226, 0.1)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#4a90e2"
    }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    </div>
  </div>
</div>
          </Atropos>
          <Atropos rotateXMax={15} shadowScale={0.7} rotateYMax={15} stretchX={50} className="col-xl-3 col-sm-6 grid-margin stretch-card">
       <div className="card" style={{
  borderRadius: "12px",
  border: "none",
  overflow: "hidden",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  background: "linear-gradient(135deg, #38ef7d, #11998e)" // Green gradient
}} onMouseEnter={(e) => {
  e.currentTarget.style.transform = "translateY(-5px)";
  e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.15)";
}} onMouseLeave={(e) => {
  e.currentTarget.style.transform = "translateY(0)";
  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
}}>
  <div className="card-body text-white" style={{padding: "1.5rem"}}>
    <div className="d-flex justify-content-between align-items-start">
      <div>
        <h4 className="font-weight-normal mb-2" style={{
          fontSize: "1rem",
          letterSpacing: "0.5px",
          opacity: 0.9
        }}>ACTIVE USER</h4>
        <h3 className="mb-0" style={{
          fontSize: "2.5rem",
          fontWeight: 600
        }}>
          <CountUp 
            start={0} 
            delay={0.1} 
            duration={0.8} 
            end={ACTIVE || 0} 
            separator=","
          />
        </h3>
      </div>
      <div style={{
        width: "44px",
        height: "44px",
        borderRadius: "12px",
        background: "rgba(255, 255, 255, 0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      </div>
    </div>
  </div>
</div>
          </Atropos>
          <Atropos rotateXMax={15} shadowScale={0.7} rotateYMax={15} stretchX={50} className="col-xl-3 col-sm-6 grid-margin stretch-card">
            <div className="card" style={{
  borderRadius: "12px",
  border: "none",
  overflow: "hidden",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  background: "linear-gradient(135deg, #ff416c, #ff4b2b)" // Red gradient
}} onMouseEnter={(e) => {
  e.currentTarget.style.transform = "translateY(-5px)";
  e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.15)";
}} onMouseLeave={(e) => {
  e.currentTarget.style.transform = "translateY(0)";
  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
}}>
  <div className="card-body text-white" style={{padding: "1.5rem"}}>
    <div className="d-flex justify-content-between align-items-start">
      <div>
        <h4 className="font-weight-normal mb-2" style={{
          fontSize: "1rem",
          letterSpacing: "0.5px",
          opacity: 0.9
        }}>BLOCKED USER</h4>
        <h3 className="mb-0" style={{
          fontSize: "2.5rem",
          fontWeight: 600
        }}>
          <CountUp 
            start={0} 
            delay={0.1} 
            duration={0.8} 
            end={BLOCKED || 0} 
            separator=","
          />
        </h3>
      </div>
      <div style={{
        width: "44px",
        height: "44px",
        borderRadius: "12px",
        background: "rgba(255, 255, 255, 0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          <path d="M18.63 13A17.89 17.89 0 0 1 18 8"></path>
          <path d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14"></path>
          <path d="M18 8a6 6 0 0 0-9.33-5"></path>
          <line x1="1" y1="1" x2="23" y2="23"></line>
        </svg>
      </div>
    </div>
  </div>
</div>
          </Atropos>
        </div>
<h3 className='mt-3' style={{ color: '#fff', fontWeight: 600 }}>
  CHALLENGE OVERVIEW
</h3>
<div className="row mt-5">
  {/* COMPLETED CHALLENGE - Green */}
  <Atropos rotateXMax={15} shadowScale={0.7} rotateYMax={15} stretchX={50} className="col-xl-3 col-sm-6 grid-margin stretch-card">
    <div className="card" style={{
      borderRadius: "12px",
      border: "none",
      background: "linear-gradient(135deg, #38ef7d, #11998e)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      transition: "all 0.3s ease"
    }}>
      <div className="card-body text-white" style={{ padding: "1.5rem" }}>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h4 className="font-weight-normal mb-2" style={{ fontSize: "1rem", opacity: 0.9 }}>COMPLETED CHALLENGE</h4>
            <h3 className="mb-0" style={{ fontSize: "2rem", fontWeight: 600 }}>
              <CountUp start={0} delay={0.1} duration={0.8} end={COMPLETED || 0} separator="," />
            </h3>
          </div>
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "8px",
            background: "rgba(255, 255, 255, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </Atropos>

  {/* ACTIVE CHALLENGE - Blue */}
  <Atropos rotateXMax={15} shadowScale={0.7} rotateYMax={15} stretchX={50} className="col-xl-3 col-sm-6 grid-margin stretch-card">
    <div className="card" style={{
      borderRadius: "12px",
      border: "none",
      background: "linear-gradient(135deg, #4facfe, #00f2fe)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      transition: "all 0.3s ease"
    }}>
      <div className="card-body text-white" style={{ padding: "1.5rem" }}>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h4 className="font-weight-normal mb-2" style={{ fontSize: "1rem", opacity: 0.9 }}>ACTIVE CHALLENGE</h4>
            <h3 className="mb-0" style={{ fontSize: "2rem", fontWeight: 600 }}>
              <CountUp start={0} delay={0.1} duration={0.8} end={ACTIVE1 || 0} separator="," />
            </h3>
          </div>
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "8px",
            background: "rgba(255, 255, 255, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </Atropos>

  {/* ONGOING CHALLENGE - Orange */}
  <Atropos rotateXMax={15} shadowScale={0.7} rotateYMax={15} stretchX={50} className="col-xl-3 col-sm-6 grid-margin stretch-card">
    <div className="card" style={{
      borderRadius: "12px",
      border: "none",
      background: "linear-gradient(135deg, #f7971e, #ffd200)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      transition: "all 0.3s ease"
    }}>
      <div className="card-body text-white" style={{ padding: "1.5rem" }}>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h4 className="font-weight-normal mb-2" style={{ fontSize: "1rem", opacity: 0.9 }}>ONGOING CHALLENGE</h4>
            <h3 className="mb-0" style={{ fontSize: "2rem", fontWeight: 600 }}>
              <CountUp start={0} delay={0.1} duration={0.8} end={ONGOING || 0} separator="," />
            </h3>
          </div>
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "8px",
            background: "rgba(255, 255, 255, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v4"></path>
              <path d="M12 18v4"></path>
              <path d="M4.93 4.93l2.83 2.83"></path>
              <path d="M16.24 16.24l2.83 2.83"></path>
              <path d="M2 12h4"></path>
              <path d="M18 12h4"></path>
              <path d="M4.93 19.07l2.83-2.83"></path>
              <path d="M16.24 7.76l2.83-2.83"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </Atropos>

  {/* CANCELLED CHALLENGE - Red */}
  <Atropos rotateXMax={15} shadowScale={0.7} rotateYMax={15} stretchX={50} className="col-xl-3 col-sm-6 grid-margin stretch-card">
    <div className="card" style={{
      borderRadius: "12px",
      border: "none",
      background: "linear-gradient(135deg, #ff416c, #ff4b2b)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      transition: "all 0.3s ease"
    }}>
      <div className="card-body text-white" style={{ padding: "1.5rem" }}>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h4 className="font-weight-normal mb-2" style={{ fontSize: "1rem", opacity: 0.9 }}>CANCELLED CHALLENGE</h4>
            <h3 className="mb-0" style={{ fontSize: "2rem", fontWeight: 600 }}>
              <CountUp start={0} delay={0.1} duration={0.8} end={CANCELLED || 0} separator="," />
            </h3>
          </div>
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "8px",
            background: "rgba(255, 255, 255, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </Atropos>
</div>
        
        <h3 className='mt-3' style={{ color: '#2c3e50', fontWeight: 600 }}>
  DEPOSIT OVERVIEW
</h3>
<div className="row mt-5">
  <Atropos rotateXMax={15} shadowScale={0.7} rotateYMax={15} stretchX={50} className="col-xl-3 col-sm-6 grid-margin stretch-card">
    <div className="card" style={{
      borderRadius: "12px",
      border: "none",
      background: "linear-gradient(135deg, #667eea, #764ba2)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      transition: "all 0.3s ease"
    }}>
      <div className="card-body text-white" style={{ padding: "1.5rem" }}>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h4 className="font-weight-normal mb-2" style={{ fontSize: "1rem", opacity: 0.9 }}>TOTAL REQUEST</h4>
            <h3 className="mb-0" style={{ fontSize: "2rem", fontWeight: 600 }}>
              <CountUp start={0} delay={0.1} duration={0.8} end={totalDeposit?.count || 0} separator="," />
            </h3>
          </div>
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "8px",
            background: "rgba(255, 255, 255, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </Atropos>

  <Atropos rotateXMax={15} shadowScale={0.7} rotateYMax={15} stretchX={50} className="col-xl-3 col-sm-6 grid-margin stretch-card">
    <div className="card" style={{
      borderRadius: "12px",
      border: "none",
      background: "linear-gradient(135deg, #4facfe, #00f2fe)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      transition: "all 0.3s ease"
    }}>
      <div className="card-body text-white" style={{ padding: "1.5rem" }}>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h4 className="font-weight-normal mb-2" style={{ fontSize: "1rem", opacity: 0.9 }}>TOTAL DEPOSIT</h4>
            <h3 className="mb-0" style={{ fontSize: "2rem", fontWeight: 600 }}>
              ₹<CountUp start={0} delay={0.1} duration={0.8} end={totalDeposit?.data || 0} separator="," />
            </h3>
          </div>
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "8px",
            background: "rgba(255, 255, 255, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </Atropos>

  <Atropos rotateXMax={15} shadowScale={0.7} rotateYMax={15} stretchX={50} className="col-xl-3 col-sm-6 grid-margin stretch-card">
    <div className="card" style={{
      borderRadius: "12px",
      border: "none",
      background: "linear-gradient(135deg, #f7971e, #ffd200)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      transition: "all 0.3s ease"
    }}>
      <div className="card-body text-white" style={{ padding: "1.5rem" }}>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h4 className="font-weight-normal mb-2" style={{ fontSize: "1rem", opacity: 0.9 }}>PENDING REQUEST</h4>
            <h3 className="mb-0" style={{ fontSize: "2rem", fontWeight: 600 }}>
              <CountUp start={0} delay={0.1} duration={0.8} end={totalPending?.count || 0} separator="," />
            </h3>
          </div>
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "8px",
            background: "rgba(255, 255, 255, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </Atropos>

  <Atropos rotateXMax={15} shadowScale={0.7} rotateYMax={15} stretchX={50} className="col-xl-3 col-sm-6 grid-margin stretch-card">
    <div className="card" style={{
      borderRadius: "12px",
      border: "none",
      background: "linear-gradient(135deg, #ff416c, #ff4b2b)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      transition: "all 0.3s ease"
    }}>
      <div className="card-body text-white" style={{ padding: "1.5rem" }}>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h4 className="font-weight-normal mb-2" style={{ fontSize: "1rem", opacity: 0.9 }}>REJECTED REQUEST</h4>
            <h3 className="mb-0" style={{ fontSize: "2rem", fontWeight: 600 }}>
              <CountUp start={0} delay={0.1} duration={0.8} end={totalRejected?.count || 0} separator="," />
            </h3>
          </div>
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "8px",
            background: "rgba(255, 255, 255, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </Atropos>
</div>
        <h3 className='mt-3' style={{ color: '#2c3e50', fontWeight: 600 }}>
  WITHDRAWAL REQUEST OVERVIEW
</h3>
<div className="row mt-5">
  {/* TOTAL REQUEST - Purple */}
  <Atropos rotateXMax={15} shadowScale={0.7} rotateYMax={15} stretchX={50} className="col-xl-3 col-sm-6 grid-margin stretch-card">
    <div className="card" style={{
      borderRadius: "12px",
      border: "none",
      background: "linear-gradient(135deg, #667eea, #764ba2)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      transition: "all 0.3s ease"
    }}>
      <div className="card-body text-white" style={{ padding: "1.5rem" }}>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h4 className="font-weight-normal mb-2" style={{ fontSize: "1rem", opacity: 0.9 }}>TOTAL REQUEST</h4>
            <h3 className="mb-0" style={{ fontSize: "2rem", fontWeight: 600 }}>
              <CountUp start={0} delay={0.1} duration={0.8} end={totalWithdrawl?.count || 0} separator="," />
            </h3>
          </div>
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "8px",
            background: "rgba(255, 255, 255, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </Atropos>

  {/* TOTAL WITHDRAWAL - Blue */}
  <Atropos rotateXMax={15} shadowScale={0.7} rotateYMax={15} stretchX={50} className="col-xl-3 col-sm-6 grid-margin stretch-card">
    <div className="card" style={{
      borderRadius: "12px",
      border: "none",
      background: "linear-gradient(135deg, #4facfe, #00f2fe)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      transition: "all 0.3s ease"
    }}>
      <div className="card-body text-white" style={{ padding: "1.5rem" }}>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h4 className="font-weight-normal mb-2" style={{ fontSize: "1rem", opacity: 0.9 }}>TOTAL WITHDRAWAL</h4>
            <h3 className="mb-0" style={{ fontSize: "2rem", fontWeight: 600 }}>
              ₹<CountUp start={0} delay={0.1} duration={0.8} end={totalWithdrawl?.data || 0} separator="," />
            </h3>
          </div>
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "8px",
            background: "rgba(255, 255, 255, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </Atropos>

  {/* PENDING REQUEST - Orange */}
  <Atropos rotateXMax={15} shadowScale={0.7} rotateYMax={15} stretchX={50} className="col-xl-3 col-sm-6 grid-margin stretch-card">
    <div className="card" style={{
      borderRadius: "12px",
      border: "none",
      background: "linear-gradient(135deg, #f7971e, #ffd200)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      transition: "all 0.3s ease"
    }}>
      <div className="card-body text-white" style={{ padding: "1.5rem" }}>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h4 className="font-weight-normal mb-2" style={{ fontSize: "1rem", opacity: 0.9 }}>PENDING REQUEST</h4>
            <h3 className="mb-0" style={{ fontSize: "2rem", fontWeight: 600 }}>
              <CountUp start={0} delay={0.1} duration={0.8} end={totalPendingWithdrawl?.count || 0} separator="," />
            </h3>
          </div>
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "8px",
            background: "rgba(255, 255, 255, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </Atropos>

  {/* CANCELLED REQUEST - Red */}
  <Atropos rotateXMax={15} shadowScale={0.7} rotateYMax={15} stretchX={50} className="col-xl-3 col-sm-6 grid-margin stretch-card">
    <div className="card" style={{
      borderRadius: "12px",
      border: "none",
      background: "linear-gradient(135deg, #ff416c, #ff4b2b)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      transition: "all 0.3s ease"
    }}>
      <div className="card-body text-white" style={{ padding: "1.5rem" }}>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h4 className="font-weight-normal mb-2" style={{ fontSize: "1rem", opacity: 0.9 }}>CANCELLED REQUEST</h4>
            <h3 className="mb-0" style={{ fontSize: "2rem", fontWeight: 600 }}>
              <CountUp start={0} delay={0.1} duration={0.8} end={totalRejectedWithdrawl?.count || 0} separator="," />
            </h3>
          </div>
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "8px",
            background: "rgba(255, 255, 255, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </Atropos>
</div>
      </div>}
      {today&&<div>
        <div className="row mt-5">
  
  <Atropos rotateXMax={15} shadowScale={0.7} rotateYMax={15} stretchX={50} className="col-xl-3 col-sm-6 grid-margin stretch-card">
    <div className="card" style={{ borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #667eea, #764ba2)", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", transition: "all 0.3s ease" }}>
      <div className="card-body text-white" style={{ padding: "1.5rem" }}>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h4 className="font-weight-normal mb-2" style={{ fontSize: "1rem", opacity: 0.9 }}>TOTAL USER</h4>
            <h3 className="mb-0" style={{ fontSize: "2rem", fontWeight: 600 }}><CountUp start={0} delay={0.1} duration={0.8} end={todayData?.totalUser || 0} separator="," /></h3>
          </div>
          <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "rgba(255, 255, 255, 0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </Atropos>

  <Atropos rotateXMax={15} shadowScale={0.7} rotateYMax={15} stretchX={50} className="col-xl-3 col-sm-6 grid-margin stretch-card">
    <div className="card" style={{ borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #4facfe, #00f2fe)", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", transition: "all 0.3s ease" }}>
      <div className="card-body text-white" style={{ padding: "1.5rem" }}>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h4 className="font-weight-normal mb-2" style={{ fontSize: "1rem", opacity: 0.9 }}>TOTAL USER WALLET BALANCE</h4>
            <h3 className="mb-0" style={{ fontSize: "2rem", fontWeight: 600 }}>₹<CountUp start={0} delay={0.1} duration={0.8} end={todayData?.totalWalletbalance || 0} separator="," /></h3>
          </div>
          <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "rgba(255, 255, 255, 0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </Atropos>
  <Atropos rotateXMax={15} shadowScale={0.7} rotateYMax={15} stretchX={50} className="col-xl-3 col-sm-6 grid-margin stretch-card">
    <div className="card" style={{ borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #667eea, #764ba2)", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", transition: "all 0.3s ease" }}>
      <div className="card-body text-white" style={{ padding: "1.5rem" }}>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h4 className="font-weight-normal mb-2" style={{ fontSize: "1rem", opacity: 0.9 }}>TODAY COMMISSION</h4>
            <h3 className="mb-0" style={{ fontSize: "2rem", fontWeight: 600 }}>₹<CountUp start={0} delay={0.1} duration={0.8} end={todayData?.todayCommission || 0} separator="," /></h3>
          </div>
          <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "rgba(255, 255, 255, 0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <path d="M14 2v6h6"></path>
              <path d="M16 13H8"></path>
              <path d="M16 17H8"></path>
              <path d="M10 9H8"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </Atropos>
  <Atropos rotateXMax={15} shadowScale={0.7} rotateYMax={15} stretchX={50} className="col-xl-3 col-sm-6 grid-margin stretch-card">
    <div className="card" style={{ borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #38ef7d, #11998e)", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", transition: "all 0.3s ease" }}>
      <div className="card-body text-white" style={{ padding: "1.5rem" }}>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h4 className="font-weight-normal mb-2" style={{ fontSize: "1rem", opacity: 0.9 }}>TODAY USER</h4>
            <h3 className="mb-0" style={{ fontSize: "2rem", fontWeight: 600 }}><CountUp start={0} delay={0.1} duration={0.8} end={todayData?.todayUser || 0} separator="," /></h3>
          </div>
          <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "rgba(255, 255, 255, 0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </Atropos>

  {/* Repeat same pattern for all other cards with appropriate colors and icons */}
  {/* TODAY GAME - Orange */}
  <Atropos rotateXMax={15} shadowScale={0.7} rotateYMax={15} stretchX={50} className="col-xl-3 col-sm-6 grid-margin stretch-card">
    <div className="card" style={{ borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #f7971e, #ffd200)", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", transition: "all 0.3s ease" }}>
      <div className="card-body text-white" style={{ padding: "1.5rem" }}>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h4 className="font-weight-normal mb-2" style={{ fontSize: "1rem", opacity: 0.9 }}>TODAY GAME</h4>
            <h3 className="mb-0" style={{ fontSize: "2rem", fontWeight: 600 }}><CountUp start={0} delay={0.1} duration={0.8} end={todayData?.totalGame || 0} separator="," /></h3>
          </div>
          <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "rgba(255, 255, 255, 0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </Atropos>

  {/* TODAY ALL GAME - Blue */}
  <Atropos rotateXMax={15} shadowScale={0.7} rotateYMax={15} stretchX={50} className="col-xl-3 col-sm-6 grid-margin stretch-card">
    <div className="card" style={{ borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #4facfe, #00f2fe)", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", transition: "all 0.3s ease" }}>
      <div className="card-body text-white" style={{ padding: "1.5rem" }}>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h4 className="font-weight-normal mb-2" style={{ fontSize: "1rem", opacity: 0.9 }}>TODAY ALL GAME</h4>
            <h3 className="mb-0" style={{ fontSize: "2rem", fontWeight: 600 }}><CountUp start={0} delay={0.1} duration={0.8} end={todayData?.todayAllGame || 0} separator="," /></h3>
          </div>
          <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "rgba(255, 255, 255, 0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </Atropos>

  {/* TODAY SUCCESS GAME - Green */}
  <Atropos rotateXMax={15} shadowScale={0.7} rotateYMax={15} stretchX={50} className="col-xl-3 col-sm-6 grid-margin stretch-card">
    <div className="card" style={{ borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #38ef7d, #11998e)", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", transition: "all 0.3s ease" }}>
      <div className="card-body text-white" style={{ padding: "1.5rem" }}>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h4 className="font-weight-normal mb-2" style={{ fontSize: "1rem", opacity: 0.9 }}>TODAY SUCCESS GAME</h4>
            <h3 className="mb-0" style={{ fontSize: "2rem", fontWeight: 600 }}><CountUp start={0} delay={0.1} duration={0.8} end={todayData?.todaySuccessGame || 0} separator="," /></h3>
          </div>
          <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "rgba(255, 255, 255, 0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </Atropos>

  {/* TODAY CANCEL GAME - Red */}
  <Atropos rotateXMax={15} shadowScale={0.7} rotateYMax={15} stretchX={50} className="col-xl-3 col-sm-6 grid-margin stretch-card">
    <div className="card" style={{ borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #ff416c, #ff4b2b)", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", transition: "all 0.3s ease" }}>
      <div className="card-body text-white" style={{ padding: "1.5rem" }}>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h4 className="font-weight-normal mb-2" style={{ fontSize: "1rem", opacity: 0.9 }}>TODAY CANCEL GAME</h4>
            <h3 className="mb-0" style={{ fontSize: "2rem", fontWeight: 600 }}><CountUp start={0} delay={0.1} duration={0.8} end={todayData?.todayCancelGame || 0} separator="," /></h3>
          </div>
          <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "rgba(255, 255, 255, 0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </Atropos>

  {/* TODAY TOTAL DEPOSIT - Blue */}
  <Atropos rotateXMax={15} shadowScale={0.7} rotateYMax={15} stretchX={50} className="col-xl-3 col-sm-6 grid-margin stretch-card">
    <div className="card" style={{ borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #4facfe, #00f2fe)", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", transition: "all 0.3s ease" }}>
      <div className="card-body text-white" style={{ padding: "1.5rem" }}>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h4 className="font-weight-normal mb-2" style={{ fontSize: "1rem", opacity: 0.9 }}>TODAY TOTAL DEPOSIT</h4>
            <h3 className="mb-0" style={{ fontSize: "2rem", fontWeight: 600 }}>₹<CountUp start={0} delay={0.1} duration={0.8} end={todayData?.todayTotalDeposit || 0} separator="," /></h3>
          </div>
          <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "rgba(255, 255, 255, 0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" y1="19" x2="12" y2="23"></line>
              <line x1="8" y1="23" x2="16" y2="23"></line>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </Atropos>

  {/* TODAY TOTAL WITHDRAWAL - Green */}
  <Atropos rotateXMax={15} shadowScale={0.7} rotateYMax={15} stretchX={50} className="col-xl-3 col-sm-6 grid-margin stretch-card">
    <div className="card" style={{ borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #38ef7d, #11998e)", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", transition: "all 0.3s ease" }}>
      <div className="card-body text-white" style={{ padding: "1.5rem" }}>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h4 className="font-weight-normal mb-2" style={{ fontSize: "1rem", opacity: 0.9 }}>TODAY TOTAL WITHDRAWAL</h4>
            <h3 className="mb-0" style={{ fontSize: "2rem", fontWeight: 600 }}>₹<CountUp start={0} delay={0.1} duration={0.8} end={todayData?.todayTotalWithdraw || 0} separator="," /></h3>
          </div>
          <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "rgba(255, 255, 255, 0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 15V3m0 12l-4-4m4 4l4-4"></path>
              <path d="M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </Atropos>

  {/* TOTAL WON AMOUNT - Purple */}
  <Atropos rotateXMax={15} shadowScale={0.7} rotateYMax={15} stretchX={50} className="col-xl-3 col-sm-6 grid-margin stretch-card">
    <div className="card" style={{ borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #667eea, #764ba2)", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", transition: "all 0.3s ease" }}>
      <div className="card-body text-white" style={{ padding: "1.5rem" }}>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h4 className="font-weight-normal mb-2" style={{ fontSize: "1rem", opacity: 0.9 }}>TOTAL WON AMOUNT</h4>
            <h3 className="mb-0" style={{ fontSize: "2rem", fontWeight: 600 }}>₹<CountUp start={0} delay={0.1} duration={0.8} end={todayData?.totolWonAmount || 0} separator="," /></h3>
          </div>
          <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "rgba(255, 255, 255, 0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </Atropos>

  {/* TOTAL LOSE AMOUNT - Red */}
  <Atropos rotateXMax={15} shadowScale={0.7} rotateYMax={15} stretchX={50} className="col-xl-3 col-sm-6 grid-margin stretch-card">
    <div className="card" style={{ borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #ff416c, #ff4b2b)", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", transition: "all 0.3s ease" }}>
      <div className="card-body text-white" style={{ padding: "1.5rem" }}>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h4 className="font-weight-normal mb-2" style={{ fontSize: "1rem", opacity: 0.9 }}>TOTAL LOSE AMOUNT</h4>
            <h3 className="mb-0" style={{ fontSize: "2rem", fontWeight: 600 }}>₹<CountUp start={0} delay={0.1} duration={0.8} end={todayData?.totalLoseAmount || 0} separator="," /></h3>
          </div>
          <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "rgba(255, 255, 255, 0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </Atropos>

  
<Atropos rotateXMax={15} shadowScale={0.7} rotateYMax={15} stretchX={50} className="col-xl-3 col-sm-6 grid-margin stretch-card">
  <div className="card" style={{
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #8E2DE2, #4A00E0)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease"
  }}>
    <div className="card-body text-white" style={{ padding: "1.5rem" }}>
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <h4 className="font-weight-normal mb-2" style={{ fontSize: "1rem", opacity: 0.9 }}>TOTAL HOLD BALANCE</h4>
          <h3 className="mb-0" style={{ fontSize: "2rem", fontWeight: 600 }}>
            ₹<CountUp 
              start={0} 
              delay={0.1} 
              duration={0.8} 
              end={todayData?.totalHoldBalance || 0} 
              separator=","
            />
          </h3>
        </div>
        <div style={{
          width: "40px",
          height: "40px",
          borderRadius: "8px",
          background: "rgba(255, 255, 255, 0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.66 0 3-4.48 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4.48-3-9s1.34-9 3-9m-9 9a9 9 0 0 1 9-9"></path>
          </svg>
        </div>
      </div>
    </div>
  </div>
</Atropos>
  {/* TOTAL WITHDRAWAL HOLD BALANCE - Blue */}
  <Atropos rotateXMax={15} shadowScale={0.7} rotateYMax={15} stretchX={50} className="col-xl-3 col-sm-6 grid-margin stretch-card">
    <div className="card" style={{ borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #4facfe, #00f2fe)", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", transition: "all 0.3s ease" }}>
      <div className="card-body text-white" style={{ padding: "1.5rem" }}>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h4 className="font-weight-normal mb-2" style={{ fontSize: "1rem", opacity: 0.9 }}>TOTAL WITHDRAWAL HOLD BALANCE</h4>
            <h3 className="mb-0" style={{ fontSize: "2rem", fontWeight: 600 }}>₹<CountUp start={0} delay={0.1} duration={0.8} end={todayData?.totalWithdrawHold || 0} separator="," /></h3>
          </div>
          <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "rgba(255, 255, 255, 0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20"></path>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </Atropos>

  {/* TOTAL DEPOSIT - Green */}
  <Atropos rotateXMax={15} shadowScale={0.7} rotateYMax={15} stretchX={50} className="col-xl-3 col-sm-6 grid-margin stretch-card">
    <div className="card" style={{ borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #38ef7d, #11998e)", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", transition: "all 0.3s ease" }}>
      <div className="card-body text-white" style={{ padding: "1.5rem" }}>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h4 className="font-weight-normal mb-2" style={{ fontSize: "1rem", opacity: 0.9 }}>TOTAL DEPOSIT</h4>
            <h3 className="mb-0" style={{ fontSize: "2rem", fontWeight: 600 }}>₹<CountUp start={0} delay={0.1} duration={0.8} end={todayData?.totalDeposit || 0} separator="," /></h3>
          </div>
          <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "rgba(255, 255, 255, 0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" y1="19" x2="12" y2="23"></line>
              <line x1="8" y1="23" x2="16" y2="23"></line>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </Atropos>

  {/* TOTAL WITHDRAWAL - Red */}
  <Atropos rotateXMax={15} shadowScale={0.7} rotateYMax={15} stretchX={50} className="col-xl-3 col-sm-6 grid-margin stretch-card">
    <div className="card" style={{ borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #ff416c, #ff4b2b)", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", transition: "all 0.3s ease" }}>
      <div className="card-body text-white" style={{ padding: "1.5rem" }}>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h4 className="font-weight-normal mb-2" style={{ fontSize: "1rem", opacity: 0.9 }}>TOTAL WITHDRAWAL</h4>
            <h3 className="mb-0" style={{ fontSize: "2rem", fontWeight: 600 }}>₹<CountUp start={0} delay={0.1} duration={0.8} end={todayData?.totalWithdrawl || 0} separator="," /></h3>
          </div>
          <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "rgba(255, 255, 255, 0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 15V3m0 12l-4-4m4 4l4-4"></path>
              <path d="M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </Atropos>

  {/* TOTAL REFERRAL EARNING - Purple */}
  <Atropos rotateXMax={15} shadowScale={0.7} rotateYMax={15} stretchX={50} className="col-xl-3 col-sm-6 grid-margin stretch-card">
    <div className="card" style={{ borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #667eea, #764ba2)", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", transition: "all 0.3s ease" }}>
      <div className="card-body text-white" style={{ padding: "1.5rem" }}>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h4 className="font-weight-normal mb-2" style={{ fontSize: "1rem", opacity: 0.9 }}>TOTAL REFERRAL EARNING</h4>
            <h3 className="mb-0" style={{ fontSize: "2rem", fontWeight: 600 }}>₹<CountUp start={0} delay={0.1} duration={0.8} end={todayData?.totalReferralEarning || 0} separator="," /></h3>
          </div>
          <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "rgba(255, 255, 255, 0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <polyline points="17 11 19 13 23 9"></polyline>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </Atropos>

  {/* TOTAL REFERRAL WALLET - Blue */}
  <Atropos rotateXMax={15} shadowScale={0.7} rotateYMax={15} stretchX={50} className="col-xl-3 col-sm-6 grid-margin stretch-card">
    <div className="card" style={{ borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #4facfe, #00f2fe)", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", transition: "all 0.3s ease" }}>
      <div className="card-body text-white" style={{ padding: "1.5rem" }}>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h4 className="font-weight-normal mb-2" style={{ fontSize: "1rem", opacity: 0.9 }}>TOTAL REFERRAL WALLET</h4>
            <h3 className="mb-0" style={{ fontSize: "2rem", fontWeight: 600 }}>₹<CountUp start={0} delay={0.1} duration={0.8} end={todayData?.totalReferralWallet || 0} separator="," /></h3>
          </div>
          <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "rgba(255, 255, 255, 0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </Atropos>
</div>
</div>}




      <div className="row">
        <div className="col-md-4 grid-margin stretch-card">
         
        </div>
       
      </div>
    </div>
  );
}


export default Dashboard;