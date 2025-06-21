import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Rightcontainer from "../Components/Rightcontainer";
import "../css/Loader.css";

function Return({ walletUpdate }) {
  const beckendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
  const beckendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  const nodeMode = process.env.NODE_ENV;
  let baseUrl = "";

  if (nodeMode === "development") {
    baseUrl = beckendLocalApiUrl;
  } else {
    baseUrl = beckendLiveApiUrl;
  }

  const history = useHistory();
  const location = useLocation();

  const [status, setStatus] = useState();

  useEffect(() => {
    let access_token = localStorage.getItem("token");

    if (!access_token) {
      window.location.reload();
      history.push("/login");
    }

    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    const queryParams = new URLSearchParams(location.search);
    const client_txn_id = queryParams.get("client_txn_id");
    const txn_id = queryParams.get("txn_id");
    const order_id = client_txn_id || queryParams.get("order_id");
    const order_token = txn_id || queryParams.get("order_token");

    const endpoint = client_txn_id && txn_id ? "depositupipay/response" : "deposit/response";

    axios
      .post(baseUrl + endpoint, { order_id, order_token }, { headers })
      .then((res) => {
        setStatus(res.data.status);
        const icon = res.data.status === "PAID" ? "success" : "error";
        const message = res.data.status === "PAID" ? "Deposit submitted successfully" : "Transaction Failed";
        walletUpdate();
        history.push("/landing");

        toast(icon === "success" ? message : { type: "error", message }, {
          autoClose: 3000,
          hideProgressBar: true,
        });
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          window.location.reload();
          history.push("/login");
        }
      });
  }, [baseUrl, history, location.search, walletUpdate]);

  return (
    <>
      <div
        className="leftContainer"
        style={{
          position: "relative",
          minHeight: "100vh",
          height: "100%",
          paddingTop: "60px",
        }}
      >
        <div className="loaderReturn" style={{ zIndex: "99", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <p style={{ marginTop: "10px" }}>PaYment Processing. Please Wait...</p>
    <img
        src="https://i.postimg.cc/cHgHh8LG/Hiplaypp.gif"
        style={{ width: "60%" }}
        alt="img"
    />
    

        </div>
      </div>
      <div className="rightContainer">
        <Rightcontainer />
      </div>
    </>
  );
}

export default Return;