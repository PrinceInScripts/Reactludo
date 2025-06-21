import React from 'react';
import { Link } from 'react-router-dom'; // Import Link component
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const App3 = () => {
  return (
    <>
      <title>Server Maintenance</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=0.85,maximum-scale=0.85"/><meta name="theme-color" content="#000000"/>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap" rel="stylesheet" />
      <style
        type="text/css"
        dangerouslySetInnerHTML={{
          __html: `
            body {
              font-family: 'Poppins', sans-serif; /* Change font-family to Poppins */
              background-color: #2c3e50; /* Dark background color */
              color: #000000; /* Light text color */
              margin: 0px;
            }
            section {
              text-align: center;
              height: 100vh;
              width: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              flex-direction: column;
              background-color: #fff; /* Blue background color */
              border-radius: 10px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
              padding: 20px;
            }
            h2, p {
              margin: 0px;
            }
            h2 {
              font-size: 62px;
              padding-top: 20px;
            }
            p {
              font-size: 40px;
              padding-bottom: 20px;
            }
            img {
              max-width: 100%;
              border-radius: 10px;
              margin-top: 20px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            }
            a {
              background: #e74c3c; /* Red button color */
              border-radius: 4px;
              outline: none;
              border: 0px;
              color: #fff;
              font-size: 34px;
              cursor: pointer;
              text-decoration: none;
              padding: 10px 25px;
              margin-top: 20px;
              display: inline-block;
              transition: background-color 0.3s ease;
            }
            a:hover {
              background-color: #c0392b; /* Darker red on hover */
            }
            @media(max-width: 625px) {
              h2 {
                font-size: 50px;
              }
              p {
                font-size: 30px;
              }
            }
            @media(max-width: 492px) {
              h2 {
                font-size: 30px;
              }
              a {
                font-size: 25px;
              }
              p {
                font-size: 25px;
                line-height: 26px;
              }
            }
          `,
        }}
      />
      <section>
        <img src={process.env.PUBLIC_URL + "/Maintenance.jpg"} alt="Under Maintenance" />
        <h2>Under Maintenance</h2>
        <div className="alert alert-warning mt-1 pt-1" role="alert">
          <strong>
            We apologize for the inconvenience. Our systems are undergoing maintenance, and some features may be temporarily unavailable. We appreciate your patience and understanding. Thank you.
          </strong>
        </div>
       <Link className="btn btn-secondary btn-block btn-custom-padding font-weight-bold text-dark" to="/contact-us">Contact Us</Link>

      </section>
    </>
  );
};

export default App3;