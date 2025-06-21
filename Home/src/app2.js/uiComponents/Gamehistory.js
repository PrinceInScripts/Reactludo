import React, { useState, useEffect } from "react";
import css from "../css/gamehis.module.css";
import { Link } from 'react-router-dom';
import ReactPaginate from "react-paginate";
import Rightcontainer from "../Components/Rightcontainer";
import axios from "axios";

const Gamehistory = () => {
  const backendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
  const backendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  const nodeMode = process.env.NODE_ENV;
  let baseUrl;
 
  if (nodeMode === "development") {
    baseUrl = backendLocalApiUrl;
  } else {
    baseUrl = backendLiveApiUrl;
  }

  const [user, setUser] = useState(null);
  const [limit] = useState(50);
  const [pageNumber, setPageNumber] = useState(0);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [roomCodes, setRoomCodes] = useState({});
  const [game, setGame] = useState([]);
  
  const role = async () => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    try {
      const res = await axios.get(`${baseUrl}me`, { headers });
      setUser(res.data);
      Allgames(res.data._id, pageNumber, limit);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePageClick = async (data) => {
    let currentPage = data.selected + 1;
    setPageNumber(currentPage);
  };

  const fetchRoomCode = async (gameId) => {
    const access_token = localStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    try {
      const response = await axios.get(`${baseUrl}game/roomcode/get/${gameId}`, { headers });
      setRoomCodes((prev) => ({ ...prev, [gameId]: response.data.Room_code }));
    } catch (error) {
      console.error(error);
    }
  };

  const Allgames = async (id) => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    try {
      const res = await axios.get(`${baseUrl}game/history/user/${id}?page=${pageNumber}&_limit=${limit}`, { headers });
      const filteredGames = res.data.data.filter(ele => ['completed', 'cancelled', 'conflict'].includes(ele.Status));
      setGame(filteredGames);
      setNumberOfPages(res.data.totalPages);
      filteredGames.forEach(ele => fetchRoomCode(ele._id));
    } catch (error) {
      console.error(error);
    }
  };

  const dateFormat = (e) => {
    const date = new Date(e);
    const newDate = date.toLocaleString('default', { month: 'short', day: 'numeric', hour: 'numeric', hour12: true, minute: 'numeric' });
    return newDate;
  };


  useEffect(() => {
    role();
    // eslint-disable-next-line
  }, [pageNumber, limit]);

  
  return (
    
<div className={css.gameHistoryContainer}>
    <div className="leftContainer" style={{ minHeight: "100vh", height: "100%" }}>
     <div className="pt-5 mb-3"></div>
     
<div className="card mt-2 p-3 bg-light">
      <div className="d-flex justify-content-between">
       <Link 
  to="/Gamehistory"
  className={css.Linked}
>
  <span className="font-9" style={{ fontWeight: '500', color: 'white' }}>Game</span>
</Link>

<Link 
  to="/transaction-history"
  className={css.Link}
>
  <span className="font-9" style={{ fontWeight: '500', color: 'black' }}>Payments </span>
</Link>

<Link 
  to="/Referral-history"
  className={css.Link}
>
   <span className="font-9" style={{ fontWeight: '500', color: 'black' }}>Referral </span>
</Link>
</div>
</div>
                
    {game && game.map((card) => (
    
          <div
            key={card._id}
            className={`w-100 mt-3 py-2 d-flex align-items-center ${css.list_item}`}
            style={{
              border:
                card.Status === "completed" && card.Winner?._id === user?._id
                  ? "0.5px solid #808080"
                  : card.Status === "completed"
                  ? "0.5px solid #808080"
                  : "0.5px solid #808080",
              borderRadius: "5px",
              backgroundColor: "",
              margin: "5px",
              padding: "5px"
            }}
          >
        <div className={`${css.list_date} mx-2`} style={{ borderRight: '1px solid #ddd', padding: '0 1px', fontSize: '0.7em', fontWeight: 'none' }}>
    <div>{dateFormat(card.createdAt).split(',')[0]}</div>
    {dateFormat(card.createdAt).split(',')[1]}
</div>
            <div className={`${css.list_divider_y}`} style={{ backgroundColor: '#ddd', height: '5%' }} />
            <div className={`mx-3 d-flex ${css.list_body}`} style={{ flexGrow: '1' }}>
              <div className="d-flex align-items-center">
                <picture className="mr-2">
                  <img
                    height="20px"
                    width="20px"
                    src="https://haryanaludo.com/ludo.png"
                    alt=""
                    style={{ borderRadius: '5px' }}
                  />
                </picture>
              </div>
              <div className="d-flex flex-column font-8">
                <div>
                  {card.Status === 'completed' ? (
                    <span style={{ fontSize: '0.8em', color: '#343a40' }}>
                      {card.Winner && card.Winner?._id === user?._id ? 'Win Against' : 'Lost Against'}
                    </span>
                  ) : (
                  <span style={{ fontSize: '0.8em', color: '#343a40' }}>
                      {card.Status === 'cancelled' ? 'Cancelled Against' : 'Accepted'}
                    </span> 


                  )}{" "}
                  <b style={{ fontSize: '0.8em' }}>{card.Accepetd_By && card.Accepetd_By?._id === user?._id ? card.Created_by?.Name : card.Accepetd_By?.Name}</b>.
                </div>
     <div className={`${css.games_section_headline}`}>
  ROOM CODE: <b style={{ color: 'grey' }}>{roomCodes[card._id] || 'N/A'}</b>
</div>
              </div>
            </div>
                     {card.Status === 'completed' && (
              <div style={{ marginLeft: 'auto' }} className="right-0 d-flex align-items-end pr-3 flex-column">
                <div className="d-flex float-right font-8">
                  {card.Status === 'completed' && card.Winner?._id === user?._id && (
                    <>
                      <span className="text-success" style={{ fontSize: '0.8em', color: '#343a40' }}>
                        <picture className="ml-1 mb-1">
                          <img height="14px" width="14px" src="https://i.postimg.cc/rmFVG8B7/Plusicon.png" alt="" />
                        </picture>
                        <b style={{ color: 'green' }}> {card.winnAmount}  ₹</b>
                      </span>
                    </>
                  )}
                  {card.Status === 'completed' && card.Winner?._id !== user?._id && (
                    <>
                      <span className="text-danger" style={{ fontSize: '0.8em', color: '#343a40' }}>
                        <picture className="ml-1 mb-1">
                          <img height="14px" width="14px" src="https://i.postimg.cc/R0j1NZNQ/Minusicon.png" alt="" />
                        </picture>
                     
                        <b> {card.Game_Ammount} ₹ </b>
                      </span>
                    </>
                  )}
                </div>                <div
                  className={`${css.games_section_headline}`}
                  style={{ fontSize: "0.6em", whiteSpace: "nowrap" }}
                >
                  closing balance: {card.Loser_closingbalance}
                </div>
              </div>
              
              
              
            )}
          </div>
           
        ))}
        {game && game.length === 0 && (
          <div className="text-center">
              <img src="https://i.postimg.cc/C10n1q2W/Add-a-heading-1-min.png" alt="no data" width={365} height={365} className="img-fluid" style={{ marginTop: '25%', border: '0px solid #ddd', borderRadius: '8px', padding: '20px' }} />
            <div className="mt-2">
            
            </div>

          </div>
            
        )}
      </div>
 <div className='mt-4'>
     <div class="card border small-card">
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

export default Gamehistory;
