import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./imageview.css";
const $ = require("jquery")
$.Datatable = require("datatables.net");

const Deposits = () => {

  const [user, setUser] = useState();
  const backendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
  const backendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  const nodeMode = process.env.NODE_ENV;
  let baseUrl = nodeMode === "development" ? backendLocalApiUrl : backendLiveApiUrl;

  const profle = () => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`
    };
    axios.get(baseUrl + `temp/deposit/pending`, { headers })
      .then((res) => {
        setUser(res.data);
        console.log("Data fetched: ", res.data); // Debugging log
        $('table').dataTable();
        imageViewer();
      }).catch((error) => {
        console.error("Error fetching data: ", error); // Debugging log
      });
  }

  const update = async (id) => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`
    };
    axios.patch(baseUrl + `temp/deposite/${id}`,
      {
        status: "success"
      },
      { headers })
      .then((res) => {
        console.log("Update response: ", res.data); // Debugging log
        profle();
      }).catch((e) => {
        console.error("Error updating data: ", e); // Debugging log
      });
  }

  const cancelledData = async (id) => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`
    };
    axios.delete(baseUrl + `temp/deposit/delete/${id}`,
      { headers })
      .then((res) => {
        console.log("Delete response: ", res.data); // Debugging log
        profle();
      }).catch((e) => {
        console.error("Error deleting data: ", e); // Debugging log
      });
  }

  function imageViewer() {
    let imgs = document.getElementsByClassName("img"),
      out = document.getElementsByClassName("img-out")[0];
    for (let i = 0; i < imgs.length; i++) {

      if (!imgs[i].classList.contains("el")) {
        imgs[i].classList.add("el");
        imgs[i].addEventListener("click", lightImage);
        function lightImage() {
          let container = document.getElementsByClassName("img-panel")[i];
          container.classList.toggle("img-panel__selct");
        };

        imgs[i].addEventListener("click", openImage);
        function openImage() {
          let imgElement = document.createElement("img"),
            imgWrapper = document.createElement("div"),
            imgClose = document.createElement("div"),
            container = document.getElementsByClassName("img-panel")[i];
          container.classList.add("img-panel__selct");
          imgElement.setAttribute("class", "image__selected");
          imgElement.src = imgs[i].src;
          imgWrapper.setAttribute("class", "img-wrapper");
          imgClose.setAttribute("class", "img-close");
          imgWrapper.appendChild(imgElement);
          imgWrapper.appendChild(imgClose);

          setTimeout(
            function () {
              imgWrapper.classList.add("img-wrapper__initial");
              imgElement.classList.add("img-selected-initial");
            }, 50);

          out.appendChild(imgWrapper);
          imgClose.addEventListener("click", function () {
            container.classList.remove("img-panel__selct");
            out.removeChild(imgWrapper);
          });
        }
      }
    }
  }

  useEffect(() => {
    profle();
  }, []);

  if (!user) {
    return null;
  }

  return (
    <div className="row">
      <div className="col-12 grid-margin">
        <div className="card">
          <div className="card-body">
            <div className="img-out"></div>
            <h4 className="card-title">Deposit Request</h4>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Amount</th>
                    <th>Screenshot</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {user && user.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      <td>{item._id}</td>
                      <td>{item.user.Name}</td>
                      <td>{item.amount}</td>
                      <td>
                        <div className="img-panel">
                          <img className="img" src={baseUrl + `${item.front}`} style={{
                            borderRadius: '5px',
                            width: '4rem',
                            height: '4rem',
                          }}
                            id={`ss${index}`}
                          />
                        </div>
                      </td>
                      <td>
                        {item.status === "pending" && <button className="btn btn-primary mr-2" onClick={() => update(item._id)}>Approve</button>}
                        {item.status === "success" && <button className="btn btn-success mr-2">Success</button>}
                        {item.status === "pending" && <button className="btn btn-danger mr-2" onClick={() => cancelledData(item._id)}>Delete</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deposits;