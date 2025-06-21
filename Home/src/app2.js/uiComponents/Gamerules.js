import React, { useState } from "react";
import Header from "../Components/Header";
import Rightcontainer from "../Components/Rightcontainer";
import '../css/Gamerules.css';
import { Link, useHistory } from "react-router-dom";


const Gamerules = () => {
    const history = useHistory();
  const [language, setLanguage] = useState("english");
const [isClicked, setIsClicked] = useState(false);
 
  const toggleLanguage = () => {
    setLanguage((prevLanguage) => (prevLanguage === "english" ? "hindi" : "english"));
  };

  const getRulesContent = () => {
    if (language === "hindi") {
       
       
      return (
        <> 
       <div className="card mt-2" style={{ borderRadius: '2px', boxShadow: '0px 0px 5px rgba(128, 128, 128)' }}>
           <div className="d-flex align-items-center games-section-title text-left">
  <div className="col">
    <h5 style={{ fontWeight: 'bold', color: '#7C7C7C' }}>खेल के नियम:</h5>
  </div> 
        <div className="col-auto">
<a href="https://youtu.be/6XldM?si=9LGmp8m-kph2i_Ub" target="_blank" rel="noreferrer">
  <button style={{ backgroundColor: '#007BFF', color: 'white', padding: '6px 10px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)', transition: 'background-color 0.3s ease' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#0056b3'} onMouseOut={e => e.currentTarget.style.backgroundColor = '#007BFF'}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="1em" height="1em" fill="currentColor" className="me-1" style={{ fill: 'white' }}>
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path>
      <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"></path>
    </svg>
    &nbsp; Guide
  </button>
</a>
  </div>
     </div></div>    
           <ol className="rules-list">
                     <li>
            जीतने पर दोनों खिलाड़ी को निम्नलिखित रूप में अपने परिणाम अपडेट करना होगा: <ul> <li> यदि आपने युद्ध जीता है, तो 'i win' विकल्प का चयन करें और खेल का जीतने का स्क्रीनशॉट अपलोड करें। </li> <li>यदि आपने युद्ध हार लिया है, तो 'i lost' विकल्प का चयन करें।</li> <li> यदि आपकी युद्ध शुरू नहीं हुई है और आपका प्रतिद्वंद्वी खेलना नहीं चाहता है, तो 'Cancel' विकल्प का चयन करेंकरें।
                </li>
              </ul>
            </li>
            <li>
              एक खिलाड़ी को प्रत्येक खेल को रिकॉर्ड करना होगा, और यदि कोई खिलाड़ी किसी खेल में हैकिंग या धूर्तता कर रहा है, तो कृपया वीडियो साक्षात्कार के साथ समर्थन से संपर्क करें।
            </li>
            <li>
              यदि आपका खेल शुरू नहीं हुआ है, और यदि आपने एक ही चाल भी नहीं खेली है, तो कृपया हमें खेल को साक्षात्कार के रूप में दिखाएं। खेल केवल तब रद्द किया जाएगा जब आपने इसे रिकॉर्ड किया है।
            </li>
            <li>
              यदि खिलाड़ी धूर्तता और गेम में त्रुटि के खिलाफ कोई प्रमाण नहीं रखता है, तो उसे एक विशेष युद्ध के लिए हारा माना जाएगा।
            </li>
            <li>
              यदि आपने एक ही पॉन नहीं हिलाई है या कोई पॉन अब तक खुला नहीं हुआ है, अर्थात सभी पॉन होम में हैं, तो आपका खेल रद्द किया जाएगा।
            </li>
            <li>
              यदि आपका प्रतिद्वंद्वी पहले ही खेल में या प्रारंभिक खेल में मैच छोड़ता है, और प्रतिद्वंद्वी के पास रद्द करने का कोई वैध प्रमाण नहीं है, तो आपको 50% जीत मिलेगी।
            </li>
          </ol>
          <hr />
             <div style={{ opacity: '.8' }}>
            Ludo King App में लूडो खेलें
          </div>
          <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
            <a href='https://play.google.com/store/apps/details?id=com.ludo.king' target='_blank' rel='noopener noreferrer'>
              <img src={process.env.PUBLIC_URL + '/Images/google-play.jpeg'} width='90px' height='30px' alt='Google Play' />
            </a>
            <a href='https://itunes.apple.com/app/id993090598' target='_blank' rel='noopener noreferrer'>
              <img src={process.env.PUBLIC_URL + '/Images/app-store.jpeg'} width='90px' height='30px' alt='App Store' />
            </a>
          </div>
          <hr />
          <h4><strong>कमीशन दरें:</strong></h4>
          <ol className="rules-list">
            <li>
              250₹ से कम की जंग, जंग राशि पर <b>5% कमीशन</b> लिया जाएगा।
            </li>
            <li>
              250₹ से 500₹ के बीच की जंग, <b>5%</b> कमीशन लिया जाएगा।
            </li>
            <li>
              500₹ से अधिक की जंग, जंग राशि पर <b>5% कमीशन</b> लिया जाएगा।
            </li>
            <li>
              हर दोस्त का संदर्भ करें, आपको प्रत्येक संदर्भ की जीत पर हर संदर्भ के जीत पर <b>2% कमीशन</b> मिलेगा।
            </li>
            </ol>
          <h4><strong>जुर्माने की दरें:</strong></h4>
           <ol className="rules-list">
          <ul style={{ fontSize: '0.9rem', margin: '10px 0', paddingInlineStart: '20px' }}>
            <li>
              हर खेल को खेलते समय रिकॉर्ड करें।
            </li>
            <li>
              खेल की रद्दीकरण के लिए, वीडियो प्रमाण आवश्यक है।
            </li>
            <li style={{ backgroundColor: '#fff', borderRadius: '5px', marginTop: '10px', padding: '5px' }}>
              <img src="https://i.postimg.cc/XJXR7Q1S/global-rupee-Icon.webp" width='18px' alt='' /> 
              <span style={{ color: '#ff0000', fontSize: '0.9rem' }}><b>50 पेनाल्टी</b>&nbsp;</span> गलत परिणाम अपडेट करने के लिए।
            </li>
            <li style={{ backgroundColor: '#fff', borderRadius: '5px', marginTop: '10px', padding: '5px' }}>
              <img src="https://i.postimg.cc/XJXR7Q1S/global-rupee-Icon.webp" width='18px' alt='' /> 
              <span style={{ color: '#ffcc00', fontSize: '0.9rem' }}><b>25 पेनाल्टी</b>&nbsp;</span> परिणाम अपडेट नहीं करने के लिए।
            </li>
          </ul>
          </ol>
          <hr />
          <p style={{ color: '#e74c3c', fontWeight: 'bold' }}>
इस गेम में वित्तीय जोखिम का तत्व शामिल है और यह नशे की लत भी बन सकता है।
कृपया अपने जोखिम पर जिम्मेदारी से खेलें।
</p>
<hr />
        </>
      );
    } else {
      return (
        <>
        
        <div className="card mb-2 p-2" style={{ borderRadius: '8px', boxShadow: '0px 0px 5px rgba(128, 128, 128)' }}>
           <div className="d-flex align-items-center games-section-title text-left">
  <div className="col">
    <h5 style={{ fontWeight: 'bold', color: '#7C7C7C' }}>Game Rules:</h5>
  </div> 
         <div className="col-auto">
    <a href="https://youtu.be/ldM?si=9p8m-kph2i_Ub" target="_blank" rel="noreferrer">
  <button style={{ backgroundColor: '#007BFF', color: 'white', padding: '6px 10px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)', transition: 'background-color 0.3s ease' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#0056b3'} onMouseOut={e => e.currentTarget.style.backgroundColor = '#007BFF'}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="1em" height="1em" fill="currentColor" className="me-1" style={{ fill: 'white' }}>
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path>
      <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"></path>
    </svg>
    &nbsp; Guide
  </button>
</a>
  </div>
     </div></div>    
         
         
          <ol className="rules-list">
            <li>
              On winning, both players have to update their results in the following manner:
              <ul>
                <li>
                  If you have won the battle, select ‘I Won’ option and upload the winning screenshot of the game.
                </li>
                <li>If you have lost the battle, select ‘I Lost’ option.</li>
                <li>
                  If your battle is not started and your opponent doesn't want to play, select ‘Cancel’ option.
                </li>
              </ul>
            </li>
            <li>
              A player must have to record every game, and if any player is hacking or cheating in a game, please contact support with video proof.
            </li>
            <li>
              If your game is not started, and if you haven't played a single move yourself, please show us a recording of the game as proof. The game will be canceled only if you have recorded.
            </li>
            <li>
              If you don't have any proof against player cheating and error in the game, then you will be considered as lost for a particular battle.
            </li>
            <li>
              If you haven't moved a single pawn or no pawn is open yet, i.e. all pawns are at home, then your game will be cancelled.
            </li>
            <li>
              If your opponent leaves the game in the middle or leaves in the early game, and if the opponent doesn't have valid proof to cancel, then you will get 50% winnings.
            </li>
          </ol>
          <hr />
          <div style={{ opacity: '.8' }}>
            Play Ludo in the Ludo King App
          </div>
          <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
            <a href='https://play.google.com/store/apps/details?id=com.ludo.king' target='_blank' rel='noopener noreferrer'>
              <img src={process.env.PUBLIC_URL + '/Images/google-play.jpeg'} width='90px' height='30px' alt='Google Play' />
            </a>
            <a href='https://itunes.apple.com/app/id993090598' target='_blank' rel='noopener noreferrer'>
              <img src={process.env.PUBLIC_URL + '/Images/app-store.jpeg'} width='90px' height='30px' alt='App Store' />
            </a>
          </div>
          <hr />
          <h4><strong>Commission Rates:</strong></h4>
          <ol className="rules-list">
            <li>
              Battle below 250₹, <b>5% commission</b> will be charged on the battle amount.
            </li>
            <li>
              Battle between 250₹ to 500₹, <b>flat 5%</b> commission will be charged.
            </li>
            <li>
              Battle above 500₹, <b>5% commission</b> will be charged on the battle amount.
            </li>
            <li>
              Refer every friend. You will get <b>2% commission</b> on every referral's winnings for a lifetime.
            </li>
          </ol>
          <h4><strong>Penalty Rates:</strong></h4>
            <ol className="rules-list">
          <ul style={{ fontSize: '0.9rem', margin: '10px 0', paddingInlineStart: '20px' }}>
            <li>
              Record every game while playing.
            </li>
            <li>
              Video proof is required for cancellation of the game.
            </li>
            <li style={{ backgroundColor: '#fff', borderRadius: '5px', marginTop: '10px', padding: '5px' }}>
              <img src="https://i.postimg.cc/XJXR7Q1S/global-rupee-Icon.webp" width='18px' alt='' /> 
              <span style={{ color: '#ff0000', fontSize: '0.9rem' }}><b>50 Penalty</b>&nbsp;</span> for updating wrong results.
            </li>
            <li style={{ backgroundColor: '#fff', borderRadius: '5px', marginTop: '10px', padding: '5px' }}>
              <img src="https://i.postimg.cc/XJXR7Q1S/global-rupee-Icon.webp" width='18px' alt='' /> 
              <span style={{ color: '#ffcc00', fontSize: '0.9rem' }}><b>25 Penalty</b>&nbsp;</span> for not updating the results.
            </li>
          </ul> 
          </ol>
          <hr />
          <p style={{ color: '#e74c3c', fontWeight: 'bold' }}>
        This game involves an element of financial risk AND may be addictive.
        Please play RESPONSIBLY at your own risk.
      </p>
      <hr />
        </>
      );
    }
  };

  return (
    <div><hr />
      <div className="leftContainer" style={{ minHeight: '100vh', height: '100%' }}>
        <div className="mt-1 py-5 pt-3 px-3">
              <div className="card mb-2 py-2" style={{ borderRadius: '8px', boxShadow: '0px 0px 5px rgba(128, 128, 128)' }}>
          <div className="d-flex justify-content-between align-items-center mb-0"> 
          
              <button onClick={() => history.goBack()} className="btn btn-primary" style={{ backgroundColor: '#0D6EFD', borderRadius: '5px' }}>
   <i className="fa fa-arrow-circle-left" style={{ color: 'white' }}></i>
     <span className="text-capitalize fw-bold" style={{ color: 'white' }}><b>BACK</b></span>
       </button>
     <button
  className="btn btn-outline-info"
  style={{ fontWeight: 'bold', color: 'black', borderRadius: '5px' }}
  onClick={toggleLanguage}
>
  <i className="fa fa-language"></i>&nbsp;
  <span style={{ fontWeight: 'bold', color: 'black' }}>
    {language === "english" ? "अनुवाद हिंदी में" : "Translate to English"}
  </span>
</button>
 </div>
   </div>
          {getRulesContent()}
        </div>
      </div>
                     <footer>
  <p>&copy; 2020 haryanaludo Pvt Ltd. All rights reserved.</p>
</footer>

      <Rightcontainer />
    </div>
  );
};

export default Gamerules;
