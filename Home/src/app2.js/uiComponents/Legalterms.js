import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../Components/Header";
import Rightcontainer from "../Components/Rightcontainer";
import css from "../css/terms.css";
import { NavLink } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

const Legalterms = () => {
  const beckendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
  const beckendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  const nodeMode = process.env.NODE_ENV;

  let baseUrl;
  if (nodeMode === "development") {
    baseUrl = beckendLocalApiUrl;
  } else {
    baseUrl = beckendLiveApiUrl;
  }

  const [WebSitesettings, setWebsiteSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(baseUrl + "settings/data");
      const data = await response.json();
      setWebsiteSettings(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
  <div class="content">
    <div class="loading">
        <p>Loading...</p>
        <span></span>
    </div>
</div>
    );
  }
 
  return (
  
    <div className="legal-terms-container">
      <CoolaspContainer data={WebSitesettings} />
    </div>
  );
}

  
const CoolaspContainer = ({ data }) => {
  const [toggleTerms, setToggleTerms] = useState(false);
  const [togglePrivacyPolicy, setTogglePrivacyPolicy] = useState(false);
  const [toggleAboutUs, setToggleAboutUs] = useState(false);
  const [toggleResponsibleGaming, setToggleResponsibleGaming] = useState(false);
  const [toggleContactUs, setToggleContactUs] = useState(false);
  const [toggleCancellationRefund, setToggleCancellationRefund] = useState(false);
const history = useHistory();
  return (
    <div className="leftContainer" style={{ minHeight: "100vh", height: "100%" }}>
      <div className="main_area" style={{ paddingTop: "14%" }}>
      
      
      <div className="card mb-2 p-2" style={{ borderRadius: '8px', boxShadow: '0px 0px 5px rgba(128, 128, 128)' }}>
  <div className="d-flex justify-content-between align-items-center">
   <button onClick={() => history.goBack()} className="btn btn-primary" style={{ backgroundColor: '#0D6EFD', borderRadius: '5px' }}>
     <i className="fa fa-arrow-circle-left" style={{ color: 'white' }}></i>
      <span className="text-capitalize fw-bold" style={{ color: 'white' }}><b>BACK</b></span>
    </button>
<NavLink to="/Rules" style={{ marginLeft: 'auto', textDecoration: 'none', color: '#A9A9A9', display: 'flex', alignItems: 'center', backgroundColor: '#A9A9A9', padding: '0.2rem 0.4rem', borderRadius: '5px', fontSize: '0.8rem', textTransform: 'uppercase' }}><span className="fw-bold" style={{ color: '#fff', fontFamily: 'roboto', display: 'flex', alignItems: 'center' }}><b>RULES</b>&nbsp;<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="white" d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2.033 16.01c.564-1.789 1.632-3.932 1.821-4.474.273-.787-.211-1.136-1.74.209l-.34-.64c1.744-1.897 5.335-2.326 4.113.613-.763 1.835-1.309 3.074-1.621 4.03-.455 1.393.694.828 1.819-.211.153.25.203.331.356.619-2.498 2.378-5.271 2.588-4.408-.146zm4.742-8.169c-.532.453-1.32.443-1.761-.022-.441-.465-.367-1.208.164-1.661.532-.453 1.32-.442 1.761.022.439.466.367 1.209-.164 1.661z"/></svg></span></NavLink>

  </div>
</div>
      <div className="card mt-3" style={{ 
    border: '1px solid #ddd', 
    width: '93%', 
    margin: '0 auto',
    borderRadius: '8px',  // Rounded corners
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',  // Subtle shadow
    backgroundColor: '#f9f9f9'  // Light background color
}}>
    <div className="card-header text-center" style={{ 
        fontWeight: 'bold',  
        fontSize: '15px',  // Slightly larger font size
        letterSpacing: '0.8px',  // Light letter spacing
        backgroundColor: '#ffffff',  // White background for header
        padding: '10px 16px',  // Balanced padding
        borderTopLeftRadius: '8px',  // Rounded corners for header
        borderTopRightRadius: '8px',
        color: '#333'  // Dark grey text color
    }}>Legal Terms</div>
    
    <div id="example-collapse-text" className="px-3 overflow-hidden custom-div-padding">
        <div className="row footer-links">
            <Link className="col-12 col-md-6 mb-2" to="/term-condition">
                <button className="btn btn-light btn-block btn-custom-padding font-weight-bold text-dark" style={{ 
                    border: '1px solid #ccc', 
                    borderRadius: '5px',  // Rounded corners for buttons
                    padding: '10px 15px',
                    backgroundColor: '#ffffff',  // White background for buttons
                    boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)'  // Inner shadow for depth
                }}>Terms &amp; Condition</button>
            </Link>
            <Link className="col-12 col-md-6 mb-2" to="/PrivacyPolicy">
                <button className="btn btn-light btn-block btn-custom-padding font-weight-bold text-dark" style={{ 
                    border: '1px solid #ccc', 
                    borderRadius: '5px',
                    padding: '10px 15px',
                    backgroundColor: '#ffffff',
                    boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)'
                }}>Privacy Policy</button>
            </Link>
            <Link className="col-12 col-md-6 mb-2" to="/RefundPolicy">
                <button className="btn btn-light btn-block btn-custom-padding font-weight-bold text-dark" style={{ 
                    border: '1px solid #ccc', 
                    borderRadius: '5px',
                    padding: '10px 15px',
                    backgroundColor: '#ffffff',
                    boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)'
                }}>Refund/Cancellation Policy</button>
            </Link>
            <Link className="col-12 col-md-6 mb-2" to="/responsible-gaming">
                <button className="btn btn-light btn-block btn-custom-padding font-weight-bold text-dark" style={{ 
                    border: '1px solid #ccc', 
                    borderRadius: '5px',
                    padding: '10px 15px',
                    backgroundColor: '#ffffff',
                    boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)'
                }}>Responsible Gaming</button>
            </Link>
            <Link className="col-12 col-md-6 mb-2" to="/contact-us">
                <button className="btn btn-light btn-block btn-custom-padding font-weight-bold text-dark" style={{ 
                    border: '1px solid #ccc', 
                    borderRadius: '5px',
                    padding: '10px 15px',
                    backgroundColor: '#ffffff',
                    boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)'
                }}>Contact Us</button>
            </Link>
        </div>
    </div>
