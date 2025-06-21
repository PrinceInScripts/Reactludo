import React, { useState, useEffect } from "react";
import css from "../css/gamehis.module.css";
import ReactPaginate from "react-paginate";
import axios from "axios";
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Transactionhistory = () => {
  const backendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
  const backendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  const nodeMode = process.env.NODE_ENV;
  const baseUrl = nodeMode === "development" ? backendLocalApiUrl : backendLiveApiUrl;

  const [user, setUser] = useState();
  const limit = 50;
  const [pageNumber, setPageNumber] = useState(0);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [cardData, setCardData] = useState([]);
  const [showWithdrawalHistory, setShowWithdrawalHistory] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    role();
    // eslint-disable-next-line
  }, [pageNumber, limit, showWithdrawalHistory]);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const role = async () => {
    setLoading(true);
    const access_token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${access_token}` };

    try {
      const res = await axios.get(`${baseUrl}me`, { headers });
      setUser(res.data);
      if (showWithdrawalHistory) {
        fetchWithdrawalHistory(res.data._id);
      } else {
        fetchDepositHistory(res.data._id);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchDepositHistory = async (id) => {
    setLoading(true);
    const access_token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${access_token}` };

    try {
      const res = await axios.get(`${baseUrl}temp/deposite/${id}?page=${pageNumber}&_limit=${limit}`, { headers });
      setCardData(res.data.ress);
      setNumberOfPages(res.data.totalPages);
    } finally {
      setLoading(false);
    }
  };

  const fetchWithdrawalHistory = async (id) => {
    setLoading(true);
    const access_token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${access_token}` };

    try {
      const res = await axios.get(`${baseUrl}temp/withdrawal/${id}?page=${pageNumber}&_limit=${limit}`, { headers });
      setCardData(res.data.ress);
      setNumberOfPages(res.data.totalPages);
    } finally {
      setLoading(false);
    }
  };

  const handlePageClick = (data) => {
    setPageNumber(data.selected + 1);
  };

  const toggleHistoryType = () => {
    setShowWithdrawalHistory(!showWithdrawalHistory);
  };

  const dateFormat = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("default", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      hour12: true,
      minute: "numeric",
    });
  };

  const handleCopy = (counterid) => {
    navigator.clipboard.writeText(counterid).then(() => {
      setCopied(true);
    });
  };

  const renderTransactionCards = () => {
    return cardData.map((card) => {
      // Hide DEPOSIT with status FAILED or PENDING
      if (card.Req_type === "deposit" && (card.status === "FAILED" || card.status === "Pending")) {
        return null;
      }

      const id = card._id.toString();
      const timestamp = id.slice(8, 16);
      const counterid = parseInt(timestamp, 16);
      let titleMsg = "";
      if (card.Req_type === "deposit" && card.status !== "FAILED" && card.status !== "Pending") {
        titleMsg = "DEPOSIT";
      } else if (card.Req_type === "withdraw" && card.status === "Processing") {
        titleMsg = "PROCESSING";
      } else if (card.Req_type === "withdraw" && card.status !== "FAILED") {
        titleMsg = `WITHDRAW `;
      } else if (card.Req_type === "penalty" && card.status !== "FAILED") {
        titleMsg = "Penalty";
      } else if (card.Req_type === "bonus" && card.status !== "FAILED") {
        titleMsg = "Bonus";
      } else if (card.status === "Pending" || card.status === "FAILED") {
        titleMsg = "FAILED";
      }

      const getTitleStyle = (titleMsg) => {
        const baseStyle = {
            borderWidth: '2px',
            borderRadius: '2px',
            color: 'white',
        };

        switch (titleMsg) {
          case 'DEPOSIT':
          case 'Bonus':
            return { ...baseStyle, borderColor: '#4CAF50', color: '#ffffff', backgroundColor: '#4CAF50' };
          case 'WITHDRAW':
            return { ...baseStyle, borderColor: '#FF9800', color: '#ffffff', backgroundColor: '#FF9800' };
          case 'PROCESSING':
            return { ...baseStyle, borderColor: '#2196F3', color: '#ffffff', backgroundColor: '#2196F3' };
          case 'FAILED':
          case 'Penalty':
            return { ...baseStyle, borderColor: '#F44336', color: '#ffffff', backgroundColor: '#F44336' };
          default:
            return { ...baseStyle, borderColor: '#9E9E9E', color: '#ffffff', backgroundColor: '#9E9E9E' };
        }
      };

      return (
        <div key={card._id} className={`w-100 mt-2 py-3 d-flex align-items-center ${css.list_item}`} style={{ border: "1px solid #ccc", borderRadius: "5px", margin: "1px", padding: "1px" }}>
          <div className={`${css.list_date} mx-2`} style={{ borderRight: '1px solid #ddd', padding: '0 1px', fontSize: '0.7em' }}>
            <b style={getTitleStyle(titleMsg)}>
              {titleMsg}
            </b>
            <div style={{ fontSize: '0.85em' }}>
              {dateFormat(card.createdAt).split(',')[0]}
              {dateFormat(card.createdAt).split(',')[1]}
            </div>
          </div>

          <div className={`mx-0 d-flex ${css.list_body}`}>
            <div className="d-flex flex-column font-8">
              <div className={`${css.games_section_headline}`} style={{ fontWeight: '500', fontSize: '0.75em', color: 'black' }}>
                Status: {card.status === "Pending" ? "Processing" : card.status}
                &nbsp; {card.txn_msg ? card.txn_msg : ""}
                <div style={{ fontSize: '0.95em', color: 'grey', display: 'flex', alignItems: 'center' }}>
                  <span>UTR ID: {counterid}</span>
                  <svg
                    onClick={() => handleCopy(counterid)}
                    style={{ cursor: 'pointer', marginLeft: '8px' }}
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#000000"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                  </svg>
                  {copied && <span style={{ marginLeft: '8px', color: 'green' }}>UTR Copied!</span>}
                </div>
              </div>
            </div>
          </div>
          <div className="right-10 d-flex align-items-end pr-2 flex-column">
            <div className="d-flex float-right font-8">
              {["FAILED", "Withdraw Success", "DEPOSIT"].includes(card.status) && (
                <picture className="ml-1 mb-1">
                  <img
                    height="13px"
                    width="13px"
                    src={card.status === "Withdraw" ? "https://i.postimg.cc/R0j1NZNQ/Minusicon.png" : card.status === "DEPOSIT" ? "https://i.postimg.cc/rmFVG8B7/Plusicon.png" : "https://i.postimg.cc/bJRMFBJs/images-7.png"}
                    alt={card.status}
                  />
                </picture>
              )}
              <picture className="ml-1 mb-1">
                <img height="17px" width="17px" src="https://i.postimg.cc/XJXR7Q1S/global-rupee-Icon.webp" alt="" />
              </picture>
              <span className="pl-1" style={{ color: card.status === "FAILED" ? 'red' : 'initial', fontSize: '0.9em', padding: '0.2em' }}>
                <b>{card.amount}</b>
              </span>
            </div>
            {card.closing_balance && (
              <div className={`${css.games_section_headline}`} style={{ fontSize: '0.6em', whiteSpace: 'nowrap' }}>
                Closing balance: {card.closing_balance.toFixed(0)}
              </div>
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="leftContainer" style={{ minHeight: "100vh", height: "100%" }}>
      <div className="pt-5 mb-3"></div>
      <div className="card mt-2 p-3 bg-light">
        <div className="d-flex justify-content-between">
          <Link to="/Gamehistory" className={css.Link}>
            <span className="font-9" style={{ fontWeight: '500', color: 'black' }}>Game</span>
          </Link>
          <Link to="/transaction-history" className={css.Linked}>
            <span className="font-9" style={{ fontWeight: '500', color: 'white' }}>Payments</span>
          </Link>
          <Link to="/Referral-history" className={css.Link}>
            <span className="font-9" style={{ fontWeight: '500', color: 'black' }}>Referral</span>
          </Link>
        </div>
      </div>

      <>
        {renderTransactionCards()}
        {cardData.length === 0 && (
          <div className="text-center">
            <img src="https://i.postimg.cc/C10n1q2W/Add-a-heading-1-min.png" alt="no data" width={365} height={365} className="img-fluid" style={{ marginTop: '25%', border: '0px solid #ddd', borderRadius: '8px', padding: '20px' }} />
            <div className="mt-2"></div>
          </div>
        )}
      </>
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
        theme="light"
      />
      <div className='mt-4'>
        <div className="card border small-card">
          <br />
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            breakLabel={"..."}
            pageCount={numberOfPages}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={handlePageClick}
            containerClassName={"pagination justify-content-center"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            previousClassName={"page-item"}
            previousLinkClassName={"page-link"}
            nextClassName={"page-item"}
            nextLinkClassName={"page-link"}
            breakClassName={"page-item"}
            breakLinkClassName={"page-link"}
            activeClassName={"active"}
          />
        </div>
      </div>
    </div> 
  );
};

export default Transactionhistory;