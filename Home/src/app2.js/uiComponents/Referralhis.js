import React ,{useEffect ,useState} from "react";
import css from "../css/gamehis.module.css";
import axios from "axios"
import { Link } from 'react-router-dom';


const Referralhis = () => {
  const beckendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
  const beckendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  const nodeMode = process.env.NODE_ENV;
  if (nodeMode === "development") {
    var baseUrl = beckendLocalApiUrl;
  } else {
    baseUrl = beckendLiveApiUrl;
  }
  const [user, setUser] = useState()

  const role = async () => {
    const access_token = localStorage.getItem("token")
    const headers = {
      Authorization: `Bearer ${access_token}`
    }
    await axios.get(baseUrl+`me`, { headers })
      .then((res) => {
        setUser(res.data)
        
        Allgames(res.data.referral_code)
        // window.location.reload()

      })

  }


  const [cardData, setGame] = useState([])

  const Allgames = async (id) => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`
    }
    await axios.get(baseUrl+`referral/code/winn/${id}`, { headers })
      .then((res) => {
        setGame(res.data)
         //console.log(res.data)
      })

  }

const dateFormat=(e)=>{
      
  const date = new Date(e); 
const newDate = date.toLocaleString('default', { month: 'short',day:'numeric',hour:'numeric',hour12:true,minute:'numeric' });
return newDate;
  }
  useEffect(() => {
    role()
    //eslint-disable-next-line
  }, [])
  
  if (cardData === undefined) {
  return null;
  }
return (
    
      <div>
    <div className="leftContainer" style={{ minHeight: '100vh', height: '100%' }}>
      {/* pagination */}
      <div className="pt-5 mb-3"></div>
      
      <div className="card mt-2 p-3 bg-light">
      <div className="d-flex justify-content-between">
       <Link 
  to="/Gamehistory"
  className={css.Link}
>
   <span className="font-9" style={{ fontWeight: '500', color: 'black' }}>Game</span>
</Link>

<Link 
  to="/transaction-history"
  className={css.Link}
>
  <span className="font-9" style={{ fontWeight: '500', color: 'black' }}>Payments </span>
</Link>

<Link 
  to="/Referral-history"
  className={css.Linked}
>
   <span className="font-9" style={{ fontWeight: '500', color: 'white' }}>Referral </span>
</Link>
</div></div>
      
      {/* referral-cards */}
      {cardData &&
        cardData.map((card) => (
          <div
            key={card._id}
            className={`w-100 py-3 d-flex align-items-center ${css.list_item}`}
            style={{
              border: '1px solid #ccc',
              borderRadius: '5px',
              backgroundColor: '',
              margin: '5px',
              padding: '3px',
            }}
          >
            {/* map the cardData */}
            <div className={`${css.list_date} mx-2`} style={{ borderRight: '1px solid #ddd', padding: '0 1px', fontSize: '0.7em', fontWeight: 'none' }}>
    <div>{dateFormat(card.createdAt).split(',')[0]}</div>
    {dateFormat(card.createdAt).split(',')[1]}
</div>
      
            <div className={`mx-0 d-flex ${css.list_body}`}>
              <div className="d-flex align-items-center">
                <picture className="mr-2">
                  <img
                    height="25px"
                    width="25px"
                    src="https://i.postimg.cc/FzNyNsxY/earning.png"
                    alt=""
                    style={{ borderRadius: '5px' }}
                  />
                </picture>
              </div>

              <div className="d-flex flex-column font-8">
                <div>
                 
                  <b style={{ fontSize: '0.8em' }}>Referral earning</b>.
                </div>
                <div className={`${css.games_section_headline}`}>
                  Earned by: {card.earned_from.Name}
                </div>
              </div>
            </div>

            <div className="right-0 d-flex align-items-end pr-3 flex-column">
              <div className="d-flex float-right font-8">
                <div className="text-danger">{card.losestatus}</div>
                <div className="text-success">
                </div>
                <picture className="ml-1 mb-1">
                  <img
                    height="13px"
                    width="13px"
                    src="https://i.postimg.cc/rmFVG8B7/Plusicon.png"
                    alt=""
                  />
                </picture>
                <picture className="ml-1 mb-1">
                  <img
                    height="17px"
                    width="17px"
                    src="https://i.postimg.cc/XJXR7Q1S/global-rupee-Icon.webp"
                    alt=""
                  />
                </picture>
       <span className="pl-1" style={{ color: 'black', padding: '0em' }}>
    <b style={{ fontSize: '0.9em' }}>{card.amount}</b>
</span>
       
              </div>
              <div
                className={`${css.games_section_headline}`}
                style={{ fontSize: '0.6em', whiteSpace: 'nowrap' }}
              >
                Closing Balance: {card.closing_balance.toFixed(2)}
              </div>
            </div>
          </div>
        ))}
      {cardData && cardData.length === 0 && (
        <div className="text-center">
            <img src="https://i.postimg.cc/C10n1q2W/Add-a-heading-1-min.png" alt="no data" width={365} height={365} className="img-fluid" style={{ marginTop: '25%', border: '0px solid #ddd', borderRadius: '8px', padding: '20px' }} />
            <div className="mt-2">
            
            </div>
        </div>
      )}
    </div>
  </div>
);
};

export default Referralhis;
