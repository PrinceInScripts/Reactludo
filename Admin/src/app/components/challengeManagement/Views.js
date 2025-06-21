import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, Link } from 'react-router-dom';
import "../transaction/imageview.css";
import css from '../../../assets/styles/view.module.css';

const Views = () => {
  const location = useLocation();
  const path = location.pathname.split("/")[2];
  const [game, setGame] = useState(null);
  const [mount, setMount] = useState(false);
  const [bonus, setBonus] = useState(25);
  const [penaltyMessage, setPenaltyMessage] = useState('Penalty by Admin');

  const beckendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
  const beckendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  const nodeMode = process.env.NODE_ENV;
  const baseUrl = nodeMode === "development" ? beckendLocalApiUrl : beckendLiveApiUrl;

  const getAllChallenge = () => {
    const access_token = localStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${access_token}`
    };

    axios.get(`${baseUrl}challange/${path}`, { headers })
      .then((res) => {
        setGame(res.data);
        imageViewer();
      })
      .catch((e) => {
        alert(e);
      });
  };

  const dateFormat = (e) => {
    const date = new Date(e);
    return date.toLocaleString('default', {
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      hour12: true,
      minute: 'numeric'
    });
  };

  const winnAmount = (gameAmount) => {
    let profit = 0;
    if (gameAmount >= 50 && gameAmount <= 250)
      profit = gameAmount * 10 / 100;
    else if (gameAmount > 250 && gameAmount <= 500)
      profit = 25;
    else if (gameAmount > 500)
      profit = gameAmount * 5 / 100;
    return gameAmount - profit;
  };

  const cancelGame = async () => {
    const confirm = window.confirm("Are you sure to cancel?");
    if (confirm) {
      const access_token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${access_token}`
      };

      axios.patch(`${baseUrl}challange/Cancel/admin/${path}`,
        { Cancelled_by: access_token },
        { headers }
      )
        .then(() => {
          getAllChallenge();
        });
    }
  };

  const updateAdmin = async (id) => {
    const confirm = window.confirm("Are you sure to update?");
    if (confirm) {
      const access_token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${access_token}`
      };

      axios.post(`${baseUrl}challange/admin/result/${path}`, {
        winner: id,
        Status_Update_By: access_token
      }, { headers })
        .then(() => {
          getAllChallenge();
        });
    }
  };

  const updatePenalty = (id) => {
    const confirm = window.confirm("Are you sure you want to add penalty to this user?");
    if (confirm) {
      const access_token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${access_token}`
      };

      axios.post(`${baseUrl}user/penlaty/${id}`, {
        bonus: bonus,
        message: penaltyMessage
      }, { headers })
        .then((res) => {
          if (res.data.status === 0) {
            alert('User wallet balance already low.');
          } else {
            alert('Penalty successfully added.');
          }
          getAllChallenge();
        })
        .catch(error => {
          alert('Error adding penalty: ' + error.message);
        });
    }
  };

  const imageViewer = () => {
    const imgs = document.getElementsByClassName("img");
    const out = document.getElementsByClassName("img-out")[0];

    for (let i = 0; i < imgs.length; i++) {
      if (!imgs[i].classList.contains("el")) {
        imgs[i].classList.add("el");

        imgs[i].addEventListener("click", () => {
          const container = document.getElementsByClassName("img-panel")[i];
          container.classList.toggle("img-panel__selct");

          const imgElement = document.createElement("img");
          const imgWrapper = document.createElement("div");
          const imgClose = document.createElement("div");

          container.classList.add("img-panel__selct");
          imgElement.setAttribute("class", "image__selected");
          imgElement.src = imgs[i].getAttribute("src") || "";
          imgWrapper.setAttribute("class", "img-wrapper");
          imgClose.setAttribute("class", "img-close");
          imgWrapper.appendChild(imgElement);
          imgWrapper.appendChild(imgClose);

          setTimeout(() => {
            imgWrapper.classList.add("img-wrapper__initial");
            imgElement.classList.add("img-selected-initial");
          }, 50);

          out.appendChild(imgWrapper);
          imgClose.addEventListener("click", () => {
            container.classList.remove("img-panel__selct");
            out.removeChild(imgWrapper);
          });
        });
      }
    }
  };

  useEffect(() => {
    getAllChallenge();
    // eslint-disable-next-line
  }, []);

  if (!game) {
    return null;
  }

  const getGameBgImage = () => {
    switch (game.Game_type) {
      case "Ludo Classics": return 'url(/ludoclassic.jpg)';
      case "Ludo Ulta": return 'url(/ludoultra.jpg)';
      case "Ludo Popular": return 'url(/ludopopular.jpg)';
      case "Ludo 1 Goti": return 'url(/ludonocut.jpg)';
      default: return 'url(/wp3731787.jpg)';
    }
  };

  const currentTime = Date.now();
  const gameCreatedAt = new Date(game.createdAt).getTime();

  const creatorIP = game.Creator_IP;
  const acceptorIP = game.Acceptor_IP;
  const isSameIP = creatorIP && acceptorIP && (creatorIP === acceptorIP);

  return (
    mount ? (
      <div style={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        zIndex: "9999",
        backgroundColor: "rgb(255, 255, 255)"
      }}>
        <img
          src={'https://rkludo.in/Images/LandingPage_img/loader1.gif'}
          style={{ width: "150px", height: "80px" }}
          alt="Loading..."
        />
      </div>
    ) : (
      <div>
        <div className="img-out"></div>
        <div className="content d-flex flex-column flex-column-fluid" id="kt_content">
          <div className="d-flex flex-column-fluid">
            <div className="container-fluid">
              <div className={css.row}>
                <div className="col-xl-12">
                  <div
                    className={`${css.card} ${css.card_custom} ${css.bgi_no_repeat} ${css.gutter_b}`}
                    style={{
                      minHeight: '250px',
                      backgroundColor: '#1B283F',
                      backgroundPosition: 'center',
                      backgroundSize: 'cover',
                      backgroundImage: getGameBgImage()
                    }}
                  >
                    <div className={css.card_body} style={{ background: 'rgba(0,0,0,0.5)' }}>
                      <div className='row'>
                        <h3 className={`text-white ${css.font_weight_bolder}`}>Match Details</h3>
                        {game.Status !== "cancelled" && game.Status !== "completed" && game.Status !== "pending" && game.Status !== "running" && (
                          <button onClick={cancelGame} className="btn btn-danger ml-auto rounded-pill">
                            Cancel Match
                          </button>
                        )}

                        {(game.Created_by._id === game.Accepetd_By?._id && (game.Status !== "cancelled" && game.Status !== "completed")) && (
                          <button onClick={cancelGame} className="btn btn-danger ml-auto rounded-pill">
                            Force Cancel Match
                          </button>
                        )}

                        {(game.Status !== "cancelled" && game.Status !== "completed" && (parseInt(gameCreatedAt.toString()) + 7200000) < currentTime) && (
                          <button onClick={cancelGame} className="btn btn-danger ml-auto rounded-pill">
                            Force Cancel Match, Time Limit Exceeded
                          </button>
                        )}
                      </div>

                      <p className={`${css.text_muted} ${css.font_size_lg} mt-5 mb-10`}>
                        Check participants data, and announced result.
                      </p>

                      <div className="row">
                        <div className="col-lg-2" style={{ borderRight: '1px solid #fff' }}>
                          <h4 className={`text-white ${css.font_weight_bolder}`}>
                            Match Fee: {game.Game_Ammount}
                          </h4>
                        </div>
                        <div className="col-lg-2" style={{ borderRight: '1px solid #fff' }}>
                          <h4 className={`text-white ${css.font_weight_bolder}`}>
                            Prize: {game.Game_Ammount + winnAmount(game.Game_Ammount)}
                          </h4>
                        </div>
                        <div className="col-lg-2" style={{ borderRight: '1px solid #fff' }}>
                          <h4 className={`text-white ${css.font_weight_bolder}`}>
                            Type: {(game.Game_type === "Ludo 1 Goti") ? "Ludo No Cut" : game.Game_type}
                          </h4>
                        </div>
                        <div className="col-lg-2">
                          <h4 className={`text-white ${css.font_weight_bolder}`}>
                            Status: <span className={`${css.label} ${css.label_primary} ${css.font_weight_bolder} ${css.label_pill} ${css.label_inline} bg-white text-dark py-3`} style={{ fontSize: '1.2rem' }}>
                              {game.Status}
                            </span>
                          </h4>
                        </div>
                        <div className="col-lg-2">
                          <h4 className={`text-white ${css.font_weight_bolder}`}>
                            Room Code: <span style={{ color: '#f4bc41' }}>{game.Room_code}</span>
                          </h4>
                        </div>
                        <div className="col-lg-2">
                          <h6 className={`text-white ${css.font_weight_bolder}`}>
                            Last Updated By:
                            <span style={{ color: '#f4bc41' }}>{game.action_by ? game.action_by.Name : "N/A"}</span>
                            (<span style={{ color: '#f4bc41' }}>{game.actionby_Date ? dateFormat(game.actionby_Date).split(',')[0] : "N/A"}</span>)
                          </h6>
                        </div>
                      </div>
                      <div className="row mt-2">
                        <div className="col-12">
                          <div
                            style={{
                              backgroundColor: 'white',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              display: 'inline-block',
                              fontSize: '0.75rem',
                              fontWeight: 500,
                              color: isSameIP ? 'red' : 'green',
                              boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
                              marginTop: '4px'
                            }}
                          >
                            {isSameIP ? (
                              <>
                                Both same IP — <strong style={{ fontWeight: 600 }}>FRAUD decuted WARNING</strong>
                              </>
                            ) : (
                              "2 different IP"
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={css.row}>
                <div className="col-lg-6">
                  <div className={`${css.card} ${css.card_custom} ${css.card_stretch} ${css.gutter_b}`}>
                    <div className={`${css.card_body} d-flex p-0`}>
                      <div className={`${css.flex_grow_1} ${css.p_12} ${css.card_rounded} ${css.bgi_no_repeat} d-flex flex-column justify-content-center align-items-start`}
                        style={{
                          backgroundColor: '#FFF4DE',
                          backgroundPosition: 'right bottom',
                          backgroundSize: '20% auto',
                          backgroundImage: 'url(/custom-8.svg)'
                        }}
                      >
                        <h2 className={`${css.font_weight_bolder} mb-4`}>Creator</h2>
                        <ul>
                          <li>
                            User Name: <Link to={`/user/view_user/${game.Created_by._id}`} className={`btn ${css.btn_success} ${css.font_weight_bold} ${css.py_2} ${css.px_6} mr-2`}>
                              {game.Created_by.Name}
                            </Link>
                          </li>
                          <li>
                            IP Address:{" "}
                            <span style={{
                              color: isSameIP ? 'red' : 'green',
                              fontWeight: isSameIP ? 'bold' : undefined
                            }}>
                              {game.Creator_IP || 'N/A'}
                            </span>
                          </li>
                          <li>Hold balance: {game.Created_by.hold_balance}</li>
                          <li>Created Time: {dateFormat(game.createdAt).split(',')[0]}</li>
                          <li>
                            Participant Status:
                            {game.Creator_Status && (
                              <span className={`${css.label} ${game.Creator_Status === "winn" ? css.label_success : css.label_danger} ${css.font_weight_bolder} ${css.label_pill} ${css.label_inline} ml-2`}>
                                {game.Creator_Status}
                              </span>
                            )}
                          </li>
                          {game.Creator_Status_Updated_at && (
                            <li>Status Updated At: {dateFormat(game.Creator_Status_Updated_at).split(',')[0]}</li>
                          )}
                          {game.Creator_Status_Reason && (
                            <li>Cancel Reason: {game.Creator_Status_Reason}</li>
                          )}
                          <br />
                          <div className='img-panel'>
                            {game.Creator_Screenshot && (
                              <img
                                alt='Creator Screenshot'
                                src={`${baseUrl}${game.Creator_Screenshot}`}
                                className="img-responsive img w-auto"
                                height={200}
                              />
                            )}
                          </div>
                        </ul>
                        {(game.Status === "pending" || game.Status === "conflict") && (
                          <div className="form-group">
                            <button className={`btn ${css.btn_success} ${css.font_weight_bold} ${css.py_2} ${css.px_6} mr-2`} onClick={() => updateAdmin(game.Created_by._id)}>
                              Win
                            </button>
                            <button className={`btn btn-danger ${css.font_weight_bold} ${css.py_2} ${css.px_6} mr-2`} onClick={() => game.Accepetd_By && updateAdmin(game.Accepetd_By._id)}>
                              Lose
                            </button>
                            <div>
                              <h5 className='mt-4'>Add Penalty</h5>
                              <input
                                type="number"
                                className="form-control input-sm mb-2"
                                style={{ minWidth: '100px' }}
                                placeholder="Penalty Amount"
                                onChange={(e) => setBonus(Number(e.target.value))}
                                value={bonus}
                              />
                              <textarea
                                className="form-control mb-2"
                                rows={2}
                                placeholder="Penalty reason (optional)"
                                value={penaltyMessage}
                                onChange={(e) => setPenaltyMessage(e.target.value)}
                              />
                              <button className="btn btn-sm btn-primary" onClick={() => updatePenalty(game.Created_by._id)}>
                                Add Penalty
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {game.Accepetd_By && (
                  <div className="col-lg-6">
                    <div className={`card ${css.card_custom} ${css.card_stretch} ${css.gutter_b}`}>
                      <div className={`${css.card_body} d-flex p-0`}>
                        <div className={`${css.flex_grow_1} ${css.p_12} ${css.card_rounded} ${css.bgi_no_repeat} d-flex flex-column justify-content-center align-items-start`}
                          style={{
                            backgroundColor: '#FFF4DE',
                            backgroundPosition: 'right bottom',
                            backgroundSize: '20% auto',
                            backgroundImage: 'url(/custom-8.svg)'
                          }}
                        >
                          <h2 className={`${css.font_weight_bolder} mb-4`}>Acceptor</h2>
                          <ul>
                            <li>
                              User Name: <Link to={`/user/view_user/${game.Accepetd_By._id}`} className={`btn ${css.btn_success} ${css.font_weight_bold} ${css.py_2} ${css.px_6} mr-2`}>
                                {game.Accepetd_By.Name}
                              </Link>
                            </li>
                            <li>
                              IP Address:{" "}
                              <span style={{
                                color: isSameIP ? 'red' : 'green',
                                fontWeight: isSameIP ? 'bold' : undefined
                              }}>
                                {game.Acceptor_IP || 'N/A'}
                              </span>
                            </li>
                            <li>Hold balance: {game.Accepetd_By.hold_balance}</li>
                            <li>Join Time: {dateFormat(game.Acceptor_by_Creator_at).split(',')[0]}</li>
                            <li>
                              Participant Status:
                              {game.Acceptor_status && (
                                <span className={`${css.label} ${game.Acceptor_status === "winn" ? css.label_success : css.label_danger} ${css.font_weight_bolder} ${css.label_pill} ${css.label_inline} ml-2`}>
                                  {game.Acceptor_status}
                                </span>
                              )}
                            </li>
                            {game.Acceptor_status_reason && (
                              <li>Cancel Reason: {game.Acceptor_status_reason}</li>
                            )}
                            {game.Acceptor_status_Updated_at && (
                              <li>Status Updated At: {dateFormat(game.Acceptor_status_Updated_at).split(',')[0]}</li>
                            )}
                            <br />
                            <div className='img-panel'>
                              {game.Acceptor_screenshot && (
                                <img
                                  alt='Acceptor Screenshot'
                                  src={`${baseUrl}${game.Acceptor_screenshot}`}
                                  className="img-responsive img w-auto"
                                  height={200}
                                />
                              )}
                            </div>
                          </ul>
                          {(game.Status === "pending" || game.Status === "conflict") && (
                            <div className="form-group">
                              <button className={`btn ${css.btn_success} ${css.font_weight_bold} ${css.py_2} ${css.px_6} mr-2`} onClick={() => updateAdmin(game.Accepetd_By._id)}>
                                Win
                              </button>
                              <button className={`btn btn-danger ${css.font_weight_bold} ${css.py_2} ${css.px_6} mr-2`} onClick={() => updateAdmin(game.Created_by._id)}>
                                Lose
                              </button>
                              <div>
                                <h5 className='mt-4'>Add Penalty</h5>
                                <input
                                  type="number"
                                  className="form-control input-sm mb-2"
                                  style={{ minWidth: '100px' }}
                                  placeholder="Penalty Amount"
                                  onChange={(e) => setBonus(Number(e.target.value))}
                                  value={bonus}
                                />
                                <textarea
                                  className="form-control mb-2"
                                  rows={2}
                                  placeholder="Penalty reason (optional)"
                                  value={penaltyMessage}
                                  onChange={(e) => setPenaltyMessage(e.target.value)}
                                />
                                <button className="btn btn-sm btn-primary" onClick={() => updatePenalty(game.Accepetd_By._id)}>
                                  Add Penalty
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default Views;