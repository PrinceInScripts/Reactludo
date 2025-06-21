import React, { memo, useState, useEffect } from 'react';
import css from "../Modulecss/Home.module.css";
import { Link } from "react-router-dom";
import acceptSound from "./accept.mp3";
import findGif from "../css/loading_old.gif";
import playSound from "./play.mp3";
import { toast } from 'react-toastify';

// Fake data configuration
const FAKE_NAMES = [
  "Rohan Patel", "Vivek Singh", "Aditya Mehta", "Kunal Choudhary", "Pranav Reddy",
  "Siddharth Iyer", "Neeraj Kumar", "Ankit Jain", "Varun Sharma", "Dhruv Malhotra",
  "Arnav Gupta", "Rajat Verma", "Harsh Shah", "Yuvraj Bajaj", "Krishna Menon",
  "Aryan Khanna", "Vishal Nair", "Abhishek Saxena", "Sarthak Agarwal", "Rishabh Kapoor",
  "Aman Tripathi", "Karan Sethi", "Manav Joshi", "Ravi Shekhar", "Parth Desai",
  "Utkarsh Bansal", "Nikhil Thakur", "Gaurav Chopra", "Anirudh Bhatt", "Tanmay Mishra",
  "Devansh Tiwari", "Shreyas Rao", "Lakshay Malhotra", "Ashwin Joshi", "Rudra Singh",
  "Mohit Goyal", "Jayant Pandey", "Tushar Arora", "Ritvik Sinha", "Yash Dubey",
  "Bhavya Shah", "Ishaan Khurana", "Pulkit Agarwal", "Harshit Jain", "Mayank Kaushik",
  "Adarsh Dubey", "Sumit Vora", "Aayush Sharma", "Arjit Das", "Naveen Chauhan",
  "Mehul Jain", "Darshan Mehta", "Rajeev Sharma", "Rohan Deshmukh", "Nitin Taneja",
  "Sameer Yadav", "Rakesh Bhatia", "Anshul Kapoor", "Sanjay Rathore", "Piyush Anand",
  "Dev Patel", "Naman Jindal", "Keshav Goel", "Deepak Sharma", "Kartik Tyagi",
  "Ayush Bhandari", "Nirav Vyas", "Sahil Rawat", "Vedant Purohit", "Hrithik Suri",
  "Akhil Menon", "Tarun Joshi", "Chirag Taneja", "Amitabh Rao", "Raghav Kapoor",
  "Manish Rawal", "Naveen Iyer", "Tejas Kalra", "Abhinav Saxena", "Sanket Mishra",
  "Pratik Shah", "Rajat Gaur", "Viraj Nanda", "Sharad Saxena", "Rishi Malhotra",
  "Nilesh Yadav", "Aarav Rathi", "Divyansh Kohli", "Jatin Oberoi", "Lakshya Kapoor",
  "Saurabh Lohia", "Naman Pathak", "Yogesh Raina", "Ronit Bhalla", "Aayansh Sharma",
  "Deepanshu Khare", "Shivam Chauhan", "Aditya Pratap", "Harshdeep Gill", "Taranjeet Singh",
  "Ranveer Saini", "Jaskaran Dhillon", "Bhupinder Singh", "Arjun Vohra", "Kabir Khanna"
];

const FAKE_AMOUNTS = [
  500, 550, 600, 650, 700, 750, 800, 850, 900, 950,
  1000, 1050, 1100, 1150, 1200, 1250, 1300, 1350, 1400, 1450,
  1500, 1550, 1600, 1650, 1700, 1750, 1800, 1850, 1900, 1950,
  2000, 2050, 2100, 2150, 2200, 2250, 2300, 2350, 2400, 2450,
  2500, 2550, 2600, 2650, 2700, 2750, 2800, 2850, 2900, 2950,
  3000
];

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomItem = (array) => array[getRandomInt(0, array.length - 1)];

const beckendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
const beckendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
const nodeMode = process.env.NODE_ENV;
const baseUrl = nodeMode === "development" ? beckendLocalApiUrl : beckendLiveApiUrl;

