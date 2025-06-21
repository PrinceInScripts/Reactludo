import React, { useEffect, useState, useRef } from 'react'
import '../css/viewGame1.css'
import "../css/layout.css"
import axios from 'axios';
import { useHistory, useLocation } from 'react-router-dom';
import Header from '../Components/Header';
import css from '../css/Pan.module.css'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/Loader.css';
import { NavLink } from 'react-router-dom';

export default function ViewGame1(props) {
  const history = useHistory()
  const beckendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
  const beckendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  const nodeMode = process.env.NODE_ENV;
  const baseUrl = nodeMode == "development" ? beckendLocalApiUrl : beckendLiveApiUrl;

  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const path = location.pathname.split("/")[2];

  const [Game, setGame] = useState(null)
  const [status, setStatus] = useState(null);
  const [fecthStatus, setFecthStatus] = useState(null)
  const [scrnshot, setScrnshot] = useState(null)
  const [scrnshot1, setScrnshot1] = useState("")
  const [reason, setReason] = useState(null)
  const [socket, setSocket] = useState(null)
  const [roomcode, setRoomcode] = useState('')
  const [apiResponse, setApiResponse] = useState(null)
  let submitReq = useRef(false);
  const isMounted = useRef(true);
  const [submitProcess, setProcess] = useState(true);
  const [toastShown, setToastShown] = useState(false);

  // User state
  const [user, setUser] = useState(null);
  const [userAllData, setUserAllData] = useState(null);
  const [ALL, setALL] = useState(null)

  // API response handler
  const handleApiResponse = (response) => {
    setApiResponse(response);
    
    if (response.roomCodeStatus === 'Room code found and updated') {
      toast.success("Classic room code updated successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
      });
    } else if (response.message === "Invalid room code format") {
      toast.error("Room code must be an 8-digit number", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
      });
    } else if (response.message === "Unsupported room type") {
      const roomType = response.details?.split("'")[1] || 'unknown';
      toast.error(`Only classic rooms are allowed (Found: ${roomType})`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
      });
    } else if (response.message === "Invalid room code") {
      toast.error("The room code doesn't exist or couldn't be processed", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
      });
    } else if (response.message === "Validation service unavailable") {
      toast.error("Could not validate room code. Please try again later", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
      });
    } else if (response.message === "Unauthorized action") {
      toast.error("You can't set room code for this game", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
      });
    }
  }

  // Set room code API call
  const getPost = async () => {
    const access_token = localStorage.getItem("token")
    const headers = { Authorization: `Bearer ${access_token}` }
    
    try {
      const res = await axios.patch(baseUrl+`challange/roomcode/${path}`, {
        Room_code: roomcode
      }, { headers });
      
      setGame(res.data);
      handleApiResponse(res.data);
      
      if (socket) {
        socket.emit('challengeOngoing');
      }
    } catch (e) {
      if (e.response?.status == 401) {
        localStorage.removeItem('token');
        window.location.reload()
        history.push("/login")
      } else {
        handleApiResponse({
          success: false,
          message: "Failed to set room code",
          details: e.response?.data?.message || "Please try again"
        });
      }
    }
  }

  // Get user data
  const role = async () => {
    const access_token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${access_token}` };

    try {
      const res = await axios.get(baseUrl+`me`, { headers });
      setUser(res.data._id);
      setUserAllData(res.data);
      Allgames(res.data._id);
      getCode(res.data._id);
    } catch (e) {
      if (e.response?.status == 401) {
        localStorage.removeItem('token');
        window.location.reload(); 
        history.push("/login");
      }
    }
  };

  // Get game data
  const Allgames = async (userId) => {
    const access_token = localStorage.getItem('token')
    const headers = { Authorization: `Bearer ${access_token}` }

    try {
      const res = await axios.get(baseUrl+`challange/${path}`, { headers });
      
      if (res.data.Status == "new" || res.data.Status == "requested") {
        setTimeout(async() => {
          try {
            const retryRes = await axios.get(baseUrl+`challange/${path}`, { headers });
            if (retryRes.data.Status == "new" || retryRes.data.Status == "requested") {
              history.push(props.location.state.prevPath);
            } else {
              setProcess(false);
            }
          } catch (error) {
            console.error(error);
            history.push(props.location.state.prevPath);
          }
        }, 10000);
      } else {
        setProcess(false)
      }
      
      setALL(res.data)
      setGame(res.data)
      
      if (userId == res.data.Accepetd_By?._id) {
        setFecthStatus(res.data.Acceptor_status)
      }

      if (userId == res.data.Created_by?._id) {
        setFecthStatus(res.data.Creator_Status)
      }
    } catch (e) {
      if (e.response?.status == 401) {
        localStorage.removeItem('token');
        window.location.reload()
        history.push("/login")
      }
    }
  }

  // Poll for room code
  const getCode = async (userId) => {
    const access_token = localStorage.getItem('token')
    const headers = { Authorization: `Bearer ${access_token}` }
    
    let intervalId;

    const fetchDataAndUpdateUI = async () => {
      try {
        const res = await axios.get(baseUrl + `game/roomcode/get/${path}`, { headers });
        Allgames(userId)
        if (res.data.Accepetd_By == userId && res.data.Room_code == 0) {
          // Continue polling
        } else {
          clearInterval(intervalId);
        }
      } catch (error) {
        console.error(error);
        clearInterval(intervalId);
      }
    };

    await fetchDataAndUpdateUI();
    intervalId = setInterval(fetchDataAndUpdateUI, 1000);
    
    return () => clearInterval(intervalId);
  }

  // WebSocket setup
  useEffect(() => {
    WebSocket.prototype.emit = function(event, data) { 
      if(this.readyState === WebSocket.OPEN) {
        this.send(JSON.stringify({event, data}))
      }
    }

    WebSocket.prototype.listen = function(eventName, callback) {  
      this._socketListeners = this._socketListeners || {}
      this._socketListeners[eventName] = callback
    }

    let socket = new WebSocket("ws://localhost:6001");


    function openFunc() {
      socket.onopen = () => {
        console.log('WebSocket connected');
        setSocket(socket);
        socket.pingTimeout = setTimeout(() => {
          socket.close();
          setSocket(null);
        }, 31000); // 30s + 1s buffer
      };
    }

    function listenFunc() {
      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (socket._socketListeners && socket._socketListeners[data.event]) {
            socket._socketListeners[data.event](data.data);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
    }

    function closeFunc() {
      socket.onclose = () => {
        console.log('WebSocket disconnected');
        if (isMounted.current) {
          clearTimeout(socket.pingTimeout);
          setSocket(null);
          // Reconnect
          socket = new WebSocket("ws://localhost:6001");
          openFunc();
          listenFunc();
          closeFunc();
        }
      };
    }

    openFunc();
    listenFunc();
    closeFunc();

    return () => {
      isMounted.current = false;
      if (socket.pingTimeout) clearTimeout(socket.pingTimeout);
      setSocket(null);
      socket.close();
    };
  }, []);

  // Initial load
  useEffect(() => {
    const access_token = localStorage.getItem('token');
    if (!access_token) {
      window.location.reload()
      history.push("/login");
    }
    role();
  }, [history]);

  // Clear image
  const clearImage = () => {
    setScrnshot1("")
    setScrnshot(null)
    setStatus(null)
  }
  
  // Submit result
  const Result = async (e) => {
    e.preventDefault();
    if(submitReq.current == false) {
      submitReq.current = true;
      const access_token = localStorage.getItem("token")
      const headers = { Authorization: `Bearer ${access_token}` }
      
      if (status) {       
        setProcess(true);
        const formData = new FormData();
        if (scrnshot) formData.append('file', scrnshot);
        formData.append('status', status);
        if (status == 'cancelled' && reason) {
          formData.append('reason', reason);
        }
  
        try {
          await axios({
            method: "post",
            url: baseUrl+`challange/result/${path}`,
            data: formData,
            headers: headers,
          });
          
          if (socket) {
            socket.emit('resultAPI');
          }
          history.push(props.location.state.prevPath);
        } catch (e) {
          console.error(e)
          if (e.response?.status == 401) {
            localStorage.removeItem('token');
            window.location.reload()
            history.push("/login")
          }
        } finally {
          submitReq.current = false;
          setProcess(false);
        }
      } else {
        submitReq.current = false;
        toast.error('Select post result');
      }
    }
  }

  // Copy room code
  const copyCode = () => {
    if (Game?.Room_code) {
      navigator.clipboard.writeText(Game.Room_code.toString());
      toast.success('Room Code Copied', {
        position: toast.POSITION.CENTER,
        autoClose: 3000,
        hideProgressBar: false,
      });
    }
  }

  // Handle file input
  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setScrnshot1(URL.createObjectURL(e.target.files[0]))
      setScrnshot(e.target.files[0])
    }
  }
  
  // Set win status
  const handleClick = () => {
    setStatus("winn");
  }

  // Render API response status
  const renderApiStatus = () => {
    if (!apiResponse) return null;
    
    return (
      <div className={`api-status ${apiResponse.success ? 'success' : 'error'}`}>
        {apiResponse.message}
        {apiResponse.details && (
          <div className="api-details">{apiResponse.details}</div>
        )}
      </div>
    )
  }

  return (
    <>
      <Header user={userAllData} />
      {Game && (
        <div className='leftContainer'>
          <div className='main-area' style={{ paddingTop: '60px' }}>
            <div className="card mb-2 p-2" style={{ borderRadius: '8px', boxShadow: '0px 0px 5px rgba(128, 128, 128)' }}>
              <div className="d-flex justify-content-between align-items-center">
                <button onClick={() => history.goBack()} className="btn btn-primary" style={{ backgroundColor: '#0D6EFD', borderRadius: '5px' }}>
                  <i className="fa fa-arrow-circle-left" style={{ color: 'white' }}></i>
                  <span className="text-capitalize fw-bold" style={{ color: 'white' }}><b>BACK</b></span>
                </button>

                <NavLink to="/Rules" style={{ marginLeft: 'auto', textDecoration: 'none', color: '#5F56A5', display: 'flex', alignItems: 'center', backgroundColor: '#A9A9A9', padding: '0.2rem 0.4rem', borderRadius: '5px', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  <span className="fw-bold" style={{ color: '#fff', fontFamily: 'roboto', display: 'flex', alignItems: 'center' }}>
                    <b>RULES</b>&nbsp;
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                      <path fill="white" d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2.033 16.01c.564-1.789 1.632-3.932 1.821-4.474.273-.787-.211-1.136-1.74.209l-.34-.64c1.744-1.897 5.335-2.326 4.113.613-.763 1.835-1.309 3.074-1.621 4.03-.455 1.393.694.828 1.819-.211.153.25.203.331.356.619-2.498 2.378-5.271 2.588-4.408-.146zm4.742-8.169c-.532.453-1.32.443-1.761-.022-.441-.465-.367-1.208.164-1.661.532-.453 1.32-.442 1.761.022.439.466.367 1.209-.164 1.661z"/>
                    </svg>
                  </span>
                </NavLink>
              </div>
            </div>

            {!submitProcess && (
              <div>
                <div className="battleCard" style={{ border: '0px solid #ddd', borderRadius: '8px', padding: '5px' }}>
                  <div className="card mt-0" style={{ 
                    border: '1px solid rgb(204, 204, 204)', 
                    width: '96%', 
                    margin: '0 auto',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2), 0 6px 20px rgba(0, 0, 0, 0.19)' 
                  }}>
                    <div className="card-header text-center" style={{ 
                      fontWeight: 'bold',
                      fontSize: '14px',
                      letterSpacing: '0.9px',
                      padding: '2px 6px',
                      textAlign: 'center',
                      background: 'light',
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}>
                      <p style={{ margin: '0', fontSize: '14px', fontWeight: 'bold', color: 'darkblue' }}>
                        {Game.Created_by?.Name}
                      </p>
                      <p style={{ margin: '0', fontSize: '14px', fontWeight: 'bold', color: 'darkblue' }}>
                        {Game.Accepetd_By?.Name}
                      </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <img
                        src={Game.Created_by?.avatar ? baseUrl + `${Game.Created_by.avatar}` : "https://Haryanaludo.com/user.png"}
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://haryanaludo.com/user.png" }}
                        width='45px' height='45px' alt=''
                        style={{ borderRadius: '50%', margin: '5px 5px 5px 0' }}
                      />

                      <img
                        src="https://i.postimg.cc/kG2gYsfM/vs.png"
                        width='25px'
                        alt=''
                        style={{ marginLeft: 'auto', marginRight: 'auto' }}
                      />

                      <img
                        src={Game.Accepetd_By?.avatar ? baseUrl + `${Game.Accepetd_By.avatar}` : "https://Haryanaludo.com/user.png"}
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://haryanaludo.com/user.png" }}
                        width='45px' height='45px' alt=''
                        style={{ borderRadius: '50%', margin: '5px 0 5px 5px' }}
                      />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </div>
                    
                    <div style={{ backgroundColor: '#F7F7F7', padding: '5px' }}>
                      <div className='amount mt-1 text-center'>
                        <span style={{ opacity: '0.8' }}>Playing for</span>
                        <img
                          className='mx-1'
                          src="https://i.postimg.cc/XJXR7Q1S/global-rupee-Icon.webp"
                          width='20px'
                          alt=''
                        />
                        <span style={{ fontSize: '1em', fontWeight: 700, opacity: '0.8' }}>{Game.Game_Ammount}</span>
                      </div>
                    </div>
                  </div>

                  {/* Room Code Section */}
                  {Game.Room_code == null && (
                    <div className='roomCode cxy flex-column'>
                      Waiting for Room Code...
                      <div className="loaderReturn custom-spinner">
                        <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
                      </div>
                    </div>
                  )}

                  {Game.Room_code != 0 && (
                    <div className='roomCode cxy flex-column'>
                      <div className='text-center'>
                        <div>Classic Ludoking Roomcode</div>
                        <span style={{ color: 'green' }}><h2>{Game.Room_code}</h2></span>
                        {renderApiStatus()}
                      </div>
                      
                      <button
                        className={`btn btn-success btn-block sm m-1 position-static`}
                        style={{ 
                          width: "250px",
                          margin: "10px !important", 
                          backgroundColor: "#0D6EFD",
                          borderRadius: "5px",
                          color: "white",
                          border: "2px #0D6EFD",
                          boxShadow: "2px 4px 6px rgba(0, 0, 0, 0.1)",
                          padding: "10px 20px",
                          fontSize: "1.9em",
                          position: "static",
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          setIsLoading(true);
                          copyCode();
                          setTimeout(() => {
                            setIsLoading(false);
                            window.open('https://lk.gggred.com/?rmc=&gt=0', '_blank');
                          }, 1000);
                        }}
                      >
                        {isLoading && <i className="fa fa-circle-notch fa-spin" style={{color: "white", position: "absolute", left: "1px", top: "35%", transform: "translateY(-50%)"}}></i>}
                        {isLoading ? (
                          <span style={{marginLeft: "15px", color: "white"}}> 
                            <img src="https://i.postimg.cc/NGD2Gf8v/ludoking.jpg" width='18px' alt='' /> 
                            <b>Opening Ludo King App</b>
                          </span>
                        ) : (
                          <span className="font-9" style={{ color: 'white', fontWeight: 'bold' }}>
                            <i className="fa fa-copy"></i> COPY CODE
                          </span>
                        )}
                      </button>
                    </div>
                  )}

                  {Game.Room_code == 0 && (
                    Game.Created_by?._id == user ? (
                      <div className='roomCode cxy flex-column'>
                        {roomcode.length !== 8 && <p style={{ color: 'red', fontSize: '6px' }}>Set Only Classic Room Code.</p>}
                        <input 
                          type='number' 
                          className="cool-input mt-1 w-10" 
                          style={{ 
                            backgroundColor: '#f4f4f4', 
                            border: '1px solid #0FFF50', 
                            borderRadius: '2px',
                            height: '35px', 
                            boxShadow: '0 0 5px rgba(0, 255, 80, 0.5)'
                          }} 
                          value={roomcode} 
                          onChange={(e) => {
                            const inputVal = e.target.value.slice(0, 8); 
                            setRoomcode(inputVal);
                          }} 
                          placeholder="Enter Room Code" 
                          title="Enter Room Code"
                        /> 
                        <button
                          className={`btn btn-success btn-block sm m-1 position-static`}
                          style={{ 
                            width: "200px",
                            margin: "10px !important", 
                            backgroundColor: "#85ABE8", 
                            borderRadius: "3px",
                            color: "white",
                            border: "2px blue",
                            boxShadow: "2px 4px 6px rgba(0, 0, 0, 0.1)",
                            padding: "10px 20px",
                            fontSize: "1.9em",
                            position: "static",
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            if (roomcode.length === 8) {
                              setIsLoading(true); 
                              getPost().finally(() => setIsLoading(false));
                            } else {
                              toast.error("Enter a Classic Room Code.");
                            }
                          }}
                        >
                          {isLoading && <i className="fa fa-circle-notch fa-spin" style={{color: "white", position: "absolute", left: "1px", top: "35%", transform: "translateY(-50%)"}}></i>}
                          {isLoading ? (
                            <span style={{marginLeft: "15px", color: "white"}}><b>SET ROOMCODE</b></span>
                          ) : (
                            <span className="font-9" style={{ color: 'WHITE', fontWeight: 'bold' }}>
                              <i className="fa fa-share-alt"></i> Share Code
                            </span>
                          )}
                        </button> 
                      </div>
                    ) : (
                      <div className='roomCode cxy flex-column'>
                        Waiting for Room Code
                        <img
                          className='mx-1'
                          src="https://i.postimg.cc/MGyrRBfH/Timer30sec.gif"
                          width='250px'
                          alt=''
                        />
                      </div>
                    )
                  )}

                  {/* Match Status Section */}
                  <div className="card mt-0" style={{ border: '1px solid #ccc', width: '96%', margin: '0 auto', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2), 0 6px 20px rgba(0, 0, 0, 0.19)' }}>
                    <div className="card-header text-center" style={{ fontWeight: 'bold', fontSize: '14px', letterSpacing: '0.9px', backgroundColor: '#f8f9fb', padding: '7px 16px', margin: 'top' }}>
                      Match Status
                    </div>
                    <div className="card mb-2 p-2" style={{ borderRadius: '8px', boxShadow: '0px 0px 5px rgba(128, 128, 128)' }}>
                      <form className='result-area' onSubmit={Result} encType="multipart/form-data">
                        {fecthStatus !== null && fecthStatus !== undefined && (
                          <div className="card" style={{ backgroundColor: 'lightgrey' }}>
                            <p>You have already updated your battle result for <h6 className='d-inline-block text-uppercase' style={{ color: 'red', fontWeight: 'bold' }}>{fecthStatus}</h6></p>
                            please wait for review by admin
                          </div>
                        )}

                        {fecthStatus == null && (
                          <>
                            <div className="card" style={{ backgroundColor: 'light' }}>
                              <p>
                                After completion of your game, select the status of the game
                                and post your screenshot below.
                              </p>
                            </div>
                            <br />
                            <div className='MuiFormGroup-root radios' role='radiogroup' aria-label='Result'>           
                              <label className='MuiFormControlLabel-root' style={{ position: 'relative' }}>
                                <div
                                  className='custom-button new-button-style'
                                  onClick={handleClick}
                                  style={{ backgroundColor: status === "winn" ? 'green' : 'initial', color: status === "winn" ? 'white' : 'green' }}
                                >
                                  I Win
                                </div>
                              </label>

                              <label className='MuiFormControlLabel-root' style={{ position: 'relative' }}>
                                <div
                                  className='custom-button new2-button-style'
                                  onClick={() => setStatus("lose")}
                                  style={{ backgroundColor: status === "lose" ? 'red' : 'initial', color: status === "lose" ? 'white' : 'red', border: '1px solid red', borderRadius: '5px', cursor: 'pointer', padding: '10px', position: 'relative' }}
                                >
                                  I Lost
                                </div>
                              </label>

                              <label className='MuiFormControlLabel-root' style={{ position: 'relative' }}>
                                <div
                                  className='custom-button new3-button-style'
                                  onClick={() => setStatus("cancelled")}
                                  style={{ backgroundColor: status === "cancelled" ? 'grey' : 'initial', color: status === "cancelled" ? 'white' : 'grey', border: '1px solid grey', borderRadius: '5px', cursor: 'pointer', padding: '10px', position: 'relative' }}
                                >
                                  Cancel
                                </div>
                              </label>
                            </div>
                          </>
                        )}

                        {status !== null && status !== 'cancelled' && status !== 'lose' && (
                          <div className={`${css.doc_upload} mt-5`}>
                            <input type="file" onChange={handleChange} accept="image/*" required />
                            {!scrnshot ? (
                              <div className="cxy flex-column position-absolute">
                                <img
                                  className="upload-icon mx-1"
                                  src="https://i.postimg.cc/CL5npZ5J/uploadicon.png"
                                  width="25px"
                                  alt="Upload Icon"
                                />
                                <div className="upload-text mt-1">
                                  Upload winning screenshot.
                                </div>
                              </div>
                            ) : (
                              <div className="uploaded-container d-flex align-items-center">
                                <img
                                  src="https://i.postimg.cc/tg1vQkx2/Filesicon.png"
                                  width="26px"
                                  alt="File Icon"
                                  className="file-icon mr-2"
                                />
                                <div className="file-details d-flex flex-column" style={{ width: '80%' }}>
                                  <div className="file-name">
                                    {scrnshot.name}
                                  </div>
                                  <div className="file-size">
                                    {(scrnshot.size / 1024 / 1024).toFixed(2)} MB
                                  </div>
                                </div>
                                <div className="cancel-icon" onClick={clearImage} style={{ cursor: 'pointer' }}>
                                  <img
                                    src="https://i.postimg.cc/3NyGBPQ2/free-cancel-207-433817.png"
                                    width="23px"
                                    alt="Cancel Icon"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {status === 'cancelled' && (
                          <div className="form-group">
                            <div className="select-wrapper">
                              <select
                                style={{ border: '1px solid #f4f4f4', borderRadius: '5px' }}
                                className="form-control border-solid grey"
                                name="reason"
                                onChange={(e) => { 
                                  setReason(e.target.value);
                                  toast.info("Selected reason: " + e.target.value, { position: toast.POSITION.TOP_CENTER, autoClose: 1000 });
                                }}
                                required
                              >
                                <option value="" style={{ color: 'red' }}>Please Select Any Reason</option>
                                <option value="No Room Code" style={{ color: 'red' }}>No Room Code</option>
                                <option value="Room Code in Popular Mode" style={{ color: 'red' }}>Room Code in Popular Mode</option>
                                <option value="Game Not Started" style={{ color: 'red' }}>Game Not Started</option>
                                <option value="Not Joined" style={{ color: 'red' }}>Not Joined</option>
                                <option value="Not Playing" style={{ color: 'red' }}>Not Playing</option>
                                <option value="Invalid Room Code" style={{ color: 'red' }}>Invalid Room Code</option>
                              </select>
                            </div>
                          </div>
                        )}

                        <div style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: "10px", marginBottom: "10px" }}>
                          {scrnshot1 && <img src={scrnshot1} style={{ width: "60%" }} alt="Screenshot preview" />}
                        </div>

                        {fecthStatus == null && fecthStatus == undefined && (
                          <input type="submit" className="custom-btn" id="post" value="Post Result" />
                        )}
                      </form>
                    </div>
                  </div>
                </div>

                {/* Rules Section */}
                <div className="card mt-1" style={{ border: '1px solid #ccc', width: '94%', margin: '0 auto', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2), 0 6px 20px rgba(0, 0, 0, 0.19)' }}>
                  <div className="card-header text-center" style={{ fontWeight: 'bold', fontSize: '14px', letterSpacing: '0.9px', backgroundColor: '#f8f9fb', padding: '7px 16px', margin: 'top' }}>
                    Important Rules
                  </div>
                  <ul style={{ fontSize: '0.9rem', margin: '10px 0', paddingInlineStart: '20px' }}>
                    <li>Record every game while playing.</li>
                    <li>For cancellation of the game, video proof is necessary.</li>
                    <li style={{ backgroundColor: '#fff', borderRadius: '5px', marginTop: '10px', padding: '5px' }}>
                      <img src="https://i.postimg.cc/XJXR7Q1S/global-rupee-Icon.webp" width='18px' alt='' /> 
                      <span style={{ color: '#ff0000', fontSize: '0.9rem' }}><b>50 Penalty</b>&nbsp;</span> for updating the wrong result.
                    </li>
                    <li style={{ backgroundColor: '#fff', borderRadius: '5px', marginTop: '10px', padding: '1px' }}>
                      <img src="https://i.postimg.cc/XJXR7Q1S/global-rupee-Icon.webp" width='18px' alt='' /> 
                      <span style={{ color: '#ffcc00', fontSize: '0.9rem' }}><b>25 Penalty</b>&nbsp;</span> for not updating the result.
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {submitProcess && (
              <div className="loaderReturn" style={{ zIndex: "99", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <p style={{ marginTop: "10px" }}> Please Wait...</p>
                <img
                  src="https://i.postimg.cc/W1LyHCmH/Proccess.gif"
                  style={{ width: "60%" }}
                  alt="Loading"
                />
              </div>
            )}
          </div>
        </div>
      )}
      
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
    </>
  )
}