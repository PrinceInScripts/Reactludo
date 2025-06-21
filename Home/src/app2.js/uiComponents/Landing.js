import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import "../css/landing.css";
import { Collapse } from "react-bootstrap";
import Downloadbutton from "../Components/Downloadbutton";
import Header from "../Components/Header";

export default function Landing() {
  const beckendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
  const beckendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  const nodeMode = process.env.NODE_ENV;
  const baseUrl =
    nodeMode === "development" ? beckendLocalApiUrl : beckendLiveApiUrl;
  const [open, setOpen] = useState(false);
  const [WebSitesettings, setWebsiteSettings] = useState("");
  const [kycStatus, setKycStatus] = useState();

  const [language, setLanguage] = useState("en");

  const rules = {
    en: [
      "🎲 Choose a game mode (Classic or Popular).",
      "🧑 Invite friends or join a room.",
      "💰 Set the entry fee and wait for players to join.",
      "🏁 Roll dice, move your tokens, and play fair.",
      "🏆 Winner takes the prize money!"
    ],
    hi: [
      "🎲 एक गेम मोड चुनें (क्लासिक या पॉपुलर)।",
      "🧑 दोस्तों को आमंत्रित करें या एक रूम जॉइन करें।",
      "💰 एंट्री फीस तय करें और खिलाड़ियों का इंतज़ार करें।",
      "🏁 पासा फेंके, टोकन चलाएं और ईमानदारी से खेलें।",
      "🏆 विजेता को इनामी राशि मिलेगी!"
    ]
  };


   const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const fetchData = async () => {
    try {
      const response = await axios.get(baseUrl + "settings/data");
      setWebsiteSettings(response.data);
    } catch (error) {
      if (!navigator.onLine) {
        toast.error("Please check your internet connection.", {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 5000,
        });
      } else {
        console.error("Error fetching data:", error);
      }
    }
  };
  const checkRole = async () => {
    try {
      const access_token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${access_token}`,
      };
      const res = await axios.get(baseUrl + `me`, { headers });
      setKycStatus(res.data);
      const userRole = res.data.role;
      if (userRole === "admin") {
        console.log("User is an admin");
      } else {
        console.log("User is not an admin");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        toast.error("Login Or signup Account Id", {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 5000,
        });
      } else {
        console.error("Error checking role:", error);
      }
    }
  };

  useEffect(() => {
    const access_token = localStorage.getItem("token");
    if (!access_token) {
      // Redirect to login or show a message
    }
    checkRole();
    fetchData();
  }, []);

  return (
    <>
      <div className="leftContainer">
        <div className="main-area" style={{ paddingTop: "60px" }}>
          {/*<div style={{ width: '100%', textAlign: 'center' }}>
    <div style={{
        backgroundColor: '#dcdcdc', // Lighter silver
        color: '#333', // Darker text for contrast
        fontSize: '14px',
        padding: '8px 0',
        fontWeight: 'bold',
        borderRadius: '5px',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
        display: 'block',
        width: '100%',
        maxWidth: '600px',
        margin: '0 auto',
        background: 'linear-gradient(145deg, #f0f0f0, #dcdcdc)',
    }}>
        🎉 COMMISSION: 5% ◉ REFERRAL: 3% FOR ALL GAMES 🎉
    </div>
</div>*/}

          {kycStatus && kycStatus.verified === "unverified" && (
            <div
              className="d-flex align-items-center justify-content-between alert alert-danger show mt-2"
              style={{ width: "94%", margin: "0 auto" }}
            >
              <span>
                <b>KYC Pending</b> &nbsp;
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  width="20"
                  height="20"
                  fill="red"
                >
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"></path>
                </svg>
              </span>
              <Link to="/Kyc2" style={{ textDecoration: "none" }}>
                <button
                  className="btn btn-danger btn-sm text-capitalize"
                  style={{ color: "white", border: "none" }}
                >
                  <b>Complete here</b>
                </button>
              </Link>
            </div>
          )}

          {WebSitesettings && WebSitesettings.CompanyAddress && (
            <div
              className="mt-2 container position-relative"
              style={{ maxWidth: "100%" }}
            >
              <div
                role="alert"
                className="fade d-flex align-items-center justify-content-between alert alert-warning show text-start"
                style={{
                  fontSize: "0.8rem",
                  backgroundColor: "light",
                  borderRadius: "10px",
                  border: "2px double #776420",
                  boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                }}
              >
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    width="18"
                    height="18"
                    fill="red"
                  >
                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"></path>
                  </svg>
                  &nbsp;{" "}
                  <span style={{ color: "#786322", fontWeight: "bold" }}>
                    {WebSitesettings.CompanyAddress}
                  </span>
                </span>
              </div>
            </div>
          )}
          <div
            className="card mb-1 p-3"
            style={{
              borderRadius: "15px",
              boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
              backgroundColor: "#ffffff",
            }}
          >
            <div className="d-flex align-items-center justify-content-between games-section-title">
              <h3 style={{ fontWeight: "600", color: "#333", margin: 0 }}>
                Top Games 🎲
              </h3>
              {/* <a
                href="https://youtu.be/62ZxW8?si=9LGmp8m-kph2i_Ub"
                target="_blank"
                rel="noreferrer"
              >
                <button
                  style={{
                    backgroundColor: "#007BFF",
                    color: "white",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "12px",
                    display: "flex",
                    alignItems: "center",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                    transition: "background-color 0.3s ease",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor = "#0056b3")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor = "#007BFF")
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    width="1em"
                    height="1em"
                    fill="currentColor"
                    className="me-1"
                    style={{ fill: "white" }}
                  >
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path>
                    <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"></path>
                  </svg>
                  &nbsp; Guide
                </button>
              </a> */}

              <button className="guide-btn" onClick={openModal}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          width="1em"
          height="1em"
          fill="currentColor"
          style={{ fill: "white", marginRight: "5px" }}
        >
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path>
          <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"></path>
        </svg>
        Guide
      </button>

      {isOpen && (
        <div className="guide-modal" onClick={closeModal}>
          <div
            className="guide-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="close-btn" onClick={closeModal}>
              &times;
            </span>
            
              <div className="lang-tabs">
            <button
              className={language === "en" ? "active" : ""}
              onClick={() => setLanguage("en")}
            >
              English
            </button>
            <button
              className={language === "hi" ? "active" : ""}
              onClick={() => setLanguage("hi")}
            >
              हिंदी
            </button>
          </div>

          <h2>How to Play Ludo</h2>
          <div className="rules">
            {rules[language].map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>

          </div>
        </div>
      )}


            </div>
          </div>
          <section className="games-section p-3">
            <div
              className="games-section-headline mt-2 mb-1"
              style={{ color: "#2c3e50" }}
            >
              <div className="games-window">
                <Link
                  className="gameCard-container1"
                  to={`/Homepage/Ludo%20Classics`}
                >
                  <div
                    className="live-indicator"
                    style={{
                      position: "absolute",
                      top: "10px",
                      left: "10px",
                      backgroundColor: "red",
                      color: "white",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      fontWeight: "bold",
                      fontSize: "0.8rem",
                      zIndex: 1,
                    }}
                  >
                    ◉ LIVE
                  </div>
                  <picture
                    className="gameCard-image"
                    style={{ position: "relative" }}
                  >
                    <img
                      width="100%"
                      height="80%"
                      src="https://i.postimg.cc/9QVjbd7Q/Mscl.jpg"
                      alt=""
                    />
                  </picture>
                  <div class="game-info">
              <h3>Ludo King Classic</h3>
              <button class="play-btn">Play Now</button>
            </div>
                </Link>

                <Link
                  className="gameCard-container"
                  to={``}
                  style={{ position: "relative" }}
                  onClick={() =>
                    toast.info("This game is coming soon!", {
                      position: toast.POSITION.BOTTOM_RIGHT,
                    })
                  }
                >
                   <div class="coming-soon-img">
                      <img src="/khelobuddy/comming-soon.png" width={"100px"} alt="" />
                   </div>
                  <picture
                    className="gameCard-image"
                    // style={{ position: "relative" }}
                  >
                    <img
                      width="100%"
                      height="90%"
                      src="https://i.postimg.cc/T2mSsyGL/Classic1lc.jpg"
                      alt=""
                     
                    />
                  </picture>
                  {/* <div style={{ marginTop:'10px' }} class="game-info">
              <h6 style={{ color: '#fff', fontFamily: 'sans-serif', fontWeight: 800 }}>Ludo King Popular</h6>
              <button class="play-btn">Play Now</button>
            </div> */}

                </Link>

                {/*
                 <Link className="gameCard-container" to={``} onClick={() => toast.info("This game is coming soon!", { position: toast.POSITION.BOTTOM_RIGHT })}>
                <br />
               <div className="gameCard-image-container" style={{ position: "relative" }}>
              <div className="overlay"></div>
                  <img
                    className="image"
                    src="https://i.postimg.cc/hjsdJ1NH/popular.jpg"
                    alt=""
                    style={{ 
                    border: '4px double #8E7EF8',
                    borderRadius: '10px',
                    boxShadow: '0px 0px 10px #fff'
                          }}
                  />
             <div className="coming-soon">
            <b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; COMING SOON &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b>
                 </div>
                </div>
                </Link>*/}

                <Link
                  className="gameCard-container"
                  to={``}
                   style={{ position: "relative" }}
                  onClick={() =>
                    toast.info("This game is coming soon!", {
                      position: toast.POSITION.BOTTOM_RIGHT,
                    })
                  }
                >
                    <div class="coming-soon-img">
                      <img src="/khelobuddy/comming-soon.png" width={"100px"} alt="" />
                   </div>
                  {/* <br /> */}
                  <picture
                    className="gameCard-image"
                   
                  >
                    {/* <div className="overlay"></div> */}
                    <img
                      width="100%"
                      height="90%"
                      src="https://i.postimg.cc/3NKg9bYZ/Popular25.jpg"
                      alt=""
                     
                    />
                   
                  </picture>

                   {/* <div style={{ marginTop:'10px' }} class="game-info">
              <h6 style={{ color: '#fff', fontFamily: 'sans-serif', fontWeight: 800 }}>Snakes & Ladder</h6>
              <button class="play-btn">Play Now</button>
            </div> */}
                </Link>

                {/* <Link
                  className="gameCard-container"
                  to={``}
                  onClick={() =>
                    toast.info("This game is coming soon!", {
                      position: toast.POSITION.BOTTOM_RIGHT,
                    })
                  }
                >
                  <br />
                  <div
                    className="gameCard-image-container"
                    style={{ position: "relative" }}
                  >
                    <div className="overlay"></div>
                    <img
                      className="image"
                      src="https://i.postimg.cc/HW20jH9v/Popular1000.jpg"
                      alt=""
                      style={{
                        border: "4px double #8E7EF8",
                        borderRadius: "10px",
                        boxShadow: "0px 0px 10px #fff",
                      }}
                    />
                    <div className="coming-soon">
                      <b>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; COMING SOON
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      </b>
                    </div>
                  </div>
                </Link> */}
              </div>
            </div>
          </section>

          <section class="play-friends-section">
  <h2 class="section-heading">Play with Friends 🤝</h2>
  <div class="card-container">
    <img
      src="/khelobuddy/play-with-friends.png"
      alt="Play with Friends"
      class="card-image"
    />
    <div class="card-overlay">
      <div class="card-text">
        <h3 class="card-title">Play with Friends!</h3>
        <p class="card-description">
          Now play Ludo Supreme with your friends &amp; win money.
        </p>
      </div>
      <button class="arrow-button">→</button>
    </div>
  </div>
</section>

          

           <section
      className="footer"
      style={{
        backgroundColor: "#f8f9fa",
        padding: "20px",
        borderTop: "1px solid #e0e0e0",
      }}
    >
      <a
        className="d-flex align-items-center px-3 py-3"
        href="#!"
        onClick={() => setOpen(!open)}
        aria-controls="footer-collapse-text"
        aria-expanded={open}
        style={{
          textDecoration: "none",
          color: "#007bff",
          borderBottom: "0",
          padding: "10px 0",
        }}
      >
        <picture className="icon">
          <img
            src="/khelobuddy/logo.png"
            alt="khelobuddy Logo"
            style={{ width: "80px", height: "80px", borderRadius: "8px" }}
          />
        </picture>
        <span
          style={{
            color: "#6c757d",
            fontSize: "1em",
            fontWeight: 400,
            marginLeft: "15px",
          }}
          className={!open ? "d-block" : "d-none"}
        >
          Privacy & Support
        </span>
        <i
          className={`mdi ${open ? 'mdi-chevron-up' : 'mdi-chevron-down'} ml-auto`}
          style={{ fontSize: "1.7em", color: "#6c757d" }}
        ></i>
      </a>

      <Collapse in={open}>
        <div id="footer-collapse-text" className="px-3 overflow-hidden">
          <div className="row footer-links mt-3">
            <Link className="col-6 mb-2" to="/term-condition">
              Terms & Conditions
            </Link>
            <Link className="col-6 mb-2" to="/PrivacyPolicy">
              Privacy Policy
            </Link>
            <Link className="col-6 mb-2" to="/RefundPolicy">
              Refund/Cancellation Policy
            </Link>
            <Link className="col-6 mb-2" to="/contact-us">
              Contact Us
            </Link>
            <Link className="col-6 mb-2" to="/responsible-gaming">
              Responsible Gaming
            </Link>
            <Link className="col-6 mb-2" to="/Rules">
              Game Rules
            </Link>
          </div>
        </div>
      </Collapse>
    </section>

          <ToastContainer
            style={{ marginBottom: "25px" }}
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          <div className="downloadButton">
            <Downloadbutton />
          </div>
        </div>
      </div>
    </>
  );
}
