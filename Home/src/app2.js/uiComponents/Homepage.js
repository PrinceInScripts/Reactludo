import React, { useEffect, useRef, useState } from "react";
import "../css/layout.css";
import css from "../Modulecss/Home.module.css";
import axios from "axios";
import { NavLink, useLocation } from "react-router-dom";
import Header from "../Components/Header";
import BetCard from "./BetCard";
import RunningCard from "./RunningCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";import 'react-toastify/dist/ReactToastify.css';

export default function Homepage({ walletUpdate }) {
  let userID = useRef();
  const isMounted = useRef(true);
  const beckendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
  const beckendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  const nodeMode = process.env.NODE_ENV;
  if (nodeMode === "development") {
    var baseUrl = beckendLocalApiUrl;
  } else {
    baseUrl = beckendLiveApiUrl;
  }
  
  
   const [user, setUser] = useState();
  const [created, setCreated] = useState([]);
  const [socket, setSocket] = useState();

  const [userAllData, setUserAllData] = useState();

  const role = async () => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    await axios
      .get(baseUrl + `me`, { headers })
      .then((res) => {
        setUser(res.data._id);
        setUserAllData(res.data);
        userID.current = res.data._id;
        setMount(true);
      })
      .catch((e) => {
        if (e.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("token");
          window.location.reload();
          setTimeout(() => {
          }, 500);
        }
     if (e.response?.status === 400 || e.response?.status === 429) {
  toast.warning("Please refresh!");
} else {
  toast.warning("Please refresh!");
}
      });
  };


  const [game_type, setGame_type] = useState(
    useLocation().pathname.split("/")[2]
  );
  const [Game_Ammount, setGame_Ammount] = useState();


  const ChallengeCreate = (e) => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    axios
      .post(
        baseUrl + `challange/create`,
        {
          Game_Ammount,
          Game_type: game_type,
        },
        { headers }
      )
      .then((res) => {
        if (res.data.msg === "you can not create same amount challenge.") {
      toast.error("you can not create same amount challenge.", {

  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined, 
});
        } else if (res.data.msg === "you have already enrolled") {
          toast.warning("You have already enrolled", {

  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
});

        } else if (res.data.msg === "You can set maximum 2 battle.") {
        toast.warning("You can set maximum 2 battle.", {

  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
});

        } else if (res.data.msg === "Insufficient balance") {
         toast.warning("Insufficient balance", { autoClose: 3000 });

        } else if (
          res.data.msg ===
          "Game amount should be Greater then 50 and less then 50000"
        ) {
     toast.warning("Game amount should be Greater than 50 and less than 50000", {

  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
});

        } else if (res.data.msg === "Set Battle in denomination of 50") {
     toast.warning("Set Battle in denomination of 50", {

  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
});
   } else if (res.data.msg === "Technical Issue, Try after an hour!") {
        toast.error("Technical Issue, Try after an hour!", {

  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
});


} else if (res.data.msg === "Battle created successfully!") {
  toast.success("Battle created successfully!", {
  
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
  

        } else {
          socket.emit("gameCreated");
        }
      })
      .catch((e) => {
        if (e.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("token");
          window.location.reload();
          setTimeout(() => {
          }, 500);
        }
        if (e.response?.status === 400 || e.response?.status === 429) {
       toast.warning("Please refresh!", {

  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
});

        }
        console.log(e);
      });
  };

  const [allgame, setallgame] = useState([]);
  const [mount, setMount] = useState(false);
  const [runningGames, setRunningGames] = useState();
  const [ownRunning, setOwnRunning] = useState([]);
  const Allgames = async () => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    axios
      .get(baseUrl + `challange/all`, { headers })
      .then((res) => {
        let owenedCreated = [],
          remainingGame = [];
        res.data.forEach(function (ele) {
          if (
            ele.Created_by._id === user &&
            (ele.Status === "new" || ele.Status === "requested")
          ) {
            owenedCreated.push(ele);
          } else {
            remainingGame.push(ele);
          }
        });
        setCreated(owenedCreated);
        setallgame(remainingGame);
      })
      .catch((e) => {
        if (e.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("token");
          window.location.reload();
          setTimeout(() => {
          }, 500);
        }
        if (e.response?.status === 400 || e.response?.status === 429) {
        toast.warning("Please refresh!", {

  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
});

        }
      });
  };

  const runningGame = async () => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    axios
      .get(baseUrl + `challange/running/all`, { headers })
      .then((res) => {
        let owenedRunning = [],
          remainingRunning = [];
        res.data.forEach(function (ele) {
          if (ele.Created_by && ele.Accepetd_By)
            if (
              ele.Created_by._id === userID.current ||
              ele.Accepetd_By._id === userID.current
            ) {
              owenedRunning.push(ele);
            } else {
              remainingRunning.push(ele);
            }
        });
        setOwnRunning(owenedRunning);
        setRunningGames(remainingRunning);
      })
      .catch((e) => {
        console.log("errror", e);
        if (e.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("token");
          window.location.reload();
        }
        if (e.response?.status === 400 || e.response?.status === 429) {
         toast.warning("Please refresh!", {

  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
});

        }
      });
  };

   function winnAmount(gameAmount) {
    let profit = null;
    if (gameAmount >= 10 && gameAmount <= 250) profit = (gameAmount * 5) / 100;
    else if (gameAmount > 250 && gameAmount <= 500)
        profit = 25;
    else if (gameAmount > 500) profit = (gameAmount * 5) / 100;
    return gameAmount - profit;
  }

  useEffect(() => {
    WebSocket.prototype.emit = function (event, data) {
      if (this.readyState === WebSocket.OPEN)
        this.send(JSON.stringify({ event, data }));
    };
    WebSocket.prototype.listen = function (eventName, callback) {
      this._socketListeners = this._socketListeners || {};
      this._socketListeners[eventName] = callback;
    };
    let socket = new WebSocket("ws://localhost:6001/server");
    function openFunc() {
      socket.onopen = () => {
        console.log("websocket is connected 馃憤");
        setSocket(socket);
        socket.pingTimeout = setTimeout(() => {
          socket.close();
          setSocket(undefined);
        }, 30000 + 1000);
      };
    }

    function listenFunc() {
      socket.onmessage = function (e) {
        try {
          const { event, data } = JSON.parse(e.data);
          socket._socketListeners[event](data);
        } catch (error) {
          console.log(error);
        }
      };

      socket.listen("ping", (data) => {
        socket.emit("pong", 2);
        clearTimeout(socket.pingTimeout);
        socket.pingTimeout = setTimeout(() => {
          console.log("ping terminate works 馃彥");
          socket.close();
          setSocket(undefined);
        }, 30000 + 1000);
      });
      socket.listen("recieveGame", (data) => {
        let owenedCreated = [],
          remainingGame = [];
        data.forEach(function (ele) {
          if (ele.Created_by)
            if (
              ele.Created_by._id === userID.current &&
              (ele.Status === "new" || ele.Status === "requested")
            ) {
              owenedCreated.push(ele);
            } else {
              remainingGame.push(ele);
            }
        });
         console.log('own',owenedCreated,'remiain',remainingGame);
        setCreated(owenedCreated);
        setallgame(remainingGame);
      });

      socket.listen("updateRunning", (data) => {
        let owenedCreated = [],
          remainingGame = [];
        data.forEach(function (ele) {
          if (ele.Created_by)
            if (
              ele.Created_by._id == userID.current &&
              (ele.Status == "new" || ele.Status == "requested")
            ) {
              owenedCreated.push(ele);
            } else {
              remainingGame.push(ele);
            }
        });
        setCreated(owenedCreated);
        setallgame(remainingGame);
        walletUpdate();
      });

      socket.listen("acceptor_seen", (data) => {
        let owenedCreated = [],
          remainingGame = [];
        data.openBattle.forEach(function (ele) {
          if (ele.Created_by)
            if (
              ele.Created_by._id == userID.current &&
              (ele.Status == "new" || ele.Status == "requested")
            ) {
              owenedCreated.push(ele);
            } else {
              remainingGame.push(ele);
            }
        });
        setCreated(owenedCreated);
        setallgame(remainingGame);
        let owenedRunning = [],
          remainingRunning = [];
        data.runningBattle.forEach(function (ele) {
          if (ele.Created_by && ele.Accepetd_By)
            if (
              ele.Created_by._id == userID.current ||
              ele.Accepetd_By._id == userID.current
            ) {
              owenedRunning.push(ele);
            } else {
              remainingRunning.push(ele);
            }
        });
        setOwnRunning(owenedRunning);
        setRunningGames(remainingRunning);
        walletUpdate();
      });

      socket.listen("resultUpdateReq", (data) => {
        let owenedRunning = [],
          remainingRunning = [];
        data.forEach(function (ele) {
          if (ele.Created_by && ele.Accepetd_By)
            if (
              ele.Created_by._id == userID.current ||
              ele.Accepetd_By._id == userID.current
            ) {
              owenedRunning.push(ele);
            } else {
              remainingRunning.push(ele);
            }
        });
        setOwnRunning(owenedRunning);
        setRunningGames(remainingRunning);
        walletUpdate();
      });

      socket.listen("startAcepptor", (data) => {
        let owenedCreated = [],
          remainingGame = [];
        data.forEach(function (ele) {
          if (ele.Created_by)
            if (
              ele.Created_by._id == userID.current &&
              (ele.Status == "new" || ele.Status == "requested")
            ) {
              owenedCreated.push(ele);
            } else {
              remainingGame.push(ele);
            }
        });
        setCreated(owenedCreated);
        setallgame(remainingGame);
        walletUpdate();
      });

      socket.listen("challengeAccepted", (data) => {
        let owenedCreated = [],
          remainingGame = [];
        data.forEach(function (ele) {
          if (ele.Created_by)
            if (
              ele.Created_by._id == userID.current &&
              (ele.Status == "new" || ele.Status == "requested")
            ) {
              owenedCreated.push(ele);
            } else {
              remainingGame.push(ele);
            }
        });
        setCreated(owenedCreated);
        setallgame(remainingGame);
      });

      socket.listen("updateReject", (data) => {
        let owenedCreated = [],
          remainingGame = [];
        data.forEach(function (ele) {
          if (ele.Created_by)
            if (
              ele.Created_by._id == userID.current &&
              (ele.Status == "new" || ele.Status == "requested")
            ) {
              owenedCreated.push(ele);
            } else {
              remainingGame.push(ele);
            }
        });
        setCreated(owenedCreated);
        setallgame(remainingGame);
      });

      socket.listen("ongoingChallenge", (data) => {
        let owenedCreated = [],
          remainingGame = [];
        data.openBattle.forEach(function (ele) {
          if (ele.Created_by)
            if (
              ele.Created_by._id == userID.current &&
              (ele.Status == "new" || ele.Status == "requested")
            ) {
              owenedCreated.push(ele);
            } else {
              remainingGame.push(ele);
            }
        });
        setCreated(owenedCreated);
        setallgame(remainingGame);
        let owenedRunning = [],
          remainingRunning = [];
        data.runningBattle.forEach(function (ele) {
          if (ele.Created_by && ele.Accepetd_By)
            if (
              ele.Created_by._id == userID.current ||
              ele.Accepetd_By._id == userID.current
            ) {
              owenedRunning.push(ele);
            } else {
              remainingRunning.push(ele);
            }
        });
        setOwnRunning(owenedRunning);
        setRunningGames(remainingRunning);
      });

      socket.listen("updateDelete", (data) => {
        let owenedCreated = [],
          remainingGame = [];
        data.forEach(function (ele) {
          if (ele.Created_by)
            if (
              ele.Created_by._id == userID.current &&
              (ele.Status == "new" || ele.Status == "requested")
            ) {
              owenedCreated.push(ele);
            } else {
              remainingGame.push(ele);
            }
        });
        setCreated(owenedCreated);
        setallgame(remainingGame);
      });
    }
    function closeFunc() {
      socket.onclose = () => {
        console.log("socket disconnected wow 馃槨");
        if (isMounted.current) {
          clearTimeout(socket.pingTimeout);
          setSocket(undefined);
          socket = new WebSocket("ws://localhost:6001/server");
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
      clearTimeout(socket.pingTimeout);
      setSocket(undefined);
      socket.close();
    };
  }, []);

  useEffect(() => {
    let access_token = localStorage.getItem("token");
    access_token = localStorage.getItem("token");
    if (!access_token) {
      window.location.reload();
      setTimeout(() => {
      }, 500);
    }
    role();
    if (mount) {
      Allgames();
      runningGame();
    }
  }, [mount]);

  const AcceptChallang = (id) => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    axios
      .put(
        baseUrl + `challange/accept/${id}`,
        {
          Accepetd_By: headers,
          Acceptor_by_Creator_at: Date.now(),
        },
        {
          headers,
        }
      )
      .then((res) => {
        if (res.data.msg === "you have already enrolled") {
         toast.warning("You have already enrolled", {

  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
});

        }
        if (res.data.msg === "Insufficient balance") {
     toast.warning("Insufficient balance", { autoClose: 3000 });
        } else {
          Allgames(res.data);
          socket.emit("acceptGame");
        }
      })
      .catch((e) => {
        console.log(e);
        if (e.response?.status == 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("token");
          window.location.reload();
          setTimeout(() => {
          }, 500);
        }
        if (e.response?.status == 400 || e.response?.status == 429) {
          toast.warning("Please refresh!", {

  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
});

        }
      });
  };

  const RejectGame = (id) => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    axios
      .put(
        baseUrl + `challange/reject/${id}`,
        {
          Accepetd_By: null,
          Status: "new",
          Acceptor_by_Creator_at: null,
        },
        { headers }
      )
      .then((res) => {
        socket.emit("gameRejected");
      })
      .catch((e) => {
        console.log(e);
        if (e.response?.status == 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("token");
          window.location.reload();
          setTimeout(() => {
          }, 500);
        }
        if (e.response?.status == 400 || e.response?.status == 429) {
       toast.warning("Please refresh!", {

  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
});

        }
      });
  };

  const deleteChallenge = (_id) => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    axios
      .delete(baseUrl + `challange/delete/${_id}`, { headers })
      .then((res) => {
        socket.emit("deleteGame", _id);
      })
      .catch((e) => {
        if (e.response?.status == 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("token");
          window.location.reload();
          setTimeout(() => {
          }, 500);
        }
        if (e.response?.status == 400 || e.response?.status == 429) {
        toast.warning("Please refresh!", {

  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
});

        }
      });
  };


  const updateChallenge = (_id) => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    axios
      .put(
        baseUrl + `challange/running/update/${_id}`,
        {
          Acceptor_seen: true,
        },
        { headers }
      )
      .then((res) => {
        socket.emit("game_seen");
      })
      .catch((e) => {
        if (e.response?.status == 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("token");
          window.location.reload();
          setTimeout(() => {
          }, 500);
        }
        if (e.response?.status == 400 || e.response?.status == 429) {
        toast.warning("Please refresh!", {

  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
});

        }
        console.log(e);
      });
  };


  const getPost = async (Id) => {
    if (
      game_type === "Ludo Classics" ||
      game_type === "Ludo 1 Goti" ||
      game_type === "Ludo Ulta"
    ) {
      socket.emit("roomCode", { game_id: Id, status: "running" });
    } else if (game_type === "Ludo Popular") {
      socket.emit("popularroomCode", { game_id: Id, status: "running" });
    }
  };
    const [isLoading, setIsLoading] = useState(false);
   
