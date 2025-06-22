import React, { useEffect, useState } from "react";
import css from "../css/Refer.module.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const Refer = () => {
  const [user, setUser] = useState();
  const [cardData, setCardData] = useState([]);

  const fetchData = async () => {
    try {
      const access_token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${access_token}` };
      const res = await axios.get(`http://localhost:5011/me`, { headers });
      setUser(res.data);
      Allgames(res.data.referral_code);
    } catch (error) {
      console.error("Error fetching data:", error.message);
      toast.error("Something went wrong!", { autoClose: 3000 });
    }
  };

  const Allgames = async (id) => {
    try {
      const access_token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${access_token}` };
      const res = await axios.get(`http://localhost:5011/referral/code/${id}`, {
        headers,
      });
      setCardData(res.data);
    } catch (error) {
      console.error("Error fetching game data:", error.message);
      toast.error("Something went wrong while fetching game data!", {
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const copyCode = () => {
    navigator.clipboard.writeText(user.referral_code);
    toast.success("Referral Code Copied!", { autoClose: 1500 });
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(
      `https://mastanludo.com/login/${user.referral_code}`
    );
    toast.success("Referral Link Copied!", { autoClose: 1500 });
  };

  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const colors = [
    "green",
    "blue",
    "red",
    "orange",
    "purple",
    "yellow",
    "pink",
    "cyan",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
    }, 2000); // Change color every 5 seconds

    return () => clearInterval(interval);
  }, []); // Run effect only once on component mount

  return (
    <div>
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
      <div
        className={css.mainArea}
        style={{ paddingTop: "15px", minHeight: "100vh" }}
      >
        <div
          className="leftContainer"
          style={{ minHeight: "100vh", height: "100%" }}
        >
          <div className={`${css.center_xy} pt-5`}>
            {/* Refer & Earn Card */}

            <div
              className="card mt-2"
              style={{
                border: "1px solid #ccc",
                width: "94%",
                margin: "0 auto",
                boxShadow:
                  "0 4px 8px rgba(0, 0, 0, 0.2), 0 6px 20px rgba(0, 0, 0, 0.19)",
              }}
            >
              <div
                className="card-header text-center"
                style={{
                  fontWeight: "bold",
                  fontSize: "14px",
                  letterSpacing: "0.9px",
                  backgroundColor: "#f8f9fb",
                  padding: "7px 16px",
                  margin: "top",
                }}
              >
                Your Referral Earnings
              </div>
              <div
                className="card mb-2 p-2"
                style={{
                  borderRadius: "2px",
                  boxShadow: "0px 0px 5px rgba(128, 128, 128)",
                }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div className="text-center font-9">
                    Referred Players:&nbsp;
                    <b>{cardData && cardData}</b>
                  </div>
                  <div className="text-center font-9">
                    Referral Earning:
                    <b>
                      {" "}
                      {user && user.referral_earning !== undefined
                        ? user.referral_earning.toFixed(0)
                        : "0"}
                    </b>
                  </div>
                </div>
              </div>

              <div className="p-2">
                <div className="font-14 text-center mb-2"></div>
                <div className="d-flex justify-content-center mb-2">
                  Share with Friends and Earn!
                </div>

                <div className={`${css.progress} mb-2`}>
                  <div
                    className={`${css.progress_bar} ${css.progress_bar_striped} ${css.bg_success}`}
                    aria-valuenow={user?.referral_earning}
                    aria-valuemax={10000}
                    style={{
                      width: `${(user?.referral_earning * 200) / 10000}%`,
                    }}
                  ></div>
                </div>

                <div
                  className="card mb-2 p-2"
                  style={{
                    borderRadius: "5px",
                    boxShadow: "0px 0px 5px rgba(128, 128, 128)",
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="text-center font-9">
                      Max Reward: ₹10,000
                    </div>
                    <div className="d-flex justify-content-end">
                      <Link
                        className="btn btn-sm btn-outline-danger"
                        to="/update-pan"
                        style={{
                          fontSize: "10px",
                          borderRadius: "4px",
                          padding: "2px 5px",
                        }}
                      >
                        <span
                          className="font-9"
                          style={{ color: "red", fontWeight: "bold" }}
                        >
                          Update Limit
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
                <div
                  className="card mb-2 p-2"
                  style={{
                    borderRadius: "5px",
                    boxShadow: "0px 0px 5px rgba(128, 128, 128)",
                    backgroundColor: "#e9ecef",
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="font-10" style={{ color: "#495057" }}>
                      Your Current Earnings:
                    </span>
                    <span
                      className="font-10"
                      style={{
                        padding: "1px 10px",
                        margin: "1px",
                        backgroundColor: "#28a745",
                        borderRadius: "4px",
                        color: "#fff",
                        width: "60px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {/* <img
                        height="18px"
                        width="18px"
                        src={
                          process.env.PUBLIC_URL +
                          "/Images/LandingPage_img/earning.png"
                        }
                        alt=""
                        style={{ borderRadius: "5px" }}
                      /> */}
                      ₹
                      &nbsp;
                      <b>
                        {user && user.referral_wallet !== undefined
                          ? user.referral_wallet.toFixed(1)
                          : "N/A"}
                      </b>
                    </span>
                    <Link
                      className="btn btn-sm btn-outline-primary"
                      to="/Redeem"
                      style={{
                        fontSize: "10px",
                        borderRadius: "4px",
                        padding: "2px 8px",
                        backgroundColor: "#007bff",
                        color: "#fff",
                      }}
                    >
                      <span className="font-9" style={{ color: "white" }}>
                        Redeem
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="card mt-2"
              style={{
                border: "1px solid rgb(204, 204, 204)",
                width: "94%",
                margin: "0 auto",
                borderRadius: "6px",
                boxShadow: "0px 0px 8px rgba(0,0,0,0.1)",
              }}
            >
              <div
                className="card mb-2 p-2"
                style={{
                  borderRadius: "5px",
                  boxShadow: "0px 0px 5px #F8F9FB",
                  backgroundColor: "#F8F9FB",
                }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div className={`${css.text_bold} text-center`}>
                    Your Refer Code:{" "}
                    {user ? user.referral_code || "loading..." : "loading..."}
                    <i
                      className="ri-clipboard-fill ml-2"
                      style={{
                        fontSize: "16px",
                        color: "#007bff",
                        cursor: "pointer",
                      }}
                      onClick={copyCode}
                    ></i>
                  </div>

                  <div className="text-center">
                    <button
                      className="btn btn-sm btn-success"
                      style={{
                        borderRadius: "4px",
                        fontSize: "8px",
                        padding: "1px 4px",
                      }}
                      onClick={copyReferralLink}
                    >
                      <span
                        className="font-9"
                        style={{ color: "white", fontWeight: "bold" }}
                      >
                        Copy Refer Link
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="text-center font-9 mb-2">
                <picture className="mt-1">
                  <img
                    alt="img"
                    width="130px"
                    src="https://i.postimg.cc/t4MxvjQw/refer-and-earn.gif"
                    className="snip-img"
                  />{" "}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <img
                    alt="img"
                    width="100px"
                    src="https://i.postimg.cc/kGxrQbtd/Media-240219-061445.gif"
                    className="snip-img"
                  />
                </picture>

                <div
                  className="card mt-0"
                  style={{
                    borderRadius: "5px",
                    boxShadow: "0px 0px 5px #F8F9FB",
                    backgroundColor: "#F8F9FB",
                  }}
                >
                  <span
                    className="font-9"
                    style={{
                      fontWeight: "bold",
                      color: colors[currentColorIndex],
                      fontFamily: "tiny, sans-serif",
                    }}
                  >
                    <img
                      src="https://i.postimg.cc/MHV5qGxn/rupee-Icon.gif"
                      alt=""
                      width="30px"
                      style={{ marginLeft: "8px" }}
                    />
                    Earn Now Unlimited Rewards
                    <img
                      src="https://i.postimg.cc/MHV5qGxn/rupee-Icon.gif"
                      alt=""
                      width="30px"
                      style={{ marginLeft: "8px" }}
                    />
                  </span>
                </div>
              </div>{" "}
            </div>

            <div className="m-1">
              <div
                className="card mt-1"
                style={{
                  border: "1px solid #ccc",
                  width: "95%",
                  margin: "0 auto",
                  boxShadow:
                    "0 4px 8px rgba(0, 0, 0, 0.2), 0 6px 20px rgba(0, 0, 0, 0.19)",
                }}
              >
                <div
                  className="card-header text-center"
                  style={{
                    fontWeight: "bold",
                    fontSize: "14px",
                    letterSpacing: "0.9px",
                    backgroundColor: "#f8f9fb",
                    padding: "7px 16px",
                    margin: "top",
                  }}
                >
                  How It Works
                </div>

                <div className="d-flex align-items-center p-2 border rounded">
                  <img
                    alt="gift"
                    width="72px"
                    src={process.env.PUBLIC_URL + "Images/refer/giftbanner.png"}
                    className="snip-img"
                  />
                  <div
                    className={`${css.font_9} mx-3`}
                    style={{ width: "60%" }}
                  >
                    <div>
                      When a friend signs up on haryana ludo using your referral
                      link,
                    </div>
                    <div className={`${css.font_8} ${css.c_green} mt-2`}>
                      You earn <strong>2% Commission</strong> on their{" "}
                      <strong>winnings</strong>.
                    </div>
                  </div>
                </div>

                <div className="d-flex align-items-center p-2 border rounded">
                  <img
                    alt="banner"
                    width="72px"
                    src={process.env.PUBLIC_URL + "Images/refer/banner.png"}
                    className="snip-img"
                  />
                  <div
                    className={`${css.font_9} mx-3`}
                    style={{ width: "60%" }}
                  >
                    <div>
                      When your referral participates in a 10,000 Cash battle,
                    </div>
                    <div className={`${css.font_8} ${css.c_green} mt-2`}>
                      You receive{" "}
                      <strong>
                        <img
                          src="https://i.postimg.cc/XJXR7Q1S/global-rupee-Icon.webp"
                          alt=""
                          width="18px"
                        />{" "}
                        200 Cash
                      </strong>{" "}
                      as a reward!
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="card mb-2 p-2"
              style={{
                width: "100%",
                borderRadius: "5px",
                boxShadow: "0px 0px 5px rgba(128, 128, 128)",
              }}
            >
              <div className={`${css.text_bold} text-center`}>
                {" "}
                <img
                  src="https://mastanludo.com/Share.png"
                  alt=""
                  width="22px"
                />
                &nbsp;Share on&nbsp;
                <a
                  href={`whatsapp://send?text=Play Ludo, earn big, and enjoy just a 5% commission. Get a 2% referral bonus on all games. 24x7 WhatsApp support and instant UPI/Bank withdrawals.Use My Referral Code: ${user?.referral_code}. 🎉 https://mastanludo.com/login/${user?.referral_code}`}
                  style={{ width: "50%" }}
                >
                  <button
                    className="btn btn-sm btn-success"
                    style={{
                      borderRadius: "5px",
                      fontSize: "7em",
                      padding: "0px 3px",
                      color: "white",
                    }}
                  >
                    <span
                      className="font-9"
                      style={{ color: "white", fontWeight: "bold" }}
                    >
                      WhatsApp
                    </span>
                  </button>
                </a>
                &nbsp;
                <a
                  href={`https://t.me/share/url?url=https://mastanludo.com/login/${user?.referral_code}`}
                  style={{ width: "50%" }}
                >
                  <button
                    className="btn btn-sm btn-primary"
                    style={{
                      borderRadius: "5px",
                      fontSize: "7em",
                      padding: "0px 3px",
                      color: "white",
                    }}
                  >
                    <span
                      className="font-9"
                      style={{ color: "white", fontWeight: "bold" }}
                    >
                      {" "}
                      Telegram
                    </span>
                  </button>
                </a>
                &nbsp;
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=https://mastanludo.com/login/${user?.referral_code}&quote=🚀%20Join%20the%20fun%20on%20haryanaludo!%20Play%20exciting%20games%20and%20earn%20real%20cash.%20Sign%20up%20now%20and%20get%20started!`}
                  style={{ width: "50%" }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button
                    className="btn btn-sm btn-primary"
                    style={{
                      borderRadius: "5px",
                      fontSize: "7em",
                      padding: "0px 3px",
                      color: "white",
                    }}
                  >
                    <span
                      className="font-9"
                      style={{ color: "white", fontWeight: "bold" }}
                    >
                      {" "}
                      Facebook
                    </span>
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Refer;
