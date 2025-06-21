import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import "./Dashboard.css";

export default function Conflictgame() {
  const [challenge, setChallenge] = useState([]);
  const beckendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
  const beckendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  const nodeMode = process.env.NODE_ENV;
  const baseUrl =
    nodeMode === "development" ? beckendLocalApiUrl : beckendLiveApiUrl;

  let limit = 10;
  const [pageNumber, setPageNumber] = useState(0);
  const [numberOfPages, setNumberOfPages] = useState(0);

  const handlePageClick = async (data) => {
    let currentPage = data.selected + 1;
    setPageNumber(currentPage);
  };

  const AllChallenge = async () => {
    const access_token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${access_token}` };
    try {
      const res = await axios.get(
        `${baseUrl}admin/challange/dashboard/all?page=${pageNumber}&_limit=${limit}`,
        { headers }
      );
      setChallenge(res.data.status);
      setNumberOfPages(res.data.totalPages);
    } catch (err) {
      console.error("Error fetching challenges", err);
    }
  };

  const dateFormat = (e) => {
    const date = new Date(e);
    return date.toLocaleString("default", {
      month: "long",
      day: "numeric",
      hour: "numeric",
      hour12: true,
      minute: "numeric",
    });
  };

  useEffect(() => {
    AllChallenge();
  }, [pageNumber, limit]);

  if (!challenge) {
    return null;
  }

  const getStatusClass = (status) => {
    switch (status) {
      case "New":
        return "status-new";
      case "Running":
        return "status-running";
      case "Conflict":
        return "status-conflict";
      case "Requested":
        return "status-requested";
      case "Pending":
        return "status-pending";
      default:
        return "status-default";
    }
  };

  return (
    <div className="row">
      <div className="col-12 grid-margin">
        <div className="card custom-card">
          <div className="card-body">
            <h4 className="card-title">Games</h4>
            <div className="table-responsive">
              <table className="table custom-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Room Code</th>
                    <th>Creator</th>
                    <th>Acceptor</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Game Type</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {challenge &&
                    challenge.map((game, key) => (
                      <tr key={game._id}>
                        <td>{key + 1}</td>
                        <td>
                          {game.Room_code === 0 ? (
                            <span className="status-waiting">Waiting</span>
                          ) : (
                            <span className="status-green">
                              {game.Room_code}
                            </span>
                          )}
                        </td>
                        <td>
                          <span className="pl-2">{game.Created_by.Name}</span>
                        </td>
                        <td>
                          <span className="pl-2">
                            {game.Accepetd_By
                              ? game.Accepetd_By.Name
                              : null}
                          </span>
                        </td>
                        <td>
                          <span className="amount-green">
                            ₹{game.Game_Ammount}
                          </span>
                        </td>
                        <td className={getStatusClass(game.Status)}>
                          {game.Status}
                        </td>
                        <td>{game.Game_type}</td>
                        <td>{dateFormat(game.createdAt).split(",")[0]}</td>
                        <td>
                          <Link
                            type="button"
                            className="btn btn-primary mx-1"
                            to={`/view/${game._id}`}
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4">
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
      </div>
    </div>
  );
} 