import axios from "axios";
import React, { useRef, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
// import deposits from "../../app/components/transaction/Deposits";
import css from "../css/Addcase.module.css";
import { Link } from "react-router-dom";
//import Rightcontainer from "../Components/Rightcontainer";
import "../css/Loader.css";
import Swal from "sweetalert2";
// import findGif from "/";
import Header from "../Components/Header";

const beckendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
const beckendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
const nodeMode = process.env.NODE_ENV;
if (nodeMode === "development") {
  var baseUrl = beckendLocalApiUrl;
} else {
  baseUrl = beckendLiveApiUrl;
}
const Addcase = ({ walletUpdate }) => {
  const history = useHistory();
  let method = useRef();
  let checkInterval;
  const [userAllData, setUserAllData] = useState();

  const [global, setGlobal] = useState(100);
  const [next, setNext] = useState(1);
  const [process, setProcess] = useState(false);
  const [isMobile, setMobile] = useState(false);

  const [isCashFreeActive, setCashFreeActive] = useState(false);
  const [isPhonePeActive, setPhonePeActive] = useState(false);
  const [isRazorPayActive, setRazorPayActive] = useState(false);
  const [isDecentroActive, setDecentroActive] = useState(false);
  const [isUpiGatewayActive, setUpiGatewayActive] = useState(true);

  const [isManualPaymentActive, setManualPaymentActive] = useState(false);
  const [isManualUPIQR, setManualUPIQR] = useState(false);

  const [RazorPayKey, setRazorPayKey] = useState(false);
  const [RazorPayAccountName, setAccountName] = useState("Skill Based Gaming");

  const [qrCode, setQrCode] = useState();
  const [walletOption, setWalletOption] = useState("airtel");
  const [bankCode, setBankCode] = useState(3003);

  const [account_mail_id, setAccount_mail_id] = useState();
  const [account_name, setAccount_name] = useState();
  const [accountPhone, setAccountPhone] = useState();

  const [scrnshot, setScrnshot] = useState(null);
  const [scrnshot1, setScrnshot1] = useState("");
  const [upiUtrNum, setupiUtrNum] = useState("");

  const handleChange = (e) => {
    setScrnshot1(URL.createObjectURL(e.target.files[0]));
    setScrnshot(e.target.files[0]);
  };
  
   const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("ombk.aaev17465havrlcunww@mbk");
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000); // Reset alert after 3 seconds
  };
  
  const ManualPayment = async (e) => {
    e.preventDefault();
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    const formData = new FormData();

    formData.append("Transaction_Screenshot", scrnshot);
    formData.append("amount", global);
    formData.append("referenceId", upiUtrNum);

    const response = await axios.post(
      baseUrl + `manual/deposit/txn`,
      formData,
      { headers }
    );
    //console.log(response.data);
    if (response.data.status === "Pending") {
      setTimeout(() => {
        axios
          .get(baseUrl + `manual/depositstatus/${response.data._id}`, {
            headers,
          })
          .then((res) => {
            //console.log(res);
            const icon = res.data.status === "PAID" ? "success" : "danger";
            var title = "";
            if (res.data && res.data.status === "PAID") {
              title = "Deposit submited successfully";
            } else if (res.data && res.data.status === "Pending") {
              title = "Deposit Transaction in proccess.";
            } else if (!res.data.status) {
              title = "Deposit Transaction Rejected Due to invalid UTR Number.";
            }

            history.push("/");
            setTimeout(() => {
              setProcess(false);
              Swal.fire({
                title: title,
                icon: icon,
                confirmButtonText: "OK",
              });
            }, 1000);
          });
      }, 30000);
      setProcess(true);
    } else {
      setProcess(false);
      Swal.fire({
        title: "Deposit Falied",
        icon: "danger",
        confirmButtonText: "OK",
      });
    }
  };

  //Function to load razorpay script for the display of razorpay payment SDK.
  function loadRazorpayScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  //function will get called when clicked on the pay button.
  async function displayRazorpayPaymentSdk(
    channel,
    method,
    upiMethod,
    razorpay
  ) {
    const res = await loadRazorpayScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to load. please check are you online?");
      return;
    }
    //setProcess(true);
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    // creating a new order and sending order ID to backend
    const response = await axios.post(
      baseUrl + `user/razorpay_order`,
      {
        amount: global,
        channel: channel,
        payment_method: method,
        provider: walletOption,
        bankCode: bankCode,
        account_name: account_name,
        payment_gatway: razorpay,
      },
      { headers }
    );

    if (!response) {
      alert("Server error. please check are you onlin?");
      return;
    }

    //console.log(response.data.orderdata);
    // Getting the order details back
    let order_id = response.data.txnID;
    let order_token = response.data.orderdata.id;
    const data = response.data.orderdata;
    const options = {
      key: RazorPayKey,
      name: RazorPayAccountName,
      description: "Skill Based Game Tournament",
      order_id: data.id,
      prefill: {
        name: account_name,
        email: account_mail_id,
        contact: accountPhone,
      },
      handler: async (response) => {
        //console.log(response)
        try {
          const paymentId = response.razorpay_payment_id;

          //const url = baseUrl+`rozarpay/capture/${paymentId}`;
          //const captureResponse = await axios.post(url, {},{headers})
          //console.log(captureResponse.data);
          checkrazorpaydeposit(order_id, order_token, "SUCCESS", paymentId);
        } catch (err) {
          checkrazorpaydeposit(order_id, order_token, "FAILED");
          console.log(err);
        }
      },
      theme: {
        color: "#686CFD",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }

  const checkrazorpaydeposit = (
    order_id,
    order_token,
    order_status,
    paymentId
  ) => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    axios
      .post(
        baseUrl + `razorpaydesposit/response`,
        { order_id, order_token, order_status, paymentId },
        { headers }
      )
      .then((res) => {
        const icon = res.data.status === "PAID" ? "success" : "danger";
        const title =
          res.data.status === "PAID"
            ? "Deposit submited successfully"
            : "Transaction Failed";
        history.push("/landing");
        setTimeout(() => {
          Swal.fire({
            title: title,
            icon: icon,
            confirmButtonText: "OK",
          });
        }, 1000);
      })
      .catch((e) => {
        if (e.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("token");
          window.location.reload();
        }
      });
  };

  //use for decentrodepositeupi
  const decentroDepositeUpi = (channel, method, upiMethod, decentropay) => {
    //account_name
    //account_mail_id
    //alert(account_name);
    //if(account_name && account_mail_id){

    setProcess(true);
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    axios
      .post(
        baseUrl + `user/decentrodepositeupi`,
        {
          amount: global,
          channel: channel,
          payment_method: method,
          provider: walletOption,
          bankCode: bankCode,
          account_name: account_name,
          payment_gatway: decentropay,
        },
        { headers }
      )
      .then((res) => {
        console.log(res);
        if (res.data.data.status === "SUCCESS") {
          let order_id = res.data.txnID;
          let order_token = res.data.data.decentroTxnId;
          //setProcess(false);
          window.open(res.data.data.data.generatedLink);
          setTimeout(() => {
            //checkdecentrodeposit(order_id, order_token)
            setProcess(false);
          }, 30000);
        } else {
          setProcess(false);
          Swal.fire({
            title: res.data.data.msg,
            icon: "danger",
            confirmButtonText: "OK",
          });
        }
      })
      .catch((e) => {
        alert(e);
      });
    // }else{
    //   Swal.fire({
    //     title: 'Account holder name or Mail id is required',
    //     icon: 'danger',
    //     confirmButtonText: "OK",
    // });
    // }
  };

  //use for decentrodepositeupi
  const phonePeDepositeUpi = (channel, method, upiMethod, phonepay) => {
    //account_name
    //account_mail_id
    //alert(account_name);
    //if(account_name && account_mail_id){

    setProcess(true);
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    axios
      .post(
        baseUrl + `user/phonedepositeapi`,
        {
          amount: global,
          channel: channel,
          payment_method: method,
          provider: walletOption,
          bankCode: bankCode,
          account_name: account_name,
          payment_gatway: phonepay,
        },
        { headers }
      )
      .then((res) => {
        // console.log(res.data.data.data.instrumentResponse.redirectprimary.url);
        // console.log(res.data.data.data.transactionId);
        // console.log(res.data.txnID);
        if (res.data.data.success === true) {
          let order_id = res.data.txnID;
          let order_token = res.data.data.data.transactionId;
          //setProcess(false);
          window.open(
            res.data.data.data.instrumentResponse.redirectprimary.url
          );
          setTimeout(() => {
            checkphonepedeposit(order_id, order_token);
            //history.push('/');
            setProcess(false);
          }, 30000);
        } else {
          setProcess(false);
          Swal.fire({
            title: res.data.data.msg,
            icon: "danger",
            confirmButtonText: "OK",
          });
        }
      })
      .catch((e) => {
        alert(e);
      });
    // }else{
    //   Swal.fire({
    //     title: 'Account holder name or Mail id is required',
    //     icon: 'danger',
    //     confirmButtonText: "OK",
    // });
    // }
  };

  const checkphonepedeposit = (order_id, order_token) => {
    console.log(order_token);
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    axios
      .post(
        baseUrl + `phonepestatus/response`,
        { order_id, order_token },
        { headers }
      )
      .then((res) => {
        const icon = res.data.status === "PAID" ? "success" : "danger";
        const title =
          res.data.status === "PAID"
            ? "Deposit submited successfully"
            : "Transaction in failed";

        if (res.data.status == "Pending") {
          setTimeout(() => {
            checkphonepedeposit(order_id, order_token);
            Swal.fire({
              title: title,
              icon: icon,
              confirmButtonText: "OK",
            });
          }, 6000);
        } else {
          history.push("/");
          setTimeout(() => {
            Swal.fire({
              title: title,
              icon: icon,
              confirmButtonText: "OK",
            });
          }, 1000);
        }
      })
      .catch((e) => {
        if (e.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("token");
          window.location.reload();
        }
      });
  };

  const [isProcessing, setIsProcessing] = useState(false);

