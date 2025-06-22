import React, { useEffect, useState } from "react";
import Rightcontainer from "../Components/Rightcontainer";
import axios from "axios";

const Support = () => {
  const beckendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
  const beckendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  const nodeMode = process.env.NODE_ENV;

  var baseUrl;
  if (nodeMode === "development") {
    baseUrl = beckendLocalApiUrl;
  } else {
    baseUrl = beckendLiveApiUrl;
  }

  const access_token = localStorage.getItem("token");
  const [user, setUser] = useState();
  const getUser = () => {
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    axios
      .get(baseUrl + `me`, { headers })
      .then((res) => {
        setUser(res.data);
      })
      .catch((e) => {
        if (e.response?.status === 401) {
          localStorage.removeItem("token");
      
        }
      });
  };

const [WebSitesettings, setWebSiteSettings] = useState({});

const fetchData = async () => {
  try {
    const response = await fetch(baseUrl + "settings/data");

    if (!response.ok) {
      throw new Error(`Failed to fetch. Status: ${response.status}`);
    }

    const data = await response.json();
    setWebSiteSettings(data);
  } catch (error) {
    console.error("Fetch error:", error);
    }
};


  useEffect(() => {
    fetchData();
    getUser();
}, [fetchData, getUser]);

  return (
      <div className="leftContainer" style={{ minHeight: "100vh", height: "100%" }}>
          <div className="cxy flex-column" style={{ paddingTop: "12%" }}>
           <div className="container-fluid">
      <div className="row">
    <div className="card mt-3" style={{ 
        border: '1px solid rgb(204, 204, 204)', 
        width: '94%', 
        margin: '0 auto',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2), 0 6px 20px rgba(0, 0, 0, 0.19)' 
    }}>
        <div className="card-header text-left" style={{ 
            fontWeight: 500, 
            fontSize: '15px', 
            letterSpacing: '0.3px', 
            backgroundColor: '#f4f4f4', 
            padding: '8px 16px' 
        }}>
            <center><b>Contacts us our platforms below</b></center>
        </div>
        <div className="card-body" style={{ padding: '16px' }}>
            
            {/*<p>(Monday to Saturday)</p> */}
            <span className="font-9" style={{ color: 'red' }}>  Support 24/7</span>
        </div>
    </div>
</div>
      
      
         <div className="text-center font-9 mb-2">   
  <picture className="mt-1">  
  <img
              src=""
              width="290px"
              alt=""
            /> 
</picture>
</div>
            
        <div className="card mt-0" style={{ 
              border: '1px solid rgb(204, 204, 204)', 
              width: '100%', 
              margin: '0 auto',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2), 0 6px 20px rgba(0, 0, 0, 0.19)' 
         }}>
         <div className="card-header text-left" style={{ fontWeight: 500, fontSize: '12px', letterSpacing: '0.9px', backgroundColor: '#f8f9fb', padding: '8px 16px' }}>

        <div className="row">
        <div className="col-md-6 mt-0" style={{ width: '50%' }}>
    <div className="card" style={{ backgroundColor: '#fff', border: '1px solid #000', borderRadius: '5px' }}>
                    <div className="card-body text-right">
                     <a className="cxy flex-column" href={`https://wa.me/7852885169?text=hello%20admin%20i%20need%20help%20%3F%20phone=${user?.Phone}`} target="_blank" style={{ color: 'white', fontWeight: 'bold' }}>
                            <img
                                width="25px"
                                src="https://i.postimg.cc/VkfPKDxb/whatsapp.png"
                                alt=""
                                className="mr-2"
                            />
                            <span className="font-9" style={{ color: 'black' }}>WhatsApp</span>
                        </a>
                     
                        
                    </div>
                </div>
            </div>
            
            <div className="col-md-6 mt-0" style={{ width: '50%' }}>
    <div className="card" style={{ backgroundColor: '#fff', border: '1px solid #000', borderRadius: '5px' }}>
                    <div className="card-body text-left">
                        <a className="cxy flex-column" href="https://www.instagram.com/official_khelobuddy" target="_blank" style={{ color: 'black', fontWeight: 'bold' }}>
                            <img
                                width="25px"
                                src="https://i.postimg.cc/Y95w8k7p/instagram.png"
                                alt=""
                                className="mr-2"
                            />
                           <span className="font-9" style={{ color: 'black' }}>Instagram</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <div className="row">
            <div className="col-md-6 mt-2" style={{ width: '50%' }}>
    <div className="card" style={{ backgroundColor: '#fff', border: '1px solid #000', borderRadius: '5px' }}>
                    <div className="card-body text-right">
                        <a className="cxy flex-column" href="https://t.me/official_khelobuddy" target="_blank" style={{ color: 'white', fontWeight: 'bold' }}>
                            <img
                                width="25px"
                                src="https://i.postimg.cc/02qsw8Zn/Telegram.png"
                                alt=""
                                className="mr-2"
                            />
                            <span className="font-9" style={{ color: 'black' }}>Telegram</span>
                        </a>
                           </div>
                    </div>
                </div>
           <div className="col-md-6 mt-2" style={{ width: '50%' }}>
    <div className="card" style={{ backgroundColor: '#fff', border: '1px solid #000', borderRadius: '5px' }}>
                    <div className="card-body text-left">
                        <a className="cxy flex-column" href={`mailto:${WebSitesettings.CompanyEmail}`} style={{ color: 'black', fontWeight: 'bold' }}>
                            <img
                                width="25px"
                                src="https://i.postimg.cc/J7X80y3t/email.png"
                                alt=""
                                className="mr-2"
                            />
                        <span className="font-9" style={{ color: 'black' }}>
  {WebSitesettings.CompanyEmail || 'support@khelobuddy.com'}!
</span>

                        </a>
                        
                          
                        
                    </div>
                </div>
            </div>
         </div>
    </div></div>

      <br />
       <div className="card mb-0 p-1" style={{ borderRadius: '8px', boxShadow: '0px 0px 5px rgba(128, 128, 128)' }}>
   <div className="text-center font-9 mb-2">
          <div className="col-12 my-2 text-center font-weight-bold">
        <span className="footer-text-bold">
  {WebSitesettings ? WebSitesettings.CompanyName || "khelobuddy Private Limited." : ""}
</span>
&nbsp;&nbsp;
     {/* <span className="footer-text-bold">
   "jaipur" 
</span>
*/}
      </div></div>
          </div>
        </div>
      </div>  
     
      <div className="rightContainer">
        <Rightcontainer />
      </div>
    </div>
  );
};
export default Support;