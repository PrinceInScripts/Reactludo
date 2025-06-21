import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/kyc.css';
import '../css/Loader.css';

const Kyc2 = ({ user }) => {
  const history = useHistory();
  const [frontLoaded, setfrontLoaded] = useState(null);
  const [backLoaded, setbackLoaded] = useState(null);
  const [Name, setName] = useState('');
  const [Email, setEmail] = useState('');
  const [Number, setNumber] = useState('');
  const [DOB, setDob] = useState('');
  const [process, setProcess] = useState(false);

  let aadharProcess = useRef(false);
  const baseUrl = "http://localhost:5011/";

  const handleSubmitdata = (e) => {
    e.preventDefault();

    if (user.verified === "unverified" &&!aadharProcess.current) {
      setProcess(true);
      aadharProcess.current = true;

      const formData = new FormData();
      formData.append("Name", Name);
      formData.append("Email", Email);
      formData.append("Number", Number);
      formData.append("DOB", DOB);
      formData.append("front", frontLoaded);
      formData.append("back", backLoaded);

      if (frontLoaded && backLoaded) {
        const access_token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${access_token}` };

        axios.post(`${baseUrl}aadharcard`, formData, { headers })
         .then((res) => {
            if (res.data.msg === false) {
              toast.error("Duplicate Entity");
            } else {
              toast.success("Your KYC form submitted");
              history.push("/Profile");
            }
            aadharProcess.current = false;
            setProcess(false);
          }).catch((e) => {
            if (e.response && e.response.status === 401) {
              localStorage.removeItem('token');
              window.location.reload();
              history.push("/login");
            }
            aadharProcess.current = false;
            setProcess(false);
          });
      } else {
        aadharProcess.current = false;
        setProcess(false);
        toast.error('Please fill all fields');
      }
    } else {
      toast.error('Your request is in process or you have already submitted a request.');
    }
  };

  useEffect(() => {
    const frontPhoto = document.getElementById('frontPhoto');
    frontPhoto.onchange = e => {
      const [file] = frontPhoto.files;
      setfrontLoaded(file);
    };

    const backPhoto = document.getElementById('backPhoto');
    backPhoto.onchange = e => {
      const [file] = backPhoto.files;
      setbackLoaded(file);
    };
  }, []);

  return (




<div className="container-fluid" style={{ padding: "60px 1rem 1rem" }}>
   <div className="pt-1 mb-5">
    <div className="card" style={{ border: "1px solid #ccc" }}>
      <div className="card-header text-center" style={{ fontWeight: "bold", fontSize: "15px", letterSpacing: "0.3px", fontFamily: "Poppins" }}>
        KYC
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmitdata}>
          <div className="mb-3 d-flex flex-column align-items-start">
            <label className="form-label" htmlFor="Name" style={{ color: "#212529", fontFamily: "Poppins" }}>Enter Name</label>
            <input type="text" id="Name" className="form-control" placeholder="Enter name" value={Name} onChange={(e) => setName(e.target.value)} required style={{ border: "1px solid #ced4da", borderRadius: "5px" }} />
          </div>
          <div className="mb-3 d-flex flex-column align-items-start">
            <label className="form-label" htmlFor="Email" style={{ color: "#212529", fontFamily: "Poppins" }}>Enter Email</label>
            <input type="email" id="Email" className="form-control" placeholder="Enter email" value={Email} onChange={(e) => setEmail(e.target.value)} required style={{ border: "1px solid #ced4da", borderRadius: "5px" }} />
          </div>
          <div className="mb-3 d-flex flex-column align-items-start">
            <label className="form-label" htmlFor="DOB" style={{ color: "#212529", fontFamily: "Poppins" }}>Enter Date of Birth</label>
            <input type="date" id="DOB" className="form-control" value={DOB} onChange={(e) => setDob(e.target.value)} required style={{ border: "1px solid #ced4da", borderRadius: "5px" }} />
          </div>
          <div className="mb-3 d-flex flex-column align-items-start">
            <label className="form-label" htmlFor="Number" style={{ color: "#212529", fontFamily: "Poppins" }}>Enter Aadhar Number</label>
            <input type="tel" id="Number" className="form-control" placeholder="Enter Aadhar Number" maxLength="14" pattern="\d{12}" onChange={(e) => setNumber(e.target.value)} required style={{ border: "1px solid #ced4da", borderRadius: "5px" }} />
            <small className="form-text text-muted">Aadhar number must be 12 digits.</small>
          </div>
          <div className="mb-3 d-flex flex-column align-items-start">
            <label className="form-label" htmlFor="frontPhoto" style={{ color: "#212529", fontFamily: "Poppins" }}>Front Image</label>
            <input id="frontPhoto" name="frontPhoto" type="file" className="form-control-file" accept="image/*" required style={{ border: "1px solid #ced4da", borderRadius: "5px" }} />
            {frontLoaded && (
              <div className="mt-2" style={{ border: "2px solid #007bff", padding: "12px", borderRadius: "8px", backgroundColor: "#e9ecef" }}>
                <div className="d-flex align-items-center">
                  <img src="/images/file-icon.png" width="30px" alt="" className="mr-2" />
                  <div>
                    <div>{frontLoaded.name}</div>
                    <div>{(frontLoaded.size / 1024 / 1024).toFixed(2)} MB</div>
                  </div>
                  <button type="button" className="btn btn-link ml-auto" onClick={() => setfrontLoaded(null)}>
                    <img src="https://i.postimg.cc/HnKw1T9S/free-cancel-207-433817.png" width="25px" alt="Remove" />
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="mb-3 d-flex flex-column align-items-start">
            <label className="form-label" htmlFor="backPhoto" style={{ color: "#212529", fontFamily: "Poppins" }}>Back Image</label>
            <input id="backPhoto" name="backPhoto" type="file" className="form-control-file" accept="image/*" required style={{ border: "1px solid #ced4da", borderRadius: "5px" }} />
            {backLoaded && (
              <div className="mt-2" style={{ border: "2px solid #007bff", padding: "12px", borderRadius: "8px", backgroundColor: "#e9ecef" }}>
                <div className="d-flex align-items-center">
                  <img src="/images/file-icon.png" width="30px" alt="" className="mr-2" />
                  <div>
                    <div>{backLoaded.name}</div>
                    <div>{(backLoaded.size / 1024 / 1024).toFixed(2)} MB</div>
                  </div>
                  <button type="button" className="btn btn-link ml-auto" onClick={() => setbackLoaded(null)}>
                    <img src="https://i.postimg.cc/HnKw1T9S/free-cancel-207-433817.png" width="25px" alt="Remove" />
                  </button>
                </div>
              </div>
            )}
          </div>
        <div className="text-left" style={{ fontFamily: "Poppins", marginBottom: "0.3rem", fontSize: "0.8rem" }}>
          <label style={{ display: "flex", alignItems: "left" }}>
            <input 
              type="checkbox" 
              required 
              style={{ 
                margin: "0", 
                width: "12px", /* Adjust the width */
                height: "12px", /* Adjust the height */
                verticalAlign: "middle" /* Align with the text */
              }} 
            />
            <span style={{ marginLeft: "0.3rem", lineHeight: "1.2" }}>
              By continuing, you agree to our <a href="/term-condition" style={{ textDecoration: "underline", fontFamily: "Poppins" }}>Legal Terms</a> and you are 18 years or older.
            </span>
          </label>
        </div>
        <div className="d-grid py-3">
<button type="submit" className="btn" style={{ backgroundColor: "#007AFF", borderRadius: "5px", color: "#FFFFFF !important", fontWeight: "bold", fontSize: "3.1rem", width: "100%", padding: "10px" }}>
 <span style={{ color: '#fff', fontWeight: 'bold' }}> Request for KYC
</span>
</button>
        </div>
      </form>
    </div>
  </div>

  {process && (
    <div className="loaderReturn" style={{ zIndex: "99", display: "flex", flexDirection: "column", alignItems: "center", marginTop: "20px" }}>
      <p style={{ marginTop: "10px" }}>Please Wait...</p>
      <img src="https://i.postimg.cc/W1LyHCmH/Proccess.gif" style={{ width: "60%" }} alt="Loading" />
    </div>
  )}

  <ToastContainer
    style={{ marginTop: '1px' }}
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
</div></div>
  );
}; 
export default Kyc2;