const BetCard = React.memo(({ allgame, user, deleteChallenge, getPost, RejectGame, winnAmount, AcceptChallang, updateChallenge }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [rejectedGameId, setRejectedGameId] = useState(null);
  const [visibleFakeChallenge, setVisibleFakeChallenge] = useState(null);

  // Fake challenge logic
  const generateFakeChallenge = () => ({
    _id: `fake_${Date.now()}_${getRandomInt(1000, 9999)}`,
    Game_Ammount: getRandomItem(FAKE_AMOUNTS),
    Status: "new",
    Created_by: {
      _id: `fake_user_${getRandomInt(1000, 9999)}`,
      Name: getRandomItem(FAKE_NAMES),
      avatar: null
    },
    isFake: true
  });

  useEffect(() => {
    let timeoutId;
    let isMounted = true;

    const showNextFakeChallenge = () => {
      if (!isMounted) return;
      setVisibleFakeChallenge(generateFakeChallenge());
      setTimeout(() => {
        if (isMounted) {
          setVisibleFakeChallenge(null);
          const delay = getRandomInt(5000, 15000); // Increased delay between fake challenges
          timeoutId = setTimeout(showNextFakeChallenge, delay);
        }
      }, 3000); // Increased display duration
    };

    const initialDelay = getRandomInt(3000, 8000); // Increased initial delay
    timeoutId = setTimeout(showNextFakeChallenge, initialDelay);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, []);

  const handlePlayClick = async (gameId, isFake = false) => {
    if (isFake) {
      toast.error('Insufficient balance to accept this challenge', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    setIsLoading(true);
    await AcceptChallang(gameId);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleRejectClick = async (gameId, isFake = false) => {
    if (isFake) return;
    setRejectedGameId(gameId);
    await RejectGame(gameId);
    setTimeout(() => setRejectedGameId(null), 1000);
  };

  const renderChallenge = (challenge, isFake = false) => (
    <div className={`${css.betCard} mt-2`} style={{ fontFamily: 'Poppins, sans-serif', transition: 'opacity 0.5s ease' }} key={challenge._id}>
      <span
        className={`${css.betCardTitle} pl-3 d-flex align-items-center text-uppercase ${css.betTitleDiv}`}
      >
        CHALLENGE FROM
        <span className="ml-1" style={{ color: "brown" }}>
          {challenge.Created_by.Name}
        </span>
        {!isFake && user === challenge.Created_by._id &&
          challenge.Status === "new" && (
            <button
              className={`p-1 m-1 mb-1 ml-auto btn-danger btn-sm`}
              onClick={() => deleteChallenge(challenge._id)}
            >
              DELETE
            </button>
          )}
        {!isFake && user === challenge.Created_by._id &&
          challenge.Status === "requested" && (
            <div className="d-flex ml-auto align-items-center">
              <Link to={{ pathname: `/viewgame1/${challenge._id}`, state: { prevPath: window.location.pathname } }} onClick={() => getPost(challenge._id)} style={{ bottom: '0' }}>
                <button
                  className={`bg-success position-relative mx-1 btn-sm text-white btn-inverse-success`}
                >
                  START
                </button>
              </Link>
              <button
                className={`text-white bg-danger position-relative mx-1 btn-sm btn-outline-youtube`}
                onClick={() => RejectGame(challenge._id)} style={{ bottom: '0' }}
              >
                REJECT
              </button>
            </div>
          )}
      </span>
      <div className={`d-flex pl-3 ${css.betBodyDiv}`}>
        <div className="pr-3 pb-1">
          <span className={css.betCardSubTitle}>Entry Fee</span>
          <div>
            <img
              src={
                process.env.PUBLIC_URL +
                "/Images/LandingPage_img/global-rupeeIcon.png"
              }
              alt=""
              width="21px"
            />
            <span className={css.betCardAmount}>
              {challenge.Game_Ammount}
            </span>
          </div>
        </div>
        <div>
          <span className={css.betCardSubTitle}>Prize</span>
          <div>
            <img
              src={
                process.env.PUBLIC_URL +
                "/Images/LandingPage_img/global-rupeeIcon.png"
              }
              alt=""
              width="21px"
            />
            <span className={css.betCardAmount}>
              {challenge.Game_Ammount +
                (winnAmount ? winnAmount(challenge.Game_Ammount) : Math.round(challenge.Game_Ammount * 0.8))}
            </span>
          </div>
        </div>
        {/* Play Button */}
        {user !== challenge.Created_by._id &&
          challenge.Status === "new" && (
            <button
              className={`${css.bgSecondary} ${css.playButton} ${css.cxy}`}
              onClick={() => handlePlayClick(challenge._id, isFake)}
              disabled={isLoading && !isFake}
            >
              {isLoading && !isFake ? (
                <span
                  className="spinner-border spinner-border-sm text-light mr-2"
                  role="status"
                  aria-hidden="true"
                  style={{ width: '1.2rem', height: '1.2rem', borderWidth: '0.15em' }}
                />
              ) : (
                "Play"
              )}
            </button>
          )}
        {/* Finding player */}
        {!isFake && user === challenge.Created_by._id &&
          challenge.Status === "new" && (
            <div className="text-center col-5 ml-auto mt-auto mb-auto">
              <div className="pl-2 text-center">
                <img
                  src={findGif}
                  style={{ width: "15px", height: "15px" }}
                  alt="finding player"
                />
              </div>
              <div style={{ lineHeight: 1 }}>
                <span className={css.betCard_playerName}>
                  Finding Player!
                </span>
              </div>
            </div>
          )}
        {/* Requesting - cancel */}
        {!isFake && user !== challenge.Created_by._id &&
          challenge.Status === "requested" && (
            <div className="d-flex ml-auto align-items-center">
              <div
                className={`${css.bgSecondary} ${css.playButton} ${css.cxy} position-relative mx-1 text-white btn-sm`}
              >
                requested
              </div>
              <button
                className={`${css.bgSecondary} ${css.playButton} ${css.cxy} position-relative mx-1 bg-danger btn-sm`}
                onClick={() => handleRejectClick(challenge._id)}
                disabled={rejectedGameId === challenge._id}
              >
                {rejectedGameId === challenge._id ? "cancelled" : "cancel"}
              </button>
            </div>
          )}
        {/* Start for opponent in running */}
        {!isFake && user !== challenge.Created_by._id &&
          challenge.Status === "running" && (
            <div className="d-flex ml-auto align-items-center">
              <audio src={playSound} autoPlay />
              <Link
                className={`${css.bgSecondary} ${css.playButton} ${css.cxy} bg-success btn-sm`}
                to={{ pathname: `/viewgame1/${challenge._id}`, state: { prevPath: window.location.pathname } }}
                onClick={() => updateChallenge(challenge._id)}
              >
                start
              </Link>
            </div>
          )}
        {/* Show accepted by avatar, name for creator if requested */}
        {!isFake && user === challenge.Created_by._id &&
          challenge.Status === "requested" && (
            <div className="d-flex ml-auto align-items-center mr-5 mt-1">
              <audio src={acceptSound} autoPlay />
              <div className="text-center col">
                <div className="pl-2">
                  {challenge.Accepetd_By?.avatar ? (<img
                    src={baseUrl + `${challenge.Accepetd_By.avatar}`}
                    alt=""
                    width='40px' height="40px"
                    style={{ borderRadius: "50%", marginTop: "5px" }}
                  />) : (<img
                    src={`https://haryanaludo.com/user.png`}
                    alt=""
                    width='40px' height="40px"
                    style={{ borderRadius: "50%", marginTop: "5px" }}
                  />)}
                </div>
                <div style={{ lineHeight: 1 }}>
                  <span className={css.betCard_playerName}>
                    {challenge.Accepetd_By?.Name}
                  </span>
                </div>
              </div>
            </div>
          )}
        {/* FAKE Challenge states */}
        {isFake && (
          <>
            {/* Play Button for fake (disabled) */}
            <button
              className={`${css.bgSecondary} ${css.playButton} ${css.cxy}`}
              style={{ opacity: 0.7 }}
              disabled
            >
              Play
            </button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      {allgame && renderChallenge(allgame)}
      {visibleFakeChallenge && renderChallenge(visibleFakeChallenge, true)}
    </>
  );
});

export default memo(BetCard);