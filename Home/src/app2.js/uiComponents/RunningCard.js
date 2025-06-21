import React, { useState, useEffect } from "react";
import css from "../Modulecss/Home.module.css";
import { Link } from "react-router-dom";
import avtar1 from "../Avtar/Avatar1.png";
import avtar2 from "../Avtar/Avatar2.png";
import avtar3 from "../Avtar/Avatar3.png";
import avtar4 from "../Avtar/Avatar4.png";
import avtar5 from "../Avtar/Avatar5.png";
import avtar6 from "../Avtar/Avatar6.png";

// Fake data configuration
const FAKE_NAMES = [
  "Amit Sharma", "Rohit Gupta", "Vikram Joshi", "Rahul Nair", "Manish Kapoor",
  "Karan Malhotra", "Sunil Rao", "Aakash Verma", "Sahil Arora", "Kabir Khan",
  "Aarav Dubey", "Advait Sinha", "Ishan Roy", "Arjun Mittal", "Yash Thakur"
];

const FAKE_AMOUNTS = [
  50, 100, 150, 200, 250, 300, 350, 400, 450, 500,
  600, 700, 800, 900, 1000, 1200, 1400, 1600, 1800, 2000
];

const AVATARS = [avtar1, avtar2, avtar3, avtar4, avtar5, avtar6];

// Helper functions
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomItem = (array) => array[getRandomInt(0, array.length - 1)];
const calculatePrize = (amount) => (amount * 2) - 15;

// Generate a single fake challenge
const generateFakeChallenge = () => ({
  _id: `fake_${Date.now()}_${getRandomInt(1000, 9999)}`,
  Game_Ammount: getRandomItem(FAKE_AMOUNTS),
  Status: getRandomInt(0, 9) === 0 ? "conflict" : "active",
  Created_by: {
    _id: `fake_user_${getRandomInt(1000, 9999)}`,
    Name: getRandomItem(FAKE_NAMES),
    avatar: getRandomItem(AVATARS)
  },
  Accepetd_By: {
    _id: `fake_user_${getRandomInt(1000, 9999)}`,
    Name: getRandomItem(FAKE_NAMES),
    avatar: getRandomItem(AVATARS)
  },
  isFake: true
});

function ChallengeCard({ challenge, user, winnAmount, game_type, backendUrl }) {
  const isFake = challenge.isFake;
  const isUserInvolved = user &&
    (user === challenge.Accepetd_By?._id ||
     user === challenge.Created_by?._id);

  return (
    <div className={`${css.betCard} mt-1`}>
      <div className="d-flex">
        <span className={`${css.betCardTitle} pl-3 d-flex align-items-center text-uppercase`}>
          PLAYING FOR
          <img
            className="mx-1"
            src="https://i.postimg.cc/XJXR7Q1S/global-rupee-Icon.webp"
            alt=""
            width="21px"
          />
          {challenge.Game_Ammount}
        </span>
        
        {/* Show View/Review only for real challenges where user is involved */}
        {!isFake && isUserInvolved && (
          <Link
            className={`${css.bgsecondary} ${css.playButtons} ${css.cxy} position-relative m-2 mx-1 ${
              challenge.Status === "conflict" ? "bg-danger" : "bg-success"
            }`}
            style={{
              right: "0px",
              top: "-6px",
              padding: "10px 17px",
            }}
            to={{
              pathname: `/viewgame1/${challenge._id}`,
              state: { prevPath: window.location.pathname },
            }}
          >
            {challenge.Status === "conflict" ? "Review" : "View"}
          </Link>
        )}

        <div className={`${css.betCardTitle} d-flex align-items-center text-uppercase`}>
          <span className="ml-auto mr-3">
            PRIZE
            <img
              className="mx-1"
              src="https://i.postimg.cc/XJXR7Q1S/global-rupee-Icon.webp"
              alt=""
              width="21px"
            />
            {challenge.Game_Ammount + (
              winnAmount
                ? winnAmount(challenge.Game_Ammount)
                : calculatePrize(challenge.Game_Ammount) - challenge.Game_Ammount
            )}
          </span>
        </div>
      </div>
      
      <div className="py-1 row">
        <div className="pr-3 text-center col-5">
          <div className="pl-2">
            <img
              src={
                challenge.Created_by?.avatar
                  ? (isFake ? challenge.Created_by.avatar : `${backendUrl}${challenge.Created_by.avatar}`)
                  : getRandomItem(AVATARS)
              }
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = getRandomItem(AVATARS);
              }}
              alt=""
              width="28px"
              height="28px"
              style={{ borderRadius: "50%" }}
            />
          </div>
          <div style={{ lineHeight: 1 }}>
            <span className={css.betCard_playerName}>
              {challenge.Created_by?.Name || "Player 1"}
            </span>
          </div>
        </div>
        
        <div className="pr-3 text-center col-2 cxy">
          <img src="https://i.postimg.cc/kG2gYsfM/vs.png" alt="" width="21px" />
        </div>
        
        <div className="text-center col-5">
          <div className="pl-2">
            <img
              src={
                challenge.Accepetd_By?.avatar
                  ? (isFake ? challenge.Accepetd_By.avatar : `${backendUrl}${challenge.Accepetd_By.avatar}`)
                  : getRandomItem(AVATARS)
              }
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = getRandomItem(AVATARS);
              }}
              alt=""
              width="28px"
              height="28px"
              style={{ borderRadius: "50%" }}
            />
          </div>
          <div style={{ lineHeight: 1 }}>
            <span className={css.betCard_playerName}>
              {challenge.Accepetd_By?.Name || "Player 2"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RunningCard({ runnig, user, winnAmount, game_type }) {
  const [fakeChallenges, setFakeChallenges] = useState([]);
  const [currentFake, setCurrentFake] = useState(generateFakeChallenge());

  const backendUrl = process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_BACKEND_LOCAL_API
    : process.env.REACT_APP_BACKEND_LIVE_API;

  // Rotate fake challenges every 3 seconds
  useEffect(() => {
    // Generate initial set of fake challenges
    const generateNewSet = () => {
      const newFakes = Array.from({ length: 5 }, () => generateFakeChallenge());
      setFakeChallenges(newFakes);
      setCurrentFake(newFakes[0]);
    };

    generateNewSet();

    // Rotate through fake challenges every 3 seconds
    const rotateInterval = setInterval(() => {
      setFakeChallenges(prev => {
        if (prev.length === 0) return prev;
        const [first, ...rest] = prev;
        const newArray = [...rest, first];
        setCurrentFake(newArray[0]);
        return newArray;
      });
    }, 3000);

    // Refresh fake challenges every 30 seconds
    const refreshInterval = setInterval(generateNewSet, 30000);

    return () => {
      clearInterval(rotateInterval);
      clearInterval(refreshInterval);
    };
  }, []);

  return (
    <div>
      {/* Real challenge (if any) */}
      {runnig && (
        <ChallengeCard
          challenge={runnig}
          user={user}
          winnAmount={winnAmount}
          game_type={game_type}
          backendUrl={backendUrl}
        />
      )}
      {/* Fake challenge (always visible) */}
      <ChallengeCard
        challenge={currentFake}
        user={user}
        winnAmount={winnAmount}
        game_type={game_type}
        backendUrl={backendUrl}
      />
    </div>
  );
}