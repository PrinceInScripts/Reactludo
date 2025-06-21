import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Rightcontainer from "../Components/Rightcontainer";
import "../css/terms.css";
import axios from "axios";

const RefundPolicy = () => {
  const [data, setData] = useState("");
  const [WebSitesettings, setWebsiteSettings] = useState("");
  const beckendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
  const beckendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  const nodeMode = process.env.NODE_ENV;

  const baseUrl = nodeMode === "development" ? beckendLocalApiUrl : beckendLiveApiUrl;

  const fetchData = async () => {
    try {
      const response = await fetch(baseUrl + "settings/data");
      const data = await response.json();
      setWebsiteSettings(data);
    } catch (error) {
      console.error("Error fetching website settings:", error);
    }
  };

  const getdata = () => {
    axios.get(baseUrl + `api/term/condition/Refund_Policy`)
      .then((res) => {
        if (res.data && res.data[0] && res.data[0].Desc) {
          setData(res.data[0].Desc);
        } else {
          console.error("Invalid response format:", res.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching refund policy data:", error);
      });
  };

  useEffect(() => {
    getdata();
    fetchData();
  }, []);

  return (
    <div>
      <div className="leftContainer" style={{ minHeight: '100vh', height: '100%' }}>

        <div className="mt-5 py-4 px-3">
          <div className="m-3">
            <h5>Refund Policy</h5>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                <a href="/">Home</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Refund Policy
                </li>
              </ol>
            </nav>
            <h4><strong>Refund Policy</strong></h4>

            <>
              <p className="p1">Refund Policy</p>
              <p className="p2">
                Thanks for being a patron with {(WebSitesettings) ? WebSitesettings.CompanyName : ''} (referred
                as “{(WebSitesettings) ? WebSitesettings.WebsiteName : ''}”)<span className="Apple-converted-space">&nbsp; </span>. If you
                are not entirely satisfied with your subscription, we are here to help.
              </p>
              <p className="p1">Refund</p>
              <p className="p2">
                Once we receive your Refund request, we will inspect it and notify you on
                the status of your refund.
              </p>
              <p className="p2">
                If your refund request is approved, we will initiate a refund to your credit
                card (or original method of payment) within 7 working days. You will receive
                the credit within a certain amount of days, depending on your card issuer's
                policies.
              </p>
              <p className="p2">
                In case of unforeseen technical glitch, {(WebSitesettings) ? WebSitesettings.CompanyName : ''}
                would refund subscription upon reviewing the complaint. Final decision lies
                with the company.
              </p>
            </>

          </div>
        </div>
      </div>
      <div className="rightContainer">
        <Rightcontainer />
      </div>
    </div>
  );
};
export default RefundPolicy;