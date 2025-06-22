import React, { useEffect, useState } from "react";
import "../css/Mywallet.module.css";
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
    ? user.Wallet_balance - (user.withdrawAmount || 0) > 0
      ? user.Wallet_balance - (user.withdrawAmount || 0)
      : 0
    : 0;

  return (
    <>
      <div className="leftContainer">
        <div className="container px-3 " style={{ marginTop: "60px" }}>
          <div className="card mt-1 wallet-card">
            <div className="card-body">
              <div className="mb-3 d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center justify-content-start">
                  <button
                    onClick={() => history.goBack()}
                    className="btn btn-primary"
                    style={{
                      backgroundColor: "#0D6EFD",
                      borderRadius: "5px",
                    }}
                  >
                    <i
                      className="fa fa-arrow-circle-left"
                      style={{ color: "white" }}
                    ></i>
                    <span
                      className="text-capitalize fw-bold"
                      style={{ color: "white" }}
                    >
                      <b>BACK</b>
                    </span>
                  </button>
                </div>
                <Link
                  className="text-capitalize btn btn-outline-primary fw-bold"
                  to="/transaction-history"
                  style={{
                    color: "#0D6EFD",
                    borderColor: "#0D6EFD",
                    height: "31px",
                    borderRadius: "5px",
                  }}
                >
                  <span className="font-9" style={{ color: "#0D6EFD" }}>
                    <b>Wallet history</b>
                  </span>
                </Link>
              </div>

              {/* <div className=" mb-4">
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
                      ₹
                      {user && user.Wallet_balance + user.withdrawAmount !== undefined
                        ? user.Wallet_balance.toFixed(0)
                        : "0"}
                    </span>

                    <div className="text-black text-uppercase">
                      <span style={{ fontSize: "0.9em", fontWeight: "800" }}>
                        Total Balance
                      </span>
                    </div>
              </div> */}
              {/* <div class="card bg-light mx-auto" style="max-width: 20rem; border-radius: 0.75rem;"> */}
              <div
                className="card bg-light mx-auto mb-5"
                style={{ borderRadius: "0.5rem" }}
              >
                <div
                  className="card-body text-center p-3"
                  style={{ backgroundColor: "aliceblue" }}
                >
                  <div
                    className="bg-white rounded-circle mx-auto d-flex align-items-center justify-content-center mb-2"
                    style={{
                      width: "48px",
                      height: "48px",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                    }}
                  >
                    <img
                      src="https://cdn-icons-png.flaticon.com/128/10432/10432837.png"
                      alt="Rupee Icon"
                      style={{ width: "48px", height: "48px" }}
                    />
                  </div>
                  <h4
                    className=" text-black mb-1"
                    style={{ fontSize: "1.3em", fontWeight: "900" }}
                  >
                    ₹900
                  </h4>
                  <p
                    className="fw-semibold text-muted mb-0"
                    style={{ fontSize: "0.9em", fontWeight: "800" }}
                  >
                    TOTAL BALANCE
                  </p>
                </div>
              </div>

              {/* <hr className="divider_x" /> */}

              <div className="d-flex flex-column justify-content-between align-items-center">
                <div className="d-flex justify-content-between align-items-center mb-3 w-100">
                  <div>
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
                    <div
                      className="text-black text-uppercase"
                      style={{ fontSize: "0.9em", fontWeight: "800" }}
                    >
                      Deposit Cash
                    </div>
                  </div>
                  <Link to="/addcase">
                    <button
                      className={`mywallet_btn d-flex justify-content-center align-items-center text-uppercase`}
                      style={{
                        height: "31px",
                        width: "120px",
                        borderRadius: "5px",
                        fontSize: "0.9em",
                        fontWeight: "bold",
                        backgroundColor: "#000",
                        color: "white",
                      }}
                    >
                      Add Cash
                    </button>
                  </Link>
                </div>

                <div className="text-muted">
                  Can be used to play Tournaments &amp; Battles. Cannot be
                  withdrawn to Paytm or Bank.
                </div>
              </div>

              <hr className="divider_x" />

              <div className="d-flex flex-column justify-content-between align-items-center">
                <div className="d-flex justify-content-between align-items-center mb-3 w-100">
                  <div>
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
                      ₹
                      {user && user.withdrawAmount !== undefined
                        ? user.withdrawAmount.toFixed(0)
                        : "0"}
                    </span>
                    <div
                      className="text-black text-uppercase"
                      style={{ fontSize: "0.9em", fontWeight: "800" }}
                    >
                      Withdraw Cash
                    </div>
                  </div>
                  <Link to="/Withdrawopt">
                    <button
                      className={`mywallet_btnn d-flex justify-content-center align-items-center text-uppercase`}
                      style={{
                        height: "31px",
                        width: "120px",
                        borderRadius: "5px",
                        fontSize: "0.9em",
                        fontWeight: "bold",
                        backgroundColor: "#000",
                        color: "white",
                      }}
                    >
                      Withdraw
                    </button>
                  </Link>
                </div>
                <div className="text-muted">
                  Can be withdrawn to Paytm or Bank. Can be used to play
                  Tournaments &amp; Battles.
                </div>
              </div>
              <hr className="divider_x" />

              <div className="d-flex flex-column justify-content-between align-items-center">
                <div className="d-flex justify-content-between align-items-center mb-3 w-100">
                  <div>
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
                      ₹
                      {user && user.referral_earning !== undefined
                        ? user.referral_earning.toFixed(0)
                        : "0"}
                    </span>
                    <div
                      className="text-black text-uppercase"
                      style={{ fontSize: "0.9em", fontWeight: "800" }}
                    >
                      Refferral Earning Cash
                    </div>
                  </div>
                  <Link to="/Redeem">
                    <button
                      className={`mywallet_btnn d-flex justify-content-center align-items-center text-uppercase`}
                      style={{
                        height: "31px",
                        width: "120px",
                        borderRadius: "5px",
                        fontSize: "0.9em",
                        fontWeight: "bold",
                        backgroundColor: "#000",
                        color: "white",
                      }}
                    >
                      Redeem
                    </button>
                  </Link>
                </div>
                <div className="text-muted">
                  Can be add to your wallet. Can be used to play Tournaments
                  &amp; Battles. Cannot be withdrawn to Paytm or Bank.
                </div>
              </div>

              <hr className="divider_x" />
            </div>
          </div>

          {/* <div className="card mt-3 options-list">
            <ul className="list-group list-group-flush">
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Saved Payment Modes
                <span>&gt;</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Transaction History
                <span>&gt;</span>
              </li>
            </ul>
          </div> */}
        </div>

        {/* <div className="container px-3 mt-4 py-5" style={{ height: "12px" }}>
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
        </div> */}
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