const [WebSitesettings, setWebsiteSettings] = useState("");
    const fetchData = async () => {
      const response = await fetch(baseUrl + "settings/data");
      console.log(response);
      const data = await response.json();
      return setWebsiteSettings(data);
    }

useEffect(() => {
    fetchData();
  }, [])
  return (
    <>
        <Header user={userAllData} />
      <div className="leftContainer" style={{ minHeight:'100vh' }}>

        <div className={css.mainArea} style={{ paddingTop: "70px",minHeight:'100vh' }}>
  {WebSitesettings && WebSitesettings.HomepageNotice && WebSitesettings.isHomepageNoticeActive && (
  <div className="mt-3 container position-relative" style={{ maxWidth: '95%' }}>
    <div
      role="alert"
      className="fade d-flex align-items-center justify-content-between alert show text-start"
      style={{
        fontSize: '0.8rem',
        background: '#f4f4f4',  // Lighter ivory background
        borderRadius: '4px',
        border: '1px solid #e0e0e0',  // Grey border
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        padding: '12px 16px',
        transition: 'all 0.2s ease',
        color: '#616161',  // Dark grey text
        position: 'relative',
        fontFamily: '"Segoe UI", Tahoma, sans-serif',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.08)';
        e.currentTarget.style.borderColor = '#bdbdbd';  // Darker grey on hover
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
        e.currentTarget.style.borderColor = '#e0e0e0';
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center' }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="#757575"  // Medium grey icon
          style={{ marginRight: '10px' }}
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
        <span style={{ 
          color: '#616161',
          fontWeight: '500',  // Slightly lighter font weight
          fontSize: '0.95rem',
        }}>
          {WebSitesettings.HomepageNotice}
        </span>
      </span>
    </div>
  </div>
)}
<span className={`${css.battleInputHeader} mt-5`} style={{ color: 'grey', marginLeft: '28px' }}>
  Create a Battle!
</span>
   <div className="card mb-2 p-2" style={{ 
  borderRadius: '5px', 
  boxShadow: '0px 0px 5px rgba(128, 128, 128, 0.3)', 
  backgroundColor: '#f9f9f9' 
}}>
  <div className="user_reder_code_box mt-1" style={{ 
    position: "relative", 
    width: "93%", 
    margin: "0 auto" 
  }}>
    
  <input
    className={css.formControl}
    type="tel"
    placeholder="Enter Amount"
    onChange={(e) => setGame_Ammount(e.target.value)}
    disabled={WebSitesettings?.isMaintenanceMode}
    style={{ 
      width: "100%", 
      marginRight: "0px",
      padding: "10px 15px",
      border: "1px solid #e0e0e0",
      borderRadius: "5px",
      transition: "all 0.3s ease",
      outline: "none",
      fontSize: "16px",
      backgroundColor: WebSitesettings?.isMaintenanceMode ? "#f8f9fa" : "white",
      ":hover": {
        border: WebSitesettings?.isMaintenanceMode ? "1px solid #e0e0e0" : "1px solid #0D6EFD",
        boxShadow: WebSitesettings?.isMaintenanceMode ? "none" : "0 0 0 1px rgba(13, 110, 253, 0.25)"
      },
      ":focus": {
        border: WebSitesettings?.isMaintenanceMode ? "1px solid #e0e0e0" : "1px solid #0D6EFD",
        boxShadow: WebSitesettings?.isMaintenanceMode ? "none" : "0 0 0 2px rgba(13, 110, 253, 0.25)"
      }
    }}
  /> 
  
  {WebSitesettings?.isMaintenanceMode && (
    <div className="maintenance-notice" style={{
  position: "absolute",
  top: "100%",
  left: 0,
  width: "100%",
  backgroundColor: "#fff3cd",
  color: "#856404",
  padding: "8px 12px",
  borderRadius: "4px",
  marginTop: "18px",
  border: "1px solid #ffeeba",
  fontSize: "14px",
  display: "flex",
  alignItems: "center",
  gap: "8px"
}}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="16" 
        height="16" 
        fill="currentColor" 
        viewBox="0 0 16 16"
        style={{ flexShrink: 0 }}
      >
        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
      </svg>
      <span>{WebSitesettings?.MaintenanceMessage || "System under maintenance. Please try again later."}</span>
    </div>
  )}

  <div className="set check_btn" style={{ 
    position: "absolute", 
    right: "6px", 
    top: "50%", 
    transform: "translateY(-50%)" 
  }}>
    <button
      className={`btn btn-success btn-block ${css.playButton} cxy m-1 position-static`}
      disabled={WebSitesettings?.isMaintenanceMode || isLoading}
      style={{
        backgroundColor: WebSitesettings?.isMaintenanceMode ? "#6c757d" : "#0D6EFD",
        borderRadius: "4px",
        color: "white",
        border: "1px solid transparent",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        padding: "10px 24px",
        fontSize: "16px",
        fontWeight: "500",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.3s ease",
        cursor: WebSitesettings?.isMaintenanceMode ? "not-allowed" : "pointer",
        opacity: WebSitesettings?.isMaintenanceMode ? 0.7 : 1,
        ":hover": {
          backgroundColor: WebSitesettings?.isMaintenanceMode ? "#6c757d" : "#0b5ed7",
          borderColor: WebSitesettings?.isMaintenanceMode ? "transparent" : "#0a58ca",
          transform: WebSitesettings?.isMaintenanceMode ? "none" : "translateY(-1px)"
        },
        ":active": {
          transform: WebSitesettings?.isMaintenanceMode ? "none" : "translateY(0)",
          boxShadow: WebSitesettings?.isMaintenanceMode ? "none" : "0 1px 2px rgba(0, 0, 0, 0.1)"
        }
      }}
      onClick={(e) => {
        e.preventDefault();
        const amountInput = document.querySelector(`.${css.formControl}`);
        const amountValue = amountInput.value.trim();

        if (amountValue !== '') {
          setIsLoading(true);
          ChallengeCreate();
          setTimeout(() => {
            setIsLoading(false);
            amountInput.value = ''; 
          }, 1000);
        } else {
          toast.error('Please enter the amount.');
        }
      }}
    >
      <span style={{ 
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px"
      }}>
        {isLoading && (
          <span 
            className="spinner-border spinner-border-sm" 
            role="status" 
            aria-hidden="true"
            style={{ 
              width: '1.2rem', 
              height: '1.2rem', 
              borderWidth: '0.15em',
              color: 'white'
            }}
          ></span>
        )}
        <span style={{ 
          color: 'white', 
          fontWeight: '600',
          letterSpacing: "0.5px"
        }}>
          {isLoading ? "Creating..." : "SET"}
        </span>
      </span>
    </button>
  </div>
</div>     
</div>
         <div className={css.dividerX}></div>
        <div className="px-4 py-1">
    <div className="mb-1" style={{ 
    borderBottom: '2px solid red', 
    padding: '10px 15px',  // Added padding for a more spacious layout
    display: 'flex', 
    alignItems: 'center', 
    borderRadius: '8px',  // Rounded corners
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',  // Subtle shadow for depth
    backgroundColor: '#fff'  // White background for contrast
}}>
    <img src="https://i.postimg.cc/L4ZyyXrw/Red-battle-png.png" alt="" width="25px" style={{ 
        marginRight: '12px', 
        borderRadius: '50%',  // Rounded image for a modern look
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'  // Subtle shadow around the image
    }} />
    <h5 className="card-title mb-0" style={{ 
        color: 'red', 
        fontWeight: 'bold', 
        fontSize: '1.2rem',  // Slightly larger font size
        letterSpacing: '0.5px',  // Light letter spacing
        background: 'linear-gradient(to right, #ff4e50, #f9d423)',  // Gradient text color
        WebkitBackgroundClip: 'text',  // Clip background to text
        WebkitTextFillColor: 'transparent'  // Text fill color set to transparent to show gradient
    }}>Open Battles</h5>

            <NavLink to="/Rules" style={{ marginLeft: 'auto', textDecoration: 'none', color: '#5F56A5', display: 'flex', alignItems: 'center', backgroundColor: '#d3d3d3', padding: '0.2rem 0.4rem', borderRadius: '5px', fontSize: '0.8rem', textTransform: 'uppercase' }}><span className="fw-bold" style={{ color: '#fff', fontFamily: 'roboto', display: 'flex', alignItems: 'center' }}><b>RULES</b>&nbsp;<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="white" d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2.033 16.01c.564-1.789 1.632-3.932 1.821-4.474.273-.787-.211-1.136-1.74.209l-.34-.64c1.744-1.897 5.335-2.326 4.113.613-.763 1.835-1.309 3.074-1.621 4.03-.455 1.393.694.828 1.819-.211.153.25.203.331.356.619-2.498 2.378-5.271 2.588-4.408-.146zm4.742-8.169c-.532.453-1.32.443-1.761-.022-.441-.465-.367-1.208.164-1.661.532-.453 1.32-.442 1.761.022.439.466.367 1.209-.164 1.661z"/></svg></span></NavLink>
    </div> 
           {created &&
              created.map(
                (allgame) =>
                  allgame.Game_type == game_type && (
                    <BetCard
                      key={allgame._id}
                      allgame={allgame}
                      user={user}
                      deleteChallenge={deleteChallenge}
                      getPost={getPost}
                      RejectGame={RejectGame}
                      winnAmount={winnAmount}
                      AcceptChallang={AcceptChallang}
                      updateChallenge={updateChallenge}
                    />
                  )
              )}
            {allgame &&
              allgame.map(
                (allgame) =>
                  (allgame.Status == "new" ||
                    (allgame.Status == "requested" &&
                      (user == allgame.Created_by._id ||
                        user == allgame.Accepetd_By._id)) ||
                    (allgame.Status == "running" &&
                      user == allgame.Accepetd_By._id &&
                      allgame.Acceptor_seen == false)) &&
                  allgame.Game_type == game_type && (
                    <BetCard
                      key={allgame._id}
                      allgame={allgame}
                      user={user}
                      deleteChallenge={deleteChallenge}
                      getPost={getPost}
                      RejectGame={RejectGame}
                      winnAmount={winnAmount}
                      AcceptChallang={AcceptChallang}
                      updateChallenge={updateChallenge}
                    />
                  )
              )}
          </div> <br />
 <div className={css.dividerX}></div>
          <div className="px-4 py-1">

   <div className="mb-1" style={{ 
    borderBottom: '2px solid #00FF01', 
    padding: '10px 15px',  // Added padding for a more spacious layout
    display: 'flex', 
    alignItems: 'center', 
    borderRadius: '8px',  // Rounded corners
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',  // Subtle shadow for depth
    backgroundColor: '#fff'  // White background for contrast
}}>
    <img src="https://i.postimg.cc/cHFxKhcg/green-battle-png.png" alt="" width="25px" style={{ 
        marginRight: '12px', 
        borderRadius: '50%',  // Rounded image for a modern look
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'  // Subtle shadow around the image
    }} />
    <h5 className="card-title mb-0" style={{ 
        color: '#00BF5F', 
        fontWeight: 'bold', 
        fontSize: '1.2rem',  // Slightly larger font size
        letterSpacing: '0.5px',  // Light letter spacing
        background: 'linear-gradient(to right, #00FF01, #00BF5F)',  // Gradient text color
        WebkitBackgroundClip: 'text',  // Clip background to text
        WebkitTextFillColor: 'transparent'  // Text fill color set to transparent to show gradient
    }}>Running Battles</h5>
</div>
          
        
            {ownRunning &&
              ownRunning.map((runnig) => {
                if (
                  ((user == runnig.Accepetd_By._id
                    ? (runnig.Status === "running" &&
                        user == runnig.Accepetd_By._id &&
                        runnig.Acceptor_seen == true) ||
                      runnig.Status === "pending"
                    : (runnig.Status === "running" &&
                        user == runnig.Created_by._id) ||
                      runnig.Status === "pending") ||
                    runnig.Status == "conflict") &&
                  runnig.Game_type == game_type
                )
                  return (
                    <RunningCard
                      key={runnig._id}
                      runnig={runnig}
                      user={user}
                      winnAmount={winnAmount}
                    />
                  );
              })}

            {runningGames &&
              runningGames.map((runnig) => {
                if (
                  (user == runnig.Accepetd_By._id ||
                  user == runnig.Created_by._id
                    ? user == runnig.Accepetd_By._id
                      ? (runnig.Status === "running" &&
                          user == runnig.Accepetd_By._id &&
                          runnig.Acceptor_seen == true) ||
                        (runnig.Status === "pending" &&
                          runnig.Acceptor_status == null)
                      : (runnig.Status === "running" &&
                          user == runnig.Created_by._id) ||
                        (runnig.Status === "pending" &&
                          runnig.Creator_Status == null)
                    : runnig.Status === "running" ||
                      runnig.Status === "pending") &&
                  runnig.Game_type == game_type
                )
                  return (
                    <RunningCard
                      key={runnig._id}
                      runnig={runnig}
                      user={user}
                      winnAmount={winnAmount}
                    />
                  );
              })}
       </div>
      </div>
      </div>
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
  );
}
