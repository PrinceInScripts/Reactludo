import React, { useEffect, useState } from "react";
import css from "../css/Mywallet.module.css";
import Rightcontainer from "../Components/Rightcontainer";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";

const Mywallet = () => {
  const history = useHistory();
  const beckendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
  const beckendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  const nodeMode = process.env.NODE_ENV;
  if (nodeMode === "development") {
    var baseUrl = beckendLocalApiUrl;
  } else {
    baseUrl = beckendLiveApiUrl;
  }
  let access_token = localStorage.getItem("token");
  access_token = localStorage.getItem("token");
  const [user, setUser] = useState();

  useEffect(() => {
    let access_token = localStorage.getItem("token");
    access_token = localStorage.getItem("token");
    if (!access_token) {
      window.location.reload();
      history.push("/login");
    }
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    axios
      .get(baseUrl + `me`, { headers })
      .then((res) => {
        setUser(res.data);
      })
      .catch((e) => {
        console.log(e);
        if (e.response?.status == 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("token");
          window.location.reload();
          history.push("/login");
        }
      });
  }, []);

  // Calculate deposit balance by subtracting winning amount from wallet balance
  const depositBalance = user 
    ? (user.Wallet_balance - (user.withdrawAmount || 0)) > 0 
      ? (user.Wallet_balance - (user.withdrawAmount || 0)) 
      : 0
    : 0;

  return (
    <>
      <div className="leftContainer">
        <div className="container px-3 mt-4 py-5" style={{ height: "12px" }}>
          <div className="card mt-1" style={{ 
            borderRadius: '2px', 
            boxShadow: '0px 0px 5px rgba(128, 128, 128)', 
            width: '100%', 
            margin: '0 auto' 
          }}>
            <div className="mb-3 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center justify-content-start">
                <button 
                  onClick={() => history.goBack()} 
                  className="btn btn-primary" 
                  style={{ 
                    backgroundColor: '#0D6EFD', 
                    borderRadius: '5px' 
                  }}
                >
                  <i className="fa fa-arrow-circle-left" style={{ color: 'white' }}></i>
                  <span className="text-capitalize fw-bold" style={{ color: 'white' }}><b>BACK</b></span>
                </button>
              </div>
              <Link 
                className="text-capitalize btn btn-outline-primary fw-bold" 
                to="/transaction-history" 
                style={{ 
                  color: '#0D6EFD', 
                  borderColor: '#0D6EFD', 
                  height: '31px', 
                  borderRadius: '5px' 
                }}> 
                <span className="font-9" style={{ color: '#0D6EFD' }}><b>Wallet history</b></span>
              </Link>
            </div>
          </div>
        </div>
        <br />
                 
        <div className="card mt-1" style={{ 
          borderRadius: '2px', 
          boxShadow: '0px 0px 5px rgba(128, 128, 128)', 
          width: '94%', 
          margin: '0 auto' 
        }}>
          <div className={css.wallet_card}>
            <div className="d-flex align-items-center">
              <picture className="mr-1">
                <img
                  height="26px"
                  width="26px"
                  src="https://i.postimg.cc/XJXR7Q1S/global-rupee-Icon.webp"
                  alt=""
                />
              </picture>
              <span
                className="text-black"
                style={{ fontSize: "1.3em", fontWeight: "900" }}
              >
                ₹{depositBalance.toFixed(0)}
              </span>
            </div>
            <div
              className="text-black text-uppercase"
              style={{ fontSize: "0.9em", fontWeight: "800" }}
            >
              Deposit Cash
            </div>
            <div className={`${css.my_text} mt-5`}>
              Can be used to play Tournaments &amp; Battles.
              <br />
              Cannot be withdrawn to Paytm or Bank.
            </div>
            <Link to="/addcase">
              <button
                className={`${css.walletCard_btn} d-flex justify-content-center align-items-center text-uppercase`}
              >
                Add Cash
              </button>
            </Link>
          </div>
          
          <div className={css.wallet_card2}>
            <div className="d-flex align-items-center">
              <picture className="mr-1">
                <img
                  height="26px"
                  width="26px"
                  src="https://i.postimg.cc/XJXR7Q1S/global-rupee-Icon.webp"
                  alt=""
                />
              </picture>
              <span
                className="text-black"
                style={{ fontSize: "1.3em", fontWeight: "900" }}
              >
                ₹{user && user.withdrawAmount !== undefined ? user.withdrawAmount.toFixed(0) : '0'}
              </span>
            </div>
            <div
              className="text-black text-uppercase"
              style={{ fontSize: "0.9em", fontWeight: "800" }}
            >
              Winning Cash
            </div>
            <div className={`${css.my_text2} mt-5`}>
              Can be withdrawn to Paytm or Bank. Can be used to play Tournaments
              &amp; Battles.
            </div>
            <Link to="/Withdrawopt">
              <button
                className={`${css.walletWCard_btn} d-flex justify-content-center align-items-center text-uppercase`}
              >
                Withdraw
              </button>
            </Link>
          </div>
        </div>
      </div>
      <div className="rightContainer">
        <div>
          <Rightcontainer />
        </div>
      </div>
    </>
  );
};
export default Mywallet;