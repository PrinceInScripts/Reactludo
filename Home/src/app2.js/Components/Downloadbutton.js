import React, { useEffect, useState } from 'react';
import "./Component-css/Downloadbutton.css?v=0.1";

const Downloadbutton = () => {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState(null);

  useEffect(() => {
    const handler = e => {
      e.preventDefault();
      console.log("we are being triggered :D");
      setSupportsPWA(true);
      setPromptInstall(e);
    };
    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("transitionend", handler);
  }, []);

  const onClick = evt => {
    evt.preventDefault();
    if (!promptInstall) {
      return;
    }
    promptInstall.prompt();
  };

  if (!supportsPWA) {
    return null;
  }

  return (
    <div
      className="my-stickey-footer"
      style={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        maxWidth: 480,
      }}
    >
      <div className="text-center" style={{ zoom: "1.2", padding: "13px 0px" }}>
        <button onClick={onClick} className="btn btn-white btn-sm" style={{ backgroundColor: 'Green', color: 'white', fontWeight: 1000, position: 'relative' }}>
          <span style={{ fontSize: '12px', color: 'rgb(255, 255, 255)', position: 'relative', zIndex: '1' }}>
           
            <img
        src="https://skillclash.in/Images/android.png"
        alt=""
        style={{ marginRight: 10 }}
        width="15px"
        
      />
            Download Our App
            <span class="shine"></span>
        
          <img
            src="https://Skillclash.in/Images/dowloadIcon.png"
            alt=""
            style={{ marginLeft: 10 }}
            width="20px"
          />
          </span>
        </button>
      </div>
    </div>
  );
}

export default Downloadbutton;
