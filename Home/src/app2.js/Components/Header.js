import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";


import "../Components/Component-css/Header.css";
import css from "./Component-css/Nav.module.css";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

const w3_close = () => {
  const width = document.getElementById("mySidebar").offsetWidth;
  document.getElementById("mySidebar").style.left = `-${width}px`;
  document.getElementById("sidebarOverlay").style.display = "none";
};
const w3_open = () => {
  document.getElementById("mySidebar").style.left = "0";
  document.getElementById("sidebarOverlay").style.display = "block";
};

const Header = ({ user, loggedIn }) => {
  const beckendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
  const beckendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  const nodeMode = process.env.NODE_ENV;
  const location=useLocation();
  let baseUrl;
  if (nodeMode === "development") {
    baseUrl = beckendLocalApiUrl;
  } else {
    baseUrl = beckendLiveApiUrl;
  }

  const history = useHistory();

  let access_token = localStorage.getItem("token");
  access_token = localStorage.getItem("token");

  const [WebSitesettings, setWebsiteSettings] = useState("");

  const fetchData = async () => {
    const response = await fetch(baseUrl + "settings/data");
    const data = await response.json();
    return setWebsiteSettings(data);
  };
  document.title = WebSitesettings
    ? WebSitesettings.WebTitle
    : " ";

  useEffect(() => {
    fetchData();
  }, []);

  const logout = () => {
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    axios
      .post(
        baseUrl + `logout`,
        {
          headers: headers,
        },
        { headers }
      )
      .then((res) => {
        localStorage.removeItem("token");
        window.location.reload();
        history.push("/");
      })
      .catch((e) => {
        if (e.response?.status == 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("token");
        }
      });
  };

  return (
      <div>
      {access_token ? (
        <React.Fragment>
          <div id="sidebarOverlay" onClick={w3_close}></div>
         
          <div
            className="w3-sidebar w3-bar-block"
            id="mySidebar"
            style={{ paddingBottom: "70px" }}
          > 
           <div className="w3-bar-item1  w3-xlarge w3-center">
            <div style={{ display: "flex", alignItems: "center" }}>
               <picture className={`ml-2 ${css.navLogo} d-flex`}>
                    <img
                      src="/khelobuddy/logo.png"
                      className="snip-img"
                      alt=""
                    />
              </picture>
              <div className={`${css.navLogoText} ml-2`}>
                <b>Khelobuddy</b>
              </div>
            </div>
             
              <div className="w3-right w3-padding">
                <button
                  className="w3-button w3-teal w3-xlarge"
                  onClick={w3_close}
                >
                  <picture className={`${css.sideNavIcon} mr-0`}>
                    <img
                      src="https://cdn-icons-png.flaticon.com/128/9068/9068699.png"
                      className="snip-img"
                      alt=""
                    />
                  </picture>
                </button>
                </div>
          </div>
          <Link
              to={"/Profile"}
              className={`w3-bar-item w3-button ${location.pathname === '/Profile' ? 'active' : ''}`}
              onClick={w3_close}
            >
              <picture className="icon">
                {user && user.avatar ? (
                  <img
                    width="60px"
                    height="60px"
                    src={baseUrl + `${user && user.avatar}`}
                    alt="profile"
                    style={{ borderRadius: "50px" }}
                  />
                ) : (
                  <img
                    src="/khelobuddy/logo.png"
                    width="25px"
                    height="25px"
                    alt="profile"
                  />
                )}
              </picture>
              {/* <div style={{ display: "flex", alignItems: "center", flexDirection: "column" }}> */}
                   <div style={{ marginLeft: ".5rem", fontSize: "18px", fontWeight: "none" }}>My Profile</div>
                   {/* <div style={{ marginLeft: ".5rem", fontSize: "10px", fontWeight: "none" }}>{user && user.Name}</div> */}
              {/* </div> */}
             
              <picture className="sideNav-arrow">
                <img
                  src={
                    process.env.PUBLIC_URL +
                    "/Images/global-black-chevronRight.png"
                  }
                  alt=""
                />
              </picture>

              <div className="sideNav-divider"></div>
            </Link>
            <Link
              to={"/landing"}
              className={`w3-bar-item w3-button ${location.pathname === '/landing' ? 'active' : ''}`}
              onClick={w3_close}
            >
              <picture className="icon">
                <img
                  alt="img"
                  src="https://cdn-icons-png.flaticon.com/128/10339/10339556.png"
                />
              </picture>
             <div style={{ marginLeft: ".5rem", fontSize: "18px", fontWeight: "" }}>
             Play Games</div>
              <picture className="sideNav-arrow">
                <img
                  src={
                    process.env.PUBLIC_URL +
                    "/Images/global-black-chevronRight.png"
                  }
                  alt=""
                />
              </picture>
              <div className="sideNav-divider"></div>
            </Link>
            <Link
              to={"/wallet"}
              className={`w3-bar-item w3-button ${location.pathname === '/wallet' ? 'active' : ''}`}
              onClick={w3_close}
            >
              <picture className="icon">
                <img
                  alt="img"
                  src="https://cdn-icons-png.flaticon.com/128/869/869067.png"
                />
              </picture>
              <div style={{ marginLeft: ".5rem", fontSize: "18px", fontWeight: "" }}>My wallet</div>
              <picture className="sideNav-arrow">
                <img
                  src={
                    process.env.PUBLIC_URL +
                    "/Images/global-black-chevronRight.png"
                  }
                  alt=""
                />
              </picture>
              <div className="sideNav-divider"></div>
            </Link>
            <Link
              to={"/Gamehistory"}
              className={`w3-bar-item w3-button ${location.pathname === '/Gamehistory' ? 'active' : ''}`}
              onClick={w3_close}
            >
              <picture className="icon">
                <img
                  alt="img"
                  src="https://cdn-icons-png.flaticon.com/128/2550/2550251.png"
                />
              </picture>
              <div style={{ marginLeft: ".5rem", fontSize: "18px", fontWeight: "" }}>History</div>

              <picture className="sideNav-arrow">
                <img
                  src={
                    process.env.PUBLIC_URL +
                    "/Images/global-black-chevronRight.png"
                  }
                  alt=""
                />
              </picture>

              <div className="sideNav-divider"></div>
            </Link>
            <Link
              to={"/refer"}
              className={`w3-bar-item w3-button ${location.pathname === '/refer' ? 'active' : ''}`}
              onClick={w3_close}
            >
              <picture className="icon">
                <img
                  alt="img"
                  src="https://cdn-icons-png.flaticon.com/128/14809/14809873.png"
                />
              </picture>
              <div style={{ marginLeft: ".5rem", fontSize: "18px", fontWeight: "" }}>
                Refer and Earn
                <div className="small-live-indicator">
                  Now 2% 
                </div>
              </div>
                      

              <picture className="sideNav-arrow">
                <img
                  src={
                    process.env.PUBLIC_URL +
                    "/Images/global-black-chevronRight.png"
                  }
                  alt=""
                />
              </picture>

              <div className="sideNav-divider"></div>
            </Link>
            <Link
              to={"/Notification"}
              className={`w3-bar-item w3-button ${location.pathname === '/Notification' ? 'active' : ''}`}
              onClick={w3_close}
            >
              <picture className="icon">
                <img
                  alt="img"
                  src="https://cdn-icons-png.flaticon.com/128/3541/3541850.png"
                />
              </picture>
              <div style={{ marginLeft: ".5rem", fontSize: "18px", fontWeight: "" }}>Notification</div>

              <picture className="sideNav-arrow">
                <img
                  src={
                    process.env.PUBLIC_URL +
                    "/Images/global-black-chevronRight.png"
                  }
                  alt=""
                />
              </picture>

              <div className="sideNav-divider"></div>
            </Link>

            <Link
              to={"/support"}
               className={`w3-bar-item w3-button ${location.pathname === '/support' ? 'active' : ''}`}
              onClick={w3_close}
            >
              <picture className="icon">
                <img
                  alt="img"
                  src="https://cdn-icons-png.flaticon.com/128/10308/10308800.png"
                />
              </picture>
              <div style={{ marginLeft: ".5rem", fontSize: "18px", fontWeight: "" }}>Support
                  {/*<div className="small-live-indicator">
      LiveChat 
    </div>*/}
   </div>
              <picture className="sideNav-arrow">
                <img
                  src={
                    process.env.PUBLIC_URL +
                    "/Images/global-black-chevronRight.png"
                  }
                  alt=""
                />
              </picture>

              <div className="sideNav-divider"></div>
            </Link>
            <Link
              to={"/Legalterms"}
               className={`w3-bar-item w3-button ${location.pathname === '/Legalterms' ? 'active' : ''}`}
              onClick={w3_close}
            >
              <picture className="icon">
                <img
                  alt="img"
                  src="https://cdn-icons-png.flaticon.com/128/10288/10288959.png"
                />
              </picture>
              <div style={{ marginLeft: ".5rem", fontSize: "18px", fontWeight: "" }}>Legal Terms</div>

              <picture className="sideNav-arrow">
                <img
                  src={
                    process.env.PUBLIC_URL +
                    "/Images/global-black-chevronRight.png"
                  }
                  alt=""
                />
              </picture>
             <div className="sideNav-divider"></div>
             </Link>
          </div> 
                 
          <div className="w3-teal">
            <div className="w3-container ">
            
              <div className={`${css.headerContainer} `}>
                <button
                  className="w3-button w3-teal w3-xlarge float-left"
                  onClick={w3_open}
                  id="hambergar"
                >
                  <picture className={`${css.sideNavIcon} mr-0`}>
                    <img
                      src="https://cdn-icons-png.flaticon.com/128/9684/9684929.png"
                      className="snip-img"
                      alt=""
                    />
                  </picture>
                </button> 
                <Link to="/">
                  <picture className={`ml-2 ${css.navLogo} d-flex`}>
                    <img
                      src="/khelobuddy/logo.png"
                      className="snip-img"
                      alt=""
                    />
                  </picture>
                </Link>
                      
                <div>

                   <div className={`${css.menu_items} wallet-container`}>
  <div class="wallet-balance">₹ {user && user.Wallet_balance !== undefined ? `${Math.floor(user.Wallet_balance)}` : '0'}</div>
  <Link class="" to="/Addcase">
    <img src="https://cdn-icons-png.flaticon.com/128/10336/10336627.png" width={"30px"} alt="" />
  </Link>
</div>
              
                  
                  {/* <div className={`${css.menu_items}`}>
                    <Link className={`${css.box}`} to="/Addcase">
                      <picture className={`${css.moneyIcon_container}`}>
                        <img
                          src="https://i.postimg.cc/XJXR7Q1S/global-rupee-Icon.webp"
                          className="snip-img"
                          alt=""
                        />
                      </picture>
                      <div className="mt-1 ml-1">
                        <div className={`${css.moneyBox_header}`}><b>Cash</b></div>
                     
                                <div className={`${css.moneyBox_text}`}>
              {user && user.Wallet_balance !== undefined ? `${Math.floor(user.Wallet_balance)}` : '0'}
            </div>
                     
                     
                      </div>
                      <picture className={`${css.moneyBox_add}`}>
  <img
    src="https://i.postimg.cc/wjGQLz9r/global-add-Sign.png"
    className="snip-img"
    alt=""
  />
</picture>
</Link>
{user && user.referral_wallet > 1 ? (
  <Link
    className={`${css.box} ml-2`}
    to="/redeem/refer"
    style={{ width: "80px" }}
  >
    <picture className={`${css.moneyIcon_container}`}>
      <img
        src="https://i.postimg.cc/FzNyNsxY/earning.png"
        className="snip-img"
        alt=""
      />
    </picture>
    <div className="mt-1 ml-1">
      <div className={`${css.moneyBox_header}`}><b>Earning</b></div>
      <div className={`${css.moneyBox_text}`}>
        {user && user.referral_wallet !== undefined ? `${user.referral_wallet.toFixed(0)}` : '0'}
      </div>
    </div>
  </Link>
) : null}
</div> */}
                  <span className="mx-5"></span>
                </div>
                <span className="mx-5"></span>
              </div>
            </div>
          </div>
        </React.Fragment>
      ) : (
        <div className="w3-teal ">
          <div className="w3-container "> 
            <div className={`${css.headerContainer} justify-content-between`}>
              <Link to="/">
                <picture className={`ml-2 ${css.navLogo} d-flex`}>
                  <img
                    src="/khelobuddy/logo.png"
                    className="snip-img"
                    alt=""
                  />
                </picture>
              </Link>

              <div className={`ml-5`}>
                <Link
                  type="button"
                  className="login-btn border-success text-success"
                  to="/signup"
                >
                  SIGNUP
                </Link>
                <Link type="button" className="login-btn" to="/login">
                  LOGIN
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;