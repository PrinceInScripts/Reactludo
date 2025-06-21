import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import * as XLSX from "xlsx";
import DatePicker from "react-multi-date-picker";
import { DateObject } from "react-multi-date-picker";
import "./Dashboard.css";

function Earings() {
  const beckendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
  const beckendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  const nodeMode = process.env.NODE_ENV;
  const baseUrl = nodeMode === "development" ? beckendLocalApiUrl : beckendLiveApiUrl;

  const [limit, setLimit] = useState(10);
  const [pageNumber, setPageNumber] = useState(0);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [EARING, setEARING] = useState([]);
  const [TOTELEARING, setTOTELEARING] = useState(0);
  const [monthlyEarnings, setMonthlyEarnings] = useState({});
  const [values, setValues] = useState([
    new DateObject().subtract(4, "days"),
    new DateObject().add(4, "days"),
  ]);

  const setpageLimit = (event) => {
    setLimit(event.target.value);
  };

  const handlePageClick = async (data) => {
    let currentPage = data.selected + 1;
    setPageNumber(currentPage);
  };

  const calculateMonthlyEarnings = (earnings) => {
    const monthlyData = {};
    earnings.forEach((item) => {
      const date = new Date(item.createdAt);
      const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = 0;
      }
      monthlyData[monthYear] += parseFloat(item.Ammount);
    });
    setMonthlyEarnings(monthlyData);
  };

  useEffect(() => {
    const access_token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${access_token}` };

    axios
      .get(
        `${baseUrl}admin/Earning?page=${pageNumber}&_limit=${limit}&FROM_DATE=${values[0]}&TO_DATE=${values[1]}`,
        { headers }
      )
      .then((res) => {
        setEARING(res.data.admin);
        setNumberOfPages(res.data.totalPages);
        calculateMonthlyEarnings(res.data.admin);
      });

    axios.get(`${baseUrl}admin/Earning/total`, { headers }).then((res) => {
      setTOTELEARING(parseFloat(res.data.total).toFixed(0));
    });
  }, [pageNumber, limit, values]);

  const createDownloadData = () => {
    handleExport();
  };

  const handleExport = () => {
    let table1 = [
      {
        A: "id",
        B: "Amount",
      },
    ];

    EARING.forEach((row) => {
      table1.push({
        A: `Earn From Challenge ${row.Earned_Form} on ${row.createdAt}`,
        B: row.Ammount,
      });
    });

    const ws = XLSX.utils.json_to_sheet(table1, { skipHeader: true });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
    XLSX.writeFile(wb, "AdminEarning.xlsx");
  };

  return (
<div className="earnings-page">
  <div className="header-section">
    <h3 className="earnings-title">
      <span>💰</span>Total Earnings: <span className="total-amount">₹{TOTELEARING}</span>
    </h3>

    <select
      className="form-control select-limit"
      id="pagelimit"
      name="pagelimit"
      onChange={setpageLimit}
    >
      <option value="10">Set Limit</option>
      <option value="20">20</option>
      <option value="50">50</option>
      <option value="100">100</option>
      <option value="500">500</option>
    </select>
  </div>

  <button onClick={createDownloadData} className="btn export-btn">
    Export Data
  </button>

  <DatePicker value={values} onChange={setValues} range className="date-picker" />

  <div className="monthly-earnings">
    <h4>Monthly Earnings</h4>
    <ul>
      {Object.entries(monthlyEarnings).map(([monthYear, amount], index) => (
        <li key={index}>
          {monthYear}: <span className="amount-green">₹{amount.toFixed(2)}</span>
        </li>
      ))}
    </ul>
  </div>

  <div className="card-container">
    {EARING &&
      EARING.map((earning, index) => (
        <div className="earning-card" key={index}>
          <h5>#{index + 1}</h5>
          <p>
            Earned From <strong>{earning.Earned_Form}</strong> on{" "}
            {new Date(earning.createdAt).toLocaleDateString()}
          </p>
          <p>
            <span>Amount:</span> <span className="amount-green">₹{earning.Ammount}</span>
          </p>
        </div>
      ))}
  </div>

  <ReactPaginate
    previousLabel={"Previous"}
    nextLabel={"Next"}
    breakLabel={"..."}
    pageCount={numberOfPages}
    marginPagesDisplayed={2}
    pageRangeDisplayed={3}
    onPageChange={handlePageClick}
    containerClassName={"pagination"}
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
  );
}

export default Earings; 