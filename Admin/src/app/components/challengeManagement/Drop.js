import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const $ = require("jquery");
$.Datatable = require("datatables.net");

export default function Drop() {
  const beckendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
  const beckendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  const nodeMode = process.env.NODE_ENV;
  let baseUrl;

  if (nodeMode === "development") {
    baseUrl = beckendLocalApiUrl;
  } else {
    baseUrl = beckendLiveApiUrl;
  }

  const [challenge, setChallenge] = useState([]);
  const [markedForDeletion, setMarkedForDeletion] = useState([]);
  const [deletingProgress, setDeletingProgress] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const Allchallenge = async () => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    try {
      const response = await axios.get(baseUrl + `challange/drop_challange`, { headers });
      setChallenge(response.data);
      $("table").dataTable();
    } catch (error) {
      console.error("Error fetching challenges:", error);
    }
  };

  const CancelGame = async (id) => {
    const confirmDelete = window.confirm("Are you sure to delete?");
    if (confirmDelete) {
      const access_token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${access_token}`,
      };

      try {
        await axios.delete(baseUrl + `dropedchallange/delete/${id}`, { headers });
        Allchallenge();
      } catch (error) {
        console.error("Error deleting challenge:", error);
      }
    } else {
      window.alert("Sorry, try again.");
    }
  };

  const handleMarkForDeletion = (id) => {
    const markedList = [...markedForDeletion];

    if (markedList.includes(id)) {
      const index = markedList.indexOf(id);
      markedList.splice(index, 1);
    } else {
      markedList.push(id);
    }

    setMarkedForDeletion(markedList);
  };

  const deleteMarkedEntries = async () => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    setIsDeleting(true);

    // Loop through markedForDeletion array and delete each entry
    for (let i = 0; i < markedForDeletion.length; i++) {
      try {
        await axios.delete(baseUrl + `dropedchallange/delete/${markedForDeletion[i]}`, { headers });
        // Update the progress
        setDeletingProgress(((i + 1) / markedForDeletion.length) * 100);
      } catch (error) {
        console.error("Error deleting marked challenge:", error);
      }
    }

    // Refresh the challenge list
    Allchallenge();

    // Clear markedForDeletion array and reset progress
    setMarkedForDeletion([]);
    setDeletingProgress(0);
    setIsDeleting(false);
  };

  const dateFormat = (e) => {
    const date = new Date(e);
    const newDate = date.toLocaleString("default", {
      month: "long",
      day: "numeric",
      hour: "numeric",
      hour12: true,
      minute: "numeric",
    });
    return newDate;
  };

  useEffect(() => {
    Allchallenge();
  }, []);

  if (!challenge || challenge.length === 0) {
    return null;
  }

  return (
    <>
      <div className="row">
        <div className="col-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">DROP CHALLENGES</h4>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>
                        <input
                          type="checkbox"
                          id="selectAll"
                          onChange={() => {
                            const checkboxes = document.querySelectorAll('.checkbox');
                            checkboxes.forEach((checkbox) => {
                              checkbox.checked = document.getElementById('selectAll').checked;
                            });
                            setMarkedForDeletion(document.getElementById('selectAll').checked ? challenge.map((game) => game._id) : []);
                          }}
                        />
                      </th>
                      <th>#</th>
                      <th>ID</th>
                      <th>Creator</th>
                      <th>Accepter</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Game Type</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {challenge.map((game, key) => (
                      <tr key={key}>
                        <td>
                          <input
                            type="checkbox"
                            className="checkbox"
                            onChange={() => handleMarkForDeletion(game._id)}
                            checked={markedForDeletion.includes(game._id)}
                          />
                        </td>
                        <td>{key + 1}</td>
                        <td>{game._id}</td>
                        <td>
                          <span className="pl-2">
                            {game.Created_by?.Name || null}
                          </span>
                        </td>
                        <td>
                          <span className="pl-2">
                            {game.Accepetd_By ? game.Accepetd_By?.Name : null}
                          </span>
                        </td>
                        <td>{game.Game_Ammount}</td>
                        <td className="text-primary font-weight-bold">
                          {game.Status}
                        </td>
                        <td>{game.Game_type}</td>
                        <td>{dateFormat(game.createdAt).split(",")[0]}</td>
                        <td>
                          {game.Created_by && game.Accepetd_By ? (
                            <Link
                              type="button"
                              className="btn btn-primary mx-1"
                              to={`/view/${game._id}`}
                            >
                              View
                            </Link>
                          ) : (
                            ""
                          )}
                          {game.Status === "drop" && (
                            <button
                              type="button"
                              className="btn mx-1 btn-danger"
                              onClick={() => CancelGame(game._id)}
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div>
                <button
                  type="button"
                  className="btn btn-danger mx-1"
                  onClick={deleteMarkedEntries}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete Marked"}
                </button>
                {isDeleting && (
                  <div className="progress mt-3">
                    <div
                      className="progress-bar progress-bar-striped progress-bar-animated"
                      role="progressbar"
                      style={{ width: `${deletingProgress}%` }}
                      aria-valuenow={deletingProgress}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      {Math.round(deletingProgress)}%
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}