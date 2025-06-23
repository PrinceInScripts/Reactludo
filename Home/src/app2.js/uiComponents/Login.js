import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import axios from "axios";
import "../css/login.css";
const Login = () => {
  const history = useHistory();
  const location = useLocation();
  const timerRef = useRef(null);

  const [Phone, setPhone] = useState("");
  const [twofactor_code, settwofactor_code] = useState("");
  const [otp, setOtp] = useState(false);
  const [secretCode, setSecretCode] = useState("");
  const [referral, setReferral] = useState(
    location.pathname.split("/")[2] || ""
  );
  const [timer, setTimer] = useState(35);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [buttonText, setButtonText] = useState("Continue");
  const [agreed, setAgreed] = useState(true); // Default checked

  useEffect(() => {
    showInfo("Welcome to Mastan Ludo!");
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setReferral(location.pathname.split("/")[2] || "");
  }, [location.pathname]);

  const handleClick = async (e) => {
    e.preventDefault();
    if (!agreed) {
      showError("You must agree to Terms & Privacy to continue");
      return;
    }
    setLoading(true);
    setButtonText("");

    if (!Phone) {
      showError("Please enter your phone number");
      setLoading(false);
      setButtonText("Continue");
    } else if (!/^[0-9]{10}$/.test(Phone)) {
      showError("Please enter a valid 10-digit phone number");
      setLoading(false);
      setButtonText("Continue");
    } else {
      try {
        const response = await axios.post(`http://localhost:5011/login`, {
          Phone,
          referral,
        });

        if (response.data.status === 101) {
          showError(response.data.msg);
          setLoading(false);
          setButtonText("Continue");
        } else if (response.data.status === 200) {
          setOtp(true);
          setOtpSent(true);
          setSecretCode(response.data.secret);
          startTimer();
          showInfo("OTP sent to Mobile number");
          setLoading(false);
          setButtonText("Continue");
        }
      } catch (error) {
        showError("Something went wrong");
        setLoading(false);
        setButtonText("Continue");
      }
    }
  };

  const startTimer = () => {
    let seconds = 35;
    setTimer(seconds);
    setOtpSent(true);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      seconds--;
      setTimer(seconds);
      if (seconds <= 0) {
        clearInterval(timerRef.current);
        setTimer(0);
        setOtpSent(false);
      }
    }, 1000);
  };

  const resendOTP = async (e) => {
    e.preventDefault();
    if (!otpSent) {
      try {
        const response = await axios.post(`http://localhost:5011/login`, {
          Phone,
          referral,
        });

        if (response.data.status === 200) {
          setOtpSent(true);
          startTimer();
        } else {
          showError("Failed to resend OTP");
        }
      } catch (error) {
        showError("Failed to resend OTP");
      }
    } else {
      showInfo("OTP already sent. Please wait for the timer to expire.");
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();

    if (!Phone) {
      showError("Please enter your phone number");
    } else if (!/^[0-9]{10}$/.test(Phone)) {
      showError("Please enter a valid 10-digit phone number");
    } else if (!twofactor_code) {
      showError("Please enter the OTP");
    } else {
      try {
        setLoadingVerify(true);
        const response = await axios.post(
          `http://localhost:5011/login/finish`,
          {
            Phone,
            twofactor_code,
            referral,
            secretCode,
          }
        );

        if (response.data.status === 101) {
          showError(response.data.msg);
        } else if (response.data.status === 200) {
          const token = response.data.token;
          localStorage.setItem("token", token);
          showSuccess("Login successful!");
          setTimeout(() => {
            history.push("/Games");
            window.location.reload(true);
          }, 1000);
        } else {
          showError("Something went wrong!");
        }
      } catch (error) {
        showError("Something went wrong!");
      } finally {
        setLoadingVerify(false);
      }
    }
  };

  const showError = (message) => {
    toast.error(message, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
    });
  };

  const showInfo = (message) => {
    toast.info(message, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
    });
  };

  const showSuccess = (message) => {
    toast.success(message, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
    });
  };

  return (
    <>
      <div className="login-bg">
        <div className="login-card">
          <div className="login-title" style={{ display: "flex", alignItems: "center" }}>
             <picture style={{ marginRight: "10px" }}>
              <img
                src="/khelobuddy/logo.png"
                alt="Khelobuddy Logo"
                className="login-logo"
                width={40}
                height={40}
              />
            </picture>
            <span style={{ fontSize: "32px" , fontWeight: "bold" }}>KheloBuddy</span>
             </div>
          <div className="login-subtitle">Login / Signup</div>
          <form>
            <div className="login-input-wrapper">
              <span className="login-country">+91</span>
              <input
                className="login-input"
                name="mobile"
                type="tel"
                maxLength="10"
                placeholder="Mobile number"
                value={Phone}
                autoComplete="tel"
                onChange={(e) => {
                  if (/^[0-9]{0,10}$/.test(e.target.value))
                    setPhone(e.target.value);
                }}
              />
            </div>
            {otp && (
              <div className="login-input-wrapper">
                <span className="login-country">OTP</span>
                <input
                  className="login-input"
                  name="otp"
                  type="tel"
                  maxLength="6"
                  placeholder="Enter OTP"
                  value={twofactor_code}
                  autoComplete="one-time-code"
                  onChange={(e) =>
                    settwofactor_code(e.target.value.replace(/\D/, ""))
                  }
                />
              </div>
            )}

            <div className="login-checkbox-row">
              <input
                type="checkbox"
                className="login-checkbox"
                id="agreeCheckbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                readOnly
              />
              <label className="login-checkbox-label" htmlFor="agreeCheckbox">
                I agree to the <Link to="/term-condition">Terms of Use</Link>{" "}
                and <Link to="/PrivacyPolicy">Privacy Policy</Link>. I am 18+
                and not from restricted states.
              </label>
            </div>

            {!loading && !otp && (
              <button className="login-btnn simple" onClick={handleClick}>
                {buttonText}
              </button>
            )}

            {!loading && otp && (
              <button className="login-btnn verify" onClick={verifyOtp}>
                {loadingVerify ? (
                  <div className="spinner" />
                ) : (
                  <span>Verify OTP</span>
                )}
              </button>
            )}

            {loading && (
              <button className="login-btnn disabled" disabled>
                <div className="spinner" />
              </button>
            )}

            {otp && timer > 0 && (
              <div className="login-otp-timer">
                Didn't receive OTP? Retry in ({timer}) sec
              </div>
            )}
            {otp && timer === 0 && (
              <div className="login-otp-timer">
                <a href="#resend-otp" onClick={resendOTP}>
                  Resend OTP
                </a>
              </div>
            )}
          </form>
        </div>
      </div>
      <ToastContainer theme="light" />
    </>
  );
};

export default Login;