// UPI Gateway Deposit Function
const depositUpiGateway = (channel, method, upiMethod, upigateway) => {
  setProcess(true);
  const access_token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${access_token}`,
  };
  
  axios
    .post(
      baseUrl + `user/depositeupi`,
      {
        amount: global,
        channel: channel,
        payment_method: method,
        provider: walletOption,
        bankCode: bankCode,
        account_name: account_name,
        account_mail_id: account_mail_id,
        payment_gatway: upigateway,
      },
      { headers }
    )
    .then((res) => {
      if (res.data.payment_url) {
        let txnID = res.data.txnID;
        let payment_url = res.data.payment_url;

        // Open payment URL in new tab
        window.open(payment_url, '_blank');

        // Start checking payment status
        setTimeout(() => {
          checkUpiDepositStatus(txnID);
          setProcess(false);
        }, 30000);
      } else {
        setProcess(false);
        Swal.fire({
          title: res.data.error || "Payment initiation failed",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    })
    .catch((e) => {
      setProcess(false);
      Swal.fire({
        title: e.response?.data?.error || "Network Error",
        icon: "error",
        confirmButtonText: "OK",
      });
    });
};

// Check UPI Deposit Status
const checkUpiDepositStatus = (txnID) => {
  const access_token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${access_token}`,
  };
  
  axios
    .post(
      baseUrl + `checkout/deposite/txn`,
      { txnID: txnID },
      { headers }
    )
    .then((res) => {
      if (res.data.txnStatus === "PAID") {
        Swal.fire({
          title: "Deposit Successful!",
          text: "Your amount has been credited to your wallet",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          history.push("/landing");
          window.location.reload();
        });
      } else if (res.data.txnStatus === "FAILED") {
        Swal.fire({
          title: "Transaction Failed",
          text: res.data.msg || "Payment was not successful",
          icon: "error",
          confirmButtonText: "OK",
        });
      } else {
        // If still pending, check again after 30 seconds
        setTimeout(() => {
          checkUpiDepositStatus(txnID);
        }, 30000);
      }
    })
    .catch((e) => {
      if (e.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.reload();
      } else {
        Swal.fire({
          title: "Error checking status",
          text: "Please check your transaction history later",
          icon: "warning",
          confirmButtonText: "OK",
        });
      }
    });
};

  //use for cashfree gatway
  const deposit = (channel, method, upiMethod) => {
    setProcess(true);
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    axios
      .post(
        baseUrl + `user/deposite`,
        {
          amount: global,
          channel: channel,
          payment_method: method,
          provider: walletOption,
          bankCode: bankCode,
        },
        { headers }
      )
      .then((res) => {
        if (res.data.data.payment_method === "app") {
          window.location.href = res.data.data.data.url;
          checkInterval = setInterval(
            (ID) => {
              checkout(ID);
            },
            10000,
            res.data.txnID
          );
        } else if (res.data.data.payment_method === "netbanking") {
          window.location.href = res.data.data.data.url;
          checkInterval = setInterval(
            (ID) => {
              checkout(ID);
            },
            10000,
            res.data.txnID
          );
        } else if (
          res.data.data.channel === "link" &&
          res.data.data.payment_method === "upi"
        ) {
          checkInterval = setInterval(
            (ID) => {
              checkout(ID);
            },
            10000,
            res.data.txnID
          );
          window.location.href = res.data.data.data.payload[upiMethod];
        } else if (
          res.data.data.channel === "qrcode" &&
          res.data.data.payment_method === "upi"
        ) {
          setQrCode(res.data.data.data.payload.qrcode);
          setProcess(false);
          setNext(3);
          checkInterval = setInterval(
            (ID) => {
              checkout(ID);
            },
            10000,
            res.data.txnID
          );
        }
      })
      .catch((e) => {
        alert(e);
      });
  };

  const checkout = (paymentID) => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    axios
      .post(
        baseUrl + `checkout/deposite/txn`,
        { txnID: paymentID },
        { headers }
      )
      .then((res) => {
        // alert(res.data.txnStatus)
        if (res.data.txnStatus === "PAID") {
          walletUpdate();
          clearInterval(checkInterval);
          Swal.fire({
            title: res.data.msg,
            icon: "success",
            confirmButtonText: "OK",
          });
          setProcess(false);
          setNext(1);
        } else if (res.data.txnStatus === "FAILED") {
          walletUpdate();
          clearInterval(checkInterval);
          Swal.fire({
            title: res.data.msg,
            icon: "error",
            confirmButtonText: "OK",
          });
          setProcess(false);
          setNext(1);
        }
        // else if(res.data.txnStatus!="PENDING")
        // {
        //     clearInterval(checkInterval);
        //     Swal.fire({
        //       title: res.data.msg,
        //       icon: 'primary',
        //       confirmButtonText: "OK",
        //   });
        // }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    let access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    axios
      .get(baseUrl + `me`, { headers })
      .then((res) => {
        setUserAllData(res.data);
        setAccount_mail_id(res.data.Email);
        setAccount_name(res.data.holder_name);
        setAccountPhone(res.data.Phone);
      })
      .catch((e) => {
        if (e.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("token");
          window.location.reload();
          history.push("/login");
        }
      });

    axios
      .get(baseUrl + `website/setting`)
      .then((res) => {
        //console.log(res);
        setCashFreeActive(res.data.isCashFreeActive);
        setRazorPayActive(res.data.isRazorPayActive);
        setDecentroActive(res.data.isDecentroActive);
        setPhonePeActive(res.data.isPhonePeActive);
        setRazorPayKey(res.data.RazorPayKey);
        setAccountName(res.data.AccountName);
        setManualPaymentActive(res.data.isManualPaymentActive);
        setUpiGatewayActive(true);
        setManualUPIQR(res.data.isManualUPIQR);
      })
      .catch((e) => {
        setCashFreeActive(false);
        setRazorPayActive(false);
        setDecentroActive(false);
        setPhonePeActive(false);
        setRazorPayKey(false);
        setManualPaymentActive(false);
        setManualUPIQR(false);
        setUpiGatewayActive(false);
        setAccountName("Skill Based Gaming");
      });

    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      setMobile(true);
    }
  }, []);

  return (
    <>
      <Header user={userAllData} />
      {
        //userAllData && userAllData.verified === 'verified' &&
        <div
          className="leftContainer bg-white"
          style={{ minHeight: "100vh", height: "100%", paddingTop: "60px" }}
        >
          {Boolean(!process) && (
            <div>
              {Boolean(next === 1) && (
                <div className="px-4  py-5">
                  <div className={`${css.games_section}`}>
                    <div className="d-flex position-relative align-items-center">
                      <div className={`${css.games_section_title}`}>
                        Choose amount to add
                      </div>
                    </div>
                  </div>
                  <div className="pb-3">
                    <div className="MultiFormControl_root mt-4 MuiFormControl-fullWidth">
                      <div className="MuiFormControl_root MuiTextField-root">
                        <label
                          className={`${css.MuiFormLabel_root} MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink`}
                          data-shrink="true"
                          style={{ fontSize: "0.8rem", fontWeight: "400" }}
                        >
                          Enter Amount
                        </label>
                        <div className="MuiInputBase-root MuiInput-root MuiInput_underline jss58 MuiInputBase-formControl MuiInput-formControl MuiInputBase-adornedStart">
                          <div className="MuiInputAdornment-root MuiInputAdornment-positionStart d-flex w-100">
                            <div className="MuiInputAdornment-root MuiInputAdornment-positionStart d-flex align-items-center">
                              <p className="MuiTypography-root MuiTypography-body1 MuiTypography-colorTextSecondary mt-auto">
                                ₹
                              </p>
                            </div>
                            <input
                              className={`w3-input input ${css.collapseCard_title} border-bottom text-dark`}
                              type="tel"
                              id="amountInput"
                              style={{ width: "100%", fontSize: "2em" }}
                              value={`${global}`}
                              onChange={(e) => {
                                e.target.value > 0
                                  ? e.target.value <= 10000
                                    ? setGlobal(parseInt(e.target.value))
                                    : setGlobal(10000)
                                  : e.target.value < 0
                                  ? setGlobal(50)
                                  : setGlobal(0);
                              }}
                            ></input>
                          </div>
                        </div>
                        <p className="MuiFormHelperText-root">
50, Max: 10000
                        </p>
                      </div>
                    </div>
                    <div className={`${css.games_window}`}>
                      <div
                        className={`${css.gameCard_container}`}
                        onClick={() => {
                          // console.log(100);
                          setGlobal(100);
                        }}
                      >
                        <div className={`${css.add_fund_box}`}>
                          <div
                            style={{ display: "flex", alignItems: "baseline" }}
                          >
                            <div
                              className={`${css.collapseCard_title} mr-1`}
                              style={{ fontSize: "0.9em" }}
                            >
                              ₹
                            </div>
                            <div
                              className={`${css.collapseCard_title}`}
                              style={{ fontSize: "1.5em" }}
                            >
                              100
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className={`${css.gameCard_container}`}
                        onClick={() => {
                          // console.log(250);
                          setGlobal(250);
                        }}
                      >
                        <div className={`${css.add_fund_box}`}>
                          <div
                            style={{ display: "flex", alignItems: "baseline" }}
                          >
                            <div
                              className={`${css.collapseCard_title} mr-1`}
                              style={{ fontSize: "0.9em" }}
                            >
                              ₹
                            </div>
                            <div
                              className={`${css.collapseCard_title}`}
                              style={{ fontSize: "1.5em" }}
                            >
                              250
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className={`${css.gameCard_container}`}
                        onClick={() => {
                          // console.log(500);
                          setGlobal(500);
                        }}
                      >
                        <div className={`${css.add_fund_box}`}>
                          <div
                            style={{ display: "flex", alignItems: "baseline" }}
                          >
                            <div
                              className={`${css.collapseCard_title} mr-1`}
                              style={{ fontSize: "0.9em" }}
                            >
                              ₹
                            </div>
                            <div
                              className={`${css.collapseCard_title}`}
                              style={{ fontSize: "1.5em" }}
                            >
                              500
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className={`${css.gameCard_container}`}
                        onClick={() => {
                          // console.log(1000);
                          setGlobal(1000);
                        }}
                      >
                        <div className={`${css.add_fund_box}`}>
                          <div
                            style={{ display: "flex", alignItems: "baseline" }}
                          >
                            <div
                              className={`${css.collapseCard_title} mr-1`}
                              style={{ fontSize: "0.9em" }}
                            >
                              ₹
                            </div>
                            <div
                              className={`${css.collapseCard_title}`}
                              style={{ fontSize: "1.5em" }}
                            >
                              1000
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={`${css.refer_footer}`}>
                    <div className="d-grid gap-2 col-12 mx-auto">
                      <button
                        type="button"
                        className={`${css.block} bg-primary rounded text-white font-weight-bold text-uppercase`}
                        onClick={() => {
                          global >= 50
                            ? setNext(2)
                            : alert("Minimum deposit is 50");
                        }}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {Boolean(next === 2) && (
                <div className="px-4 py-3">
                  <div className="pb-3">
                    <div className={`${css.games_section}`}>
                      <div className="d-flex position-relative align-items-center justify-content-between">
                        <div
                          className={`${css.games_section_title}`}
                          style={{ fontSize: "1.1em" }}
                        >
                          Amount to be added ₹<span>{global}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setNext(1)}
                          className="btn btn-primary text-white font-weight-bold text-uppercase px-2 py-1"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      background: "rgb(241, 241, 241)",
                      width: "100%",
                      height: "10px",
                      position: "absolute",
                      left: "0",
                      right: "0",
                    }}
                  ></div>
                  <div className="d-flex flex-column mt-4">
                    <div className="games-section-title">Pay Through UPI</div>

                    {/* Boolean(isUpiGatewayActive) &&
              <div>
              <label htmlFor="username " className="mr-5">
                  <i className="far fa-bank mr-2"></i>Account holder name
                </label>
                <div className="col-12 mb-3 p-0">
                  <input
                    type="text"
                    className="form-control"
                    id="account_name"
                    placeholder="Enter Account Name"
                    name="acname"
                    value={account_name}
                    onChange={(e) => setAccount_name(e.target.value)}
                    required
                  />
                </div>

                <label htmlFor="username " className="mr-5">
                  <i className="far fa-bank mr-2"></i>Enter Your Mail ID
                </label>
                <div className="col-12 mb-3 p-0">
                  <input
                    type="text"
                    className="form-control"
                    id="account_mail_id"
                    placeholder="Enter Your Mail ID"
                    name="mailid"
                    value={account_mail_id}
                    onChange={(e) => setAccount_mail_id(e.target.value)}
                    required
                  />
                </div>
                  </div> */}

                    {Boolean(isUpiGatewayActive) && (
                      <div
                        onClick={() => {
                          method.current = "upipay";
                          depositUpiGateway(
                            "link",
                            "upi",
                            "upipay",
                            "upigateway"
                          );
                        }}
                        className="add-fund-box mt-3"
                        style={{ paddingTop: "0px", height: "60px" }}
                      >
                        <div
                          className="d-flex align-items-center"
                          style={{
                            backgroundColor: "#fafafa",
                            border: "1px solid #e0e0e0",
                            borderRadius: "7px",
                          }}
                        >
                          <div
                            className="d-flex align-items-center"
                            style={{
                              height: "60px",
                              display: "flex",
                              textAlign: "center",
                            }}
                          >
                            <img
                              width="40px"
                              src="UPI.png"
                              alt=""
                              style={{
                                marginLeft: "7px",
                                paddingBottom: "10px",
                                paddingLeft: "3px",
                                paddingTop: "5px",
                              }}
                            />
                          </div>
                          <div className="d-flex justify-content-center flex-column ml-4">
                            <div className="jss30">
                              <strong>Paynow Upi</strong>
                            </div>
                            <div className="jss31"></div>
                          </div>
                        </div>
              
                      </div>
                    )}
              
                  <br />
<div className="card mt-2" style={{border: '1px solid rgb(128, 128, 128)', width: '100%', margin: '0 auto', boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.5)', backgroundColor: '#ffffff'}}>
 
  <div className={`card-body ${css.cardBody}`} style={{ padding: "8px", fontSize: "11px", lineHeight: "1.3", color: "#333" }}>
    <p style={{ margin: "0 0 6px 0", fontSize: "11px" }}><strong>2,000 से ऊपर का amount ID में add करने के लिए, नीचे दिए गए UPI ID को copy करें और Paytm, PhonePe या GPay से payment करें।</strong></p>
    <div className={css.upiContainer} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#fff", padding: "8px", borderRadius: "6px", boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)", marginBottom: "8px" }}>
      <span style={{ fontSize: "11px", fontWeight: "bold" }}>ombk.aaev17465havrlcunww@mbk</span>
      <button onClick={handleCopy} className={css.copyButton} style={{ border: "none", backgroundColor: "#007BFF", color: "#fff", padding: "4px 10px", borderRadius: "4px", cursor: "pointer", fontSize: "10px", fontWeight: "bold" }}>Copy</button>
    </div>
    {isCopied && (<div style={{ marginTop: "8px", padding: "8px", backgroundColor: "#d4edda", color: "#155724", border: "1px solid #c3e6cb", borderRadius: "6px", textAlign: "center", fontSize: "11px", fontWeight: "bold", boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)" }}>UPI ID copied successfully!</div>)}
    <p style={{ margin: "6px 0", fontSize: "11px" }}>Payment करने के बाद, WhatsApp पर अपना payment screenshot और username भेजें। आपकी amount तुरंत ID में add कर दी जाएगी:</p>
    <a href="https://wa.me/9812609786" target="_blank" rel="noopener noreferrer" className={css.whatsappButton} style={{ display: "block", padding: "8px", backgroundColor: "#25D366", color: "#fff", borderRadius: "5px", textAlign: "center", textDecoration: "none", fontWeight: "bold", fontSize: "11px" }}>
      <span style={{ color: '#fff', fontWeight: 'bold' }}><b>Message on WhatsApp</b></span>
    </a>
  </div>
</div>

                    {Boolean(isRazorPayActive) && (
                      <div
                        onClick={() => {
                          method.current = "upipay";
                          displayRazorpayPaymentSdk(
                            "link",
                            "upi",
                            "upipay",
                            "razorpay"
                          );
                        }}
                        className="add-fund-box mt-3"
                        style={{ paddingTop: "0px", height: "60px" }}
                      >
                        <div
                          className="d-flex align-items-center"
                          style={{
                            backgroundColor: "#fafafa",
                            border: "1px solid #e0e0e0",
                            borderRadius: "7px",
                          }}
                        >
                          <div
                            className="d-flex align-items-center"
                            style={{
                              height: "60px",
                              display: "flex",
                              textAlign: "center",
                            }}
                          >
                            <img
                              width="40px"
                              src="UPI.png"
                              alt=""
                              style={{
                                marginLeft: "7px",
                                paddingBottom: "10px",
                                paddingLeft: "3px",
                                paddingTop: "5px",
                              }}
                            />
                          </div>
                          <div className="d-flex justify-content-center flex-column ml-4">
                            <div className="jss30">
                              <strong>Deposit Here</strong>
                            </div>
                            <div className="jss31"></div>
                          </div>
                        </div>
                      </div>
                    )}

                    {Boolean(isPhonePeActive) && (
                      <div
                        onClick={() => {
                          method.current = "upipay";
                          phonePeDepositeUpi(
                            "link",
                            "upi",
                            "upipay",
                            "Phonepe"
                          );
                        }}
                        className="add-fund-box mt-3"
                        style={{ paddingTop: "0px", height: "60px" }}
                      >
                        <div
                          className="d-flex align-items-center"
                          style={{
                            backgroundColor: "#fafafa",
                            border: "1px solid #e0e0e0",
                            borderRadius: "7px",
                          }}
                        >
                          <div
                            className="d-flex align-items-center"
                            style={{
                              height: "60px",
                              display: "flex",
                              textAlign: "center",
                            }}
                          >
                            <img
                              width="40px"
                              src="UPI.png"
                              alt=""
                              style={{
                                marginLeft: "7px",
                                paddingBottom: "10px",
                                paddingLeft: "3px",
                                paddingTop: "5px",
                              }}
                            />
                          </div>
                          <div className="d-flex justify-content-center flex-column ml-4">
                            <div className="jss30">
                              <strong>Deposit PhonePe</strong>
                            </div>
                            <div className="jss31"></div>
                          </div>
                        </div>
                      </div>
                    )}

                    {Boolean(isDecentroActive) && (
                      <div
                        onClick={() => {
                          method.current = "upipay";
                          decentroDepositeUpi(
                            "link",
                            "upi",
                            "upipay",
                            "decentropay"
                          );
                        }}
                        className="add-fund-box mt-3"
                        style={{ paddingTop: "0px", height: "60px" }}
                      >
                        <div
                          className="d-flex align-items-center"
                          style={{
                            backgroundColor: "#fafafa",
                            border: "1px solid #e0e0e0",
                            borderRadius: "7px",
                          }}
                        >
                          <div
                            className="d-flex align-items-center"
                            style={{
                              height: "60px",
                              display: "flex",
                              textAlign: "center",
                            }}
                          >
                            <img
                              width="40px"
                              src="UPI.png"
                              alt=""
                              style={{
                                marginLeft: "7px",
                                paddingBottom: "10px",
                                paddingLeft: "3px",
                                paddingTop: "5px",
                              }}
                            />
                          </div>
                          <div className="d-flex justify-content-center flex-column ml-4 mb-5">
                            <div className="jss30">
                              <strong>Desposit Now</strong>
                            </div>
                            <div className="jss31"></div>
                          </div>
                        </div>
                      </div>
                    )}

                    {Boolean(isManualPaymentActive) && (
                      <div className="m-2">
                        <img
                          src={baseUrl + isManualUPIQR}
                          style={{ width: "100%" }}
                          alt="img"
                        />
                      </div>
                    )}
                    {Boolean(isManualPaymentActive) && (
                      <form
                        onSubmit={ManualPayment}
                        method="POST"
                        encType="multipart/form-data"
                      >
                        <label htmlFor="username " className="mr-5">
                          <i className="far fa-bank mr-2"></i>Enter UTR Number
                        </label>
                        <div className="col-12 mb-3 p-0">
                          <input
                            type="text"
                            className="form-control"
                            id="referenceId"
                            placeholder="Enter UTR Number"
                            name="referenceId"
                            value={upiUtrNum}
                            onChange={(e) => setupiUtrNum(e.target.value)}
                            required
                          />
                        </div>

                        <div
                          className="add-fund-box mt-3"
                          style={{ paddingTop: "0px", height: "60px" }}
                        >
                          <div
                            className="d-flex align-items-center"
                            style={{
                              backgroundColor: "#fafafa",
                              border: "1px solid #e0e0e0",
                              borderRadius: "7px",
                            }}
                          >
                            <div
                              className="d-flex align-items-center"
                              style={{ textAlign: "center" }}
                            >
                              <img
                                width="40px"
                                src="UPI.png"
                                alt=""
                                style={{
                                  marginLeft: "7px",
                                  paddingBottom: "10px",
                                  paddingLeft: "3px",
                                  paddingTop: "5px",
                                }}
                              />
                            </div>
                            <div className="d-flex justify-content-center flex-column ml-4">
                              <div className="jss30">
                                <strong>Upload Screenshot</strong>
                              </div>
                              <div className="jss31">
                                <input
                                  type="file"
                                  name="Screenshot"
                                  onChange={handleChange}
                                  accept="image/*"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className=" m-2 text-center">
                          <button type="submit" className="btn btn-success">
                            Submit
                          </button>
                        </div>

                        <div style={{ width: "100%", height: "400px" }}>
                          <img src={scrnshot1} style={{ width: "100%" }} />
                        </div>
                      </form>
                    )}

                    {Boolean(isMobile) && Boolean(isCashFreeActive) && (
                      <div>
                        <div
                          onClick={() => {
                            method.current = "gpay";
                            deposit("link", "upi", "gpay");
                          }}
                          className="add-fund-box mt-3"
                          style={{ paddingTop: "0px", height: "60px" }}
                        >
                          <div
                            className="d-flex align-items-center"
                            style={{
                              backgroundColor: "#fafafa",
                              border: "1px solid #e0e0e0",
                              borderRadius: "7px",
                            }}
                          >
                            <div
                              className="d-flex align-items-center"
                              style={{
                                height: "60px",
                                display: "flex",
                                textAlign: "center",
                              }}
                            >
                              <img
                                width="40px"
                                src="gpay-logo.png"
                                alt=""
                                style={{
                                  marginLeft: "7px",
                                  paddingBottom: "10px",
                                  paddingLeft: "3px",
                                  paddingTop: "5px",
                                }}
                              />
                            </div>
                            <div className="d-flex justify-content-center flex-column ml-4">
                              <div className="jss30">
                                <strong>G-Pay</strong>
                              </div>
                              <div className="jss31"></div>
                            </div>
                          </div>
                        </div>

                        <div
                          onClick={() => {
                            method.current = "phonepe";
                            deposit("link", "upi", "phonepe");
                          }}
                          className="add-fund-box mt-3"
                          style={{ paddingTop: "0px", height: "60px" }}
                        >
                          <div
                            className="d-flex align-items-center"
                            style={{
                              backgroundColor: "#fafafa",
                              border: "1px solid #e0e0e0",
                              borderRadius: "7px",
                            }}
                          >
                            <div
                              className="d-flex align-items-center"
                              style={{
                                height: "60px",
                                display: "flex",
                                textAlign: "center",
                              }}
                            >
                              <img
                                width="40px"
                                src="/phonepe-logo.png"
                                alt=""
                                style={{
                                  marginLeft: "7px",
                                  paddingBottom: "10px",
                                  paddingLeft: "3px",
                                  paddingTop: "5px",
                                }}
                              />
                            </div>
                            <div className="d-flex justify-content-center flex-column ml-4">
                              <div className="jss30">
                                <strong>PhonePe</strong>
                              </div>
                              <div className="jss31"></div>
                            </div>
                          </div>
                        </div>
                        <div
                          onClick={() => {
                            method.current = "paytm";
                            deposit("link", "upi", "paytm");
                          }}
                          className="add-fund-box mt-3"
                          style={{ paddingTop: "0px", height: "60px" }}
                        >
                          <div
                            className="d-flex align-items-center"
                            style={{
                              backgroundColor: "#fafafa",
                              border: "1px solid #e0e0e0",
                              borderRadius: "7px",
                            }}
                          >
                            <div
                              className="d-flex align-items-center"
                              style={{
                                height: "60px",
                                display: "flex",
                                textAlign: "center",
                              }}
                            >
                              <img
                                width="40px"
                                src="/paytm-logo.png"
                                alt=""
                                style={{
                                  marginLeft: "7px",
                                  paddingBottom: "10px",
                                  paddingLeft: "3px",
                                  paddingTop: "5px",
                                }}
                              />
                            </div>
                            <div className="d-flex justify-content-center flex-column ml-4">
                              <div className="jss30">
                                <strong>Paytm UPI</strong>
                              </div>
                              <div className="jss31"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {Boolean(!isMobile) && Boolean(isCashFreeActive) && (
                      <div
                        className="add-fund-box mt-3"
                        onClick={() => {
                          deposit("qrcode", "upi");
                        }}
                        style={{ paddingTop: "0px", height: "60px" }}
                      >
                        <div
                          className="d-flex align-items-center"
                          style={{
                            backgroundColor: "#fafafa",
                            border: "1px solid #e0e0e0",
                            borderRadius: "7px",
                          }}
                        >
                          <div
                            className="d-flex align-items-center"
                            style={{ height: "60px" }}
                          >
                            <img
                              width="45px"
                              src="/qr-scan.png"
                              alt=""
                              style={{
                                marginLeft: "7px",
                                paddingLeft: "3px",
                              }}
                            />
                          </div>
                          <div className="d-flex justify-content-center flex-column ml-4">
                            <div className="jss30">
                              <strong>Scan QR Code</strong>
                            </div>
                            <div className="jss31"></div>
                          </div>
                        </div>
                      </div>
                    )}
                    {Boolean(isCashFreeActive) && (
                      <div className="games-section-title mt-3">
                        Other Options
                      </div>
                    )}

                    {Boolean(isCashFreeActive) && (
                      <div
                        className="add-fund-box mt-3"
                        onClick={() => {
                          setNext(4);
                        }}
                        style={{ paddingTop: "0px", height: "60px" }}
                      >
                        <div
                          className="d-flex align-items-center"
                          style={{
                            backgroundColor: "#fafafa",
                            border: "1px solid #e0e0e0",
                            borderRadius: "7px",
                          }}
                        >
                          <div
                            className="d-flex align-items-center"
                            style={{ height: "60px" }}
                          >
                            <img
                              width="45px"
                              src="all-wallets.png"
                              alt=""
                              style={{
                                marginLeft: "7px",
                                paddingBottom: "10px",
                                paddingLeft: "3px",
                                paddingTop: "5px",
                              }}
                            />
                          </div>
                          <div className="d-flex justify-content-center flex-column ml-4">
                            <div className="jss30">
                              <strong>Other Wallets</strong>
                            </div>
                            <div className="jss31"></div>
                          </div>
                        </div>
                      </div>
                    )}
                    {Boolean(isCashFreeActive) && (
                      <div
                        className="add-fund-box mt-3"
                        onClick={() => {
                          setNext(5);
                        }}
                        style={{ paddingTop: "0px", height: "60px" }}
                      >
                        <div
                          className="d-flex align-items-center"
                          style={{
                            backgroundColor: "#fafafa",
                            border: "1px solid #e0e0e0",
                            borderRadius: "7px",
                          }}
                        >
                          <div
                            className="d-flex align-items-center"
                            style={{ height: "60px" }}
                          >
                            <img
                              width="45px"
                              src="/bank1.png"
                              alt=""
                              style={{
                                marginLeft: "7px",
                                paddingBottom: "10px",
                                paddingLeft: "3px",
                                paddingTop: "5px",
                              }}
                            />
                          </div>
                          <div className="d-flex justify-content-center flex-column ml-4">
                            <div className="jss30">
                              <strong>Net Banking</strong>
                            </div>
                            <div className="jss31"></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          {Boolean(next === 3) && (
            <div className="d-flex justify-content-center align-items-center mt-5">
              <img src={qrCode} alt="img" />
            </div>
          )}
          {Boolean(next === 4) && (
            <div className="px-4 py-3">
              <div className="pb-3">
                <div className={`${css.games_section}`}>
                  <div className="d-flex position-relative align-items-center justify-content-between">
                    <div
                      className={`${css.games_section_title}`}
                      style={{ fontSize: "1.1em" }}
                    >
                      Amount to be added ₹<span>{global}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNext(1)}
                      className="btn btn-primary text-white font-weight-bold text-uppercase px-2 py-1"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
              <div
                style={{
                  background: "rgb(241, 241, 241)",
                  width: "100%",
                  height: "10px",
                  position: "absolute",
                  left: "0",
                  right: "0",
                }}
              ></div>
              <div className="d-flex flex-column mt-4">
                <div className="games-section-title">Pay Through</div>
                <div
                  className="add-fund-box mt-3"
                  style={{ paddingTop: "0px", height: "60px" }}
                >
                  <div
                    className="d-flex align-items-center"
                    style={{
                      backgroundColor: "#fafafa",
                      border: "1px solid #e0e0e0",
                      borderRadius: "7px",
                    }}
                  >
                    <div
                      className="d-flex align-items-center"
                      style={{ height: "60px" }}
                    >
                      <img
                        width="45px"
                        src="all-wallets.png"
                        alt=""
                        style={{
                          marginLeft: "7px",
                          paddingLeft: "3px",
                        }}
                      />
                    </div>
                    <div className="d-flex justify-content-center flex-column ml-4">
                      <div className="jss30">
                        <strong>Other Wallets</strong>
                      </div>
                      <div className="jss31"></div>
                    </div>
                    <div className="d-flex justify-content-center ml-auto mr-3">
                      <button
                        type="button"
                        onClick={() => setNext(2)}
                        className="btn btn-primary text-white font-weight-bold text-uppercase px-2 py-1"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <select
                className="form-control mt-4"
                style={{
                  border: "1px solid rgb(224, 224, 224)",
                  outline: "none",
                  borderRadius: "5px",
                  background: "rgb(250, 250, 250)",
                  height: "3rem",
                }}
                onChange={(e) => {
                  setWalletOption(e.target.value);
                }}
              >
                <option value="airtel">Airtel Money</option>
                <option value="freecharge">Freecharge</option>
                <option value="mobikwik">Mobikwik</option>
                <option value="ola">Ola Money</option>
                <option value="jio">Reliance Jio Money</option>
              </select>
              <div className={`${css.refer_footer}`}>
                <div className="d-grid gap-2 col-12 mx-auto">
                  <button
                    type="button"
                    className={`${css.block} bg-primary rounded text-white font-weight-bold text-uppercase`}
                    onClick={() => {
                      deposit("link", "app");
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}
          {Boolean(next === 5) && (
            <div className="px-4 py-3">
              <div className="pb-3">
                <div className={`${css.games_section}`}>
                  <div className="d-flex position-relative align-items-center justify-content-between">
                    <div
                      className={`${css.games_section_title}`}
                      style={{ fontSize: "1.1em" }}
                    >
                      Amount to be added ₹<span>{global}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNext(1)}
                      className="btn btn-primary text-white font-weight-bold text-uppercase px-2 py-1"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
              <div
                style={{
                  background: "rgb(241, 241, 241)",
                  width: "100%",
                  height: "10px",
                  position: "absolute",
                  left: "0",
                  right: "0",
                }}
              ></div>
              <div className="d-flex flex-column mt-4">
                <div className="games-section-title">Pay Through</div>
                <div
                  className="add-fund-box mt-3"
                  style={{ paddingTop: "0px", height: "60px" }}
                >
                  <div
                    className="d-flex align-items-center"
                    style={{
                      backgroundColor: "#fafafa",
                      border: "1px solid #e0e0e0",
                      borderRadius: "7px",
                    }}
                  >
                    <div
                      className="d-flex align-items-center"
                      style={{ height: "60px" }}
                    >
                      <img
                        width="45px"
                        src="/bank1.png"
                        alt=""
                        style={{
                          marginLeft: "7px",
                          paddingLeft: "3px",
                        }}
                      />
                    </div>
                    <div className="d-flex justify-content-center flex-column ml-4">
                      <div className="jss30">
                        <strong>Net Banking</strong>
                      </div>
                      <div className="jss31"></div>
                    </div>
                    <div className="d-flex justify-content-center ml-auto mr-3">
                      <button
                        type="button"
                        onClick={() => setNext(2)}
                        className="btn btn-primary text-white font-weight-bold text-uppercase px-2 py-1"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <select
                className="form-control mt-4"
                style={{
                  border: "1px solid rgb(224, 224, 224)",
                  outline: "none",
                  borderRadius: "5px",
                  background: "rgb(250, 250, 250)",
                  height: "3rem",
                }}
                onChange={(e) => {
                  setBankCode(e.target.value);
                }}
              >
                <option value="3003">Axis Bank</option>
                <option value="3005">Bank of Baroda - Retail Banking</option>
                <option value="3006">Bank of India</option>
                <option value="3007">Bank of Maharashtra</option>
                <option value="3009">Canara Bank</option>
                <option value="3010">Catholic Syrian Bank</option>
                <option value="3011">Central Bank of India</option>
                <option value="3012">City Union Bank</option>
                <option value="3016">Deutsche Bank</option>
                <option value="3017">DBS Bank Ltd</option>
                <option value="3018">DCB Bank - Personal</option>
                <option value="3019">Dhanlakshmi Bank</option>
                <option value="3020">Federal Bank</option>
                <option value="3021">HDFC Bank</option>
                <option value="3022">ICICI Bank</option>
                <option value="3023">IDBI Bank</option>
                <option value="3024">IDFC FIRST Bank</option>
                <option value="3026">Indian Bank</option>
                <option value="3027">Indian Overseas Bank</option>
                <option value="3028">IndusInd Bank</option>
                <option value="3029">Jammu and Kashmir Bank</option>
                <option value="3030">Karnataka Bank Ltd</option>
                <option value="3031">Karur Vysya Bank</option>
                <option value="3032">Kotak Mahindra Bank</option>
                <option value="3033">
                  Laxmi Vilas Bank - Retail Net Banking
                </option>
                <option value="3037">Punjab & Sind Bank</option>
                <option value="3038">
                  Punjab National Bank - Retail Net Banking
                </option>
                <option value="3039">RBL Bank</option>
                <option value="3040">Saraswat Bank</option>
                <option value="3042">South Indian Bank</option>
                <option value="3043">Standard Chartered Bank</option>
                <option value="3044">State Bank Of India</option>
                <option value="3052">Tamilnad Mercantile Bank Ltd</option>
                <option value="3054">UCO Bank</option>
                <option value="3055">Union Bank of India</option>
                <option value="3058">Yes Bank Ltd</option>
                <option value="3060">Bank of Baroda - Corporate</option>
                <option value="3061">Bank of India - Corporate</option>
                <option value="3062">DCB Bank - Corporate</option>
                <option value="3064">Lakshmi Vilas Bank - Corporate</option>
                <option value="3065">Punjab National Bank - Corporate</option>
                <option value="3066">State Bank of India - Corporate</option>
                <option value="3067">Union Bank of India - Corporate</option>
                <option value="3071">Axis Bank Corporate</option>
                <option value="3072">Dhanlaxmi Bank Corporate</option>
                <option value="3073">ICICI Corporate Netbanking</option>
                <option value="3074">Ratnakar Corporate Banking</option>
                <option value="3075">Shamrao Vithal Bank Corporate</option>
                <option value="3076">Equitas Small Finance Bank</option>
                <option value="3077">Yes Bank Corporate</option>
                <option value="3079">Bandhan Bank- Corporate banking</option>
                <option value="3080">
                  Barclays Corporate- Corporate Banking - Corporate
                </option>
                <option value="3081">Indian Overseas Bank Corporate</option>
                <option value="3083">City Union Bank of Corporate</option>
                <option value="3084">HDFC Corporate</option>
                <option value="3086">Shivalik Bank</option>
                <option value="3087">AU Small Finance</option>
                <option value="3088">Bandhan Bank - Retail Net Banking</option>
                <option value="3041">Shamrao Vitthal Co-operative Bank</option>
                <option value="3051">Tamil Nadu State Co-operative Bank</option>
                <option value="3089">Utkarsh Small Finance Bank</option>
                <option value="3090">
                  The Surat People’s Co-operative Bank Limited
                </option>
                <option value="3091">
                  Gujarat State Co-operative Bank Limited
                </option>
                <option value="3092">HSBC Retail Netbanking</option>
                <option value="3102">Jana Small Finance Bank</option>
              </select>
              <div className={`${css.refer_footer}`}>
                <div className="d-grid gap-2 col-12 mx-auto">
                  <button
                    type="button"
                    className={`${css.block} bg-primary rounded text-white font-weight-bold text-uppercase`}
                    onClick={() => {
                      deposit("link", "netbanking");
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}
          {Boolean(process) && (
            <div className="loaderReturn" style={{ zIndex: "99" }}>
              <img
                src={"https://Haryanaludo.com/Images/LandingPage_img/old-loader1.gif"}
                style={{ width: "100%" }}
                alt="img"
              />
            </div>
          )}
        </div>
      }
      {/* <div className="leftContainer" style={{ minHeight: '100vh', height: '100%' }}>

        <div className="container px-3 mt-5 py-5" style={{ height: "10px" }}>
          <div className="row">

            <div className="col mx-auto">
              <div className="card text-center mt-3">

                {userAllData && userAllData.verified === 'unverified' && <div style={{ height: "100px" }}>
                  <Link to='/Kyc2'>

                    <picture className="ml-3">
                      <img src="/images/alert.svg" alt="" width="32px" className="mt-4" />
                    </picture>
                    <div className="ml-1 mt-2 mytext text-muted ">
                      Complete KYC to Deposit Amount
                    </div>
                  </Link>
                </div>}
                {userAllData && userAllData.verified === 'pending' && <div style={{ height: "100px" }}>
                  <picture className="ml-3">
                    <img src="/images/alert.svg" alt="" width="32px" className="mt-4" />
                  </picture>
                  <div className="ml-1 mt-2 mytext text-muted ">
                    Please wait your kyc under process
                  </div>
                </div>}

              </div>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
};
export default Addcase;
