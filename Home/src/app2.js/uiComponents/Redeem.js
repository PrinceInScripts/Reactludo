import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import css from "../css/Addcase.module.css";
import Header from "../Components/Header";

const Redeem = ({ walletUpdate }) => {
  const beckendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
  const beckendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  const nodeMode = process.env.NODE_ENV;
  const baseUrl = nodeMode === "development" ? beckendLocalApiUrl : beckendLiveApiUrl;
  const history = useHistory();

  const [amount, setAmount] = useState();
  const [userAllData, setUserAllData] = useState();

  const role = async () => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    try {
      const res = await axios.get(baseUrl + `me`, { headers });
      setUserAllData(res.data);
    } catch (e) {
      if (e.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("token");
      }
    }
  };

  useEffect(() => {
    let access_token = localStorage.getItem("token");
    access_token = localStorage.getItem("token");
    if (!access_token) {
      window.location.reload();
      history.push("/login");
    }
    role();
  }, []);

  const deposit = () => {
    if (amount && amount >= 50 && amount <= 100000) {
      const access_token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${access_token}`,
      };

      axios.post(baseUrl + `referral/to/wallet`, { amount }, { headers })
        .then((res) => {
          walletUpdate();
          if (res.data.msg === "Invalid Amount") {
            toast.warning("You don't have sufficient amount", { position: toast.POSITION.BOTTOM_RIGHT });
          } else {
            toast.success("Success", { position: toast.POSITION.BOTTOM_RIGHT });
          }
        })
        .catch((e) => {
          console.error(e);
          if (e.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("token");
            window.location.reload();
            history.push("/login");
          }
        });
    } else {
      let msg = "Enter Amount";
      if (!amount) {
        msg = "Enter Amount";
      } else if (amount < 50 || amount > 10000) {
        msg = "Amount should be between ₹50 and ₹10,000.";
      }
      toast.error(msg, { position: toast.POSITION.BOTTOM_RIGHT });
    }
  };

  return (
    <>
      <Header user={userAllData} />
      <div className="leftContainer" style={{ minHeight: "100vh", height: "100%" }}>
        <div className="mt-5 py-4 px-3">
          <div className="card-container">
            <div className="card">
              <div className="card-header">
                <div className="games-section-title">Redeem Your Referral Balance</div>
              </div>
              <div className="card-body">
                <div className="games-section-headline" style={{ fontSize: "1em", fontWeight: "bold" }}>
                  TDS (0%) will be deducted after annual referral earning of ₹15,000.
                </div>
                <div className="games-section-headline mt-3">
                  Enter Amount (Min: ₹50, Max: ₹10,000)
                </div>
                <div className="MuiFormControl-root MuiTextField-root mt-4">
                  <input
                    className="w3-input input"
                    type="number"
                    style={{ width: "100%" }}
                    value={amount}
                    placeholder="Enter Amount"
                    onChange={(e) => setAmount(parseInt(e.target.value))}
                  />
                  <p className="MuiFormHelperText-root">
                    Money will be added to cash.
                  </p>
                </div>
                <button
                  className="refer-button cxy bg-success mt-1"
                  style={{ width: "100%", padding: "2px", fontSize: "1em", fontWeight: "bold" }}
                  onClick={() => deposit()}
                >
                  Redeem 
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
   <ToastContainer
  style={{ marginBottom: '25px' }}
  position="bottom-right"
  autoClose={5000}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
  theme="dark"
/>
    </>
  );
};

export default Redeem;