</div></div>
      
   
  <div className="card mt-2" style={{ border: '1px solid #ccc', width: '93%', margin: '0 auto', backgroundColor: '#f8f9fa', textAlign: 'center' }}>
  <div className="collapsible-card" onClick={() => setToggleTerms(!toggleTerms)} style={{ cursor: 'pointer' }}>
    <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
      <span className="center-bold-dark" style={{ fontSize: '12px', fontWeight: 'bold', color: '#666' }}>About us: Haryanaludo</span>
      <span style={{ fontSize: '12px', color: 'grey', marginLeft: '10px' }}>Know more here</span>
      <span>{toggleTerms ? '▲' : '▼'}</span>
    </div>
    <div className="content" style={{ display: toggleTerms ? 'block' : 'none', padding: '10px', backgroundColor: '#fff', animation: 'slideIn 0.5s forwards' }}>
      <div className="footer-text">
        <p style={{ fontSize: '12px' }}>Haryanaludo is a real-money gaming product owned and operated by Haryanaludo Battle Pvt Ltd. ("We" or "Us" or "Our").</p>
        <span className="footer-text-bold" style={{ fontSize: '12px', fontWeight: 'bold' }}>Our Business & Products</span>
        <p style={{ fontSize: '12px' }}>We are an HTML5 game-publishing company with a mission to make accessing games fast and easy by removing the friction of app-installs.</p>
        <p style={{ fontSize: '12px' }}>Haryanaludo is a skill-based real-money gaming platform accessible only to users in India. Users can compete for real cash in Tournaments and Battles and encash their winnings via popular options such as Paytm Wallet, Amazon Pay, Bank Transfer, Mobile Recharges, etc.</p>
        <span className="footer-text-bold" style={{ fontSize: '12px', fontWeight: 'bold' }}>Our Games</span>
        <p style={{ fontSize: '12px' }}>Haryanaludo.com offers a wide variety of high-quality, premium HTML5 games optimized to work on low-end devices, uncommon browsers, and patchy internet speeds. Our games cover popular categories like Arcade, Action, Adventure, Sports & Racing, Strategy, Puzzle & Logic, and include multiplayer games such as Ludo, Chess, 8 Ball Pool, Carrom, Tic Tac Toe, Archery, Quiz, Chinese Checkers, and more!</p>
        <p style={{ fontSize: '12px' }}>If you have any suggestions for new games or if you're a game developer interested in working with us, please reach out at <a href="mailto:support@Haryanaludo.com">support@Haryanaludo.com</a>.</p>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10vh', marginTop: '10px' }}>
          <p style={{ color: '#e74c3c', fontSize: '12px', fontWeight: 'bold' }}>This game involves an element of financial risk and may be addictive. Please play responsibly at your own risk.</p>
        </div>
        <p style={{ color: '#00008b', fontSize: '12px' }}>&copy; 2020 Haryana ludo Pvt Ltd. All rights reserved.</p>
      </div>
    </div>
  </div>
</div>
  
  </div>



  );
}

export default Legalterms;