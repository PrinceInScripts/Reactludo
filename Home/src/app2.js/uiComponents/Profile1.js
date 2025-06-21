import React, { useEffect, useState } from 'react';
import "../css/layout.css";
import css from "../css/Profile.module.css";
import axios from 'axios';
import Rightcontainer from "../Components/Rightcontainer";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Swal from "sweetalert2";
import { useHistory } from 'react-router-dom';
import Header from '../Components/Header';
import { Link } from 'react-router-dom';
const Profile1 = () => {
  const backendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
  const backendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  const nodeMode = process.env.NODE_ENV;
  const baseUrl = nodeMode === 'development' ? backendLocalApiUrl : backendLiveApiUrl;

  const [referral, setCode] = useState('');
  const [Id, setId] = useState(null);
  const [profile, setProfile] = useState();
  const [portcss, setPortcss] = useState(css.active_tab);
  const [portcss1, setPortcss1] = useState(css.inactive_tab);
  const [portcssEmail, setPortcssEmail] = useState(css.active_tab);
  const [portcssEmail1, setPortcssEmail1] = useState(css.inactive_tab);
  const [holder_name, setHolder_name] = useState();
  const [account_number, setAccount_number] = useState();
  const [ifsc_code, setIfsc_code] = useState();
  const [upi_id, setUpi_id] = useState();
  const [Name, setName] = useState();
  const [Email, setEmail] = useState();
  const history = useHistory();
  
  const logout = () => {
    let access_token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${access_token}` };

    axios
      .post(baseUrl + 'logout', {}, { headers })
      .then(() => {
        localStorage.removeItem('token');
        history.push('/login');
        window.location.reload(true);
        toast.success('Logout successful!', { autoClose: 3000 });
      })
      .catch((e) => {
        console.error(e);
        // Don't show the error to the user
        toast.error('Logout failed. Something went wrong!', { autoClose: 3000, hideProgressBar: true });
      });
  };

  const UserALL = async () => {
    try {
      let access_token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${access_token}` };

      const response = await axios.get(baseUrl + 'me', { headers });
      setProfile(response.data);
      setId(response.data._id);
      TotalGame(response.data._id);
      setName(response.data.Name);
      setEmail(response.data.Email);
      setCode(response.data.referral);
      setHolder_name(response.data.holder_name);
      setAccount_number(response.data.account_number);
      setIfsc_code(response.data.ifsc_code);
      setUpi_id(response.data.upi_id);
    } catch (error) {
      console.error('Error fetching user data:', error);

      toast.error('Website Undermaintance. For Sometime.', { autoClose: 3000, hideProgressBar: true });
    }
  };
  

 
  const UpdateProfile = async () => {
    const access_token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${access_token}` };

    try {
      const { data } = await axios.patch(baseUrl + 'user/edit', { Name }, { headers });
      if (data === 'User name already exist!') {
        toast.error(data, { autoClose: 3000 });
      } else {
        setName(data);
        UserALL();
        toast.success('Name updated successfully!', { autoClose: 3000 });
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong!', { autoClose: 3000 });
    }
  };
  const UpdateProfile2 = async () => {
    const access_token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${access_token}` };

    try {
      const { data } = await axios.patch(baseUrl + 'user/edit', { Email }, { headers });
      if (data === 'email already exist!') {
        toast.error(data, { autoClose: 3000 });
      } else {
          if(data === 'Invalid email address!'){
              toast.error(data, { autoClose: 3000 });
          }else{
             setEmail(data);
        UserALL();
        toast.success('Email updated successfully!', { autoClose: 3000 });  
          }
          
       
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong!', { autoClose: 3000 });
    }
  };


  // Total game
  const [total, setTotal] = useState();

  const TotalGame = (Id) => {
    let access_token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${access_token}` };

    axios
      .get(baseUrl + `total/user/all/${Id}`, { headers })
      .then((res) => {
        setTotal(res.data);
      })
      .catch((e) => {
        console.error(e);
      });
  };

   const Result = async (file) => {
    if (file) {
      const access_token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${access_token}` };

      const formData = new FormData();
      formData.append('avatar', file);

      try {
        await fetch(baseUrl + 'users/me/avatar', {
          method: 'POST',
          body: formData,
          headers,
        });

        UserALL();
        toast.success('Profile photo updated successfully!', { autoClose: 3000 });
      } catch (error) {
        console.error(error);
        toast.error('Failed to update profile photo. Something went wrong!', { autoClose: 3000 });
      }
    }
  };

  
  useEffect(() => {
    UserALL();
  }, []);
  
  
const isVerified = profile && profile.verified === 'verified';
  const isPending = profile && profile.verified === 'pending';
  const isUnverified = profile && profile.verified === 'unverified';

  const borderColor = isVerified ? 'green' : 'red';
  const buttonColor = isVerified ? 'green' : 'red';
  const buttonText = isVerified ? 'Verified' : isPending ? 'In Process' : 'Complete KYC';
  const statusText = isVerified ? 'Completed' : isPending ? ' In Process' : ' Pending';
  const statusColor = isVerified ? 'green' : 'red';

  
  
  
  return (
  
        <>
             <Header user={profile} />
            <div className="leftContainer" style={{ minHeight: "100vh", height: "100%" }}>
             <div
          className={css.mainArea}
          style={{ paddingTop: "55px", minHeight: "100vh" }}
        >     
  
         <div className="card mt-3" style={{ 
    border: '1px solid rgb(204, 204, 204)', 
    width: '93%', 
    margin: '0 auto',
    boxShadow: '0px 0px 10px darkblue' 
}}>
    <div className="card-header text-center" style={{ 
        fontWeight: 'bold',  
        fontSize: '14px', 
        letterSpacing: '0.9px', 
        backgroundColor: '#f8f9fb', 
        padding: '8px 16px',
        textAlign: 'center', 
        background: 'light'  
    }}>
        Profile
    </div>


     <div className="card-body p-2">
  <div className="text-center position-relative">
    <label style={{ position: 'relative', display: 'inline-block' }}>
      <input className='d-none' type="file" onChange={(e) => Result(e.target.files[0])} accept="image/*" required />
      <picture style={{ position: 'relative', display: 'inline-block' }}>
        {console.log(process.env.PUBLIC_URL)}
        {profile && profile.avatar ? (
          <img height="80px" width="80px" src={baseUrl + `${profile && profile.avatar}`} alt="" style={{ borderRadius: '50px' }} />
        ) : (
          <img height="80px" width="80px" src="/khelobuddy/logo.png" alt="" style={{ borderRadius: '50px' }} />
        )}
       {/* Edit Button Overlay */}
      <div
        style={{
          position: 'absolute',
          bottom: 3,
          left: 59,
          background: '#007bff',
          borderRadius: '50%',
          padding: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 5px rgba(0,0,0,0.2)',
          cursor: 'pointer',
        }}
      >
        <i className="fa fa-pencil text-white" />
      </div>
      </picture>
    </label>
    </div> 
 <div className={`text-none my-1 ${portcss} font-weight-none`} style={{ fontSize: '1em', color: '#000000', padding: '1px' }}>
  <label className="form-label text-capitalize">Username</label>
  <div className="align-self-stretch" style={{ position: 'relative' }}>
    <input
      type="text"
      className="form-control"
      value={profile ? profile.Name : 'N/A'}
      readOnly
      disabled
      style={{ width: 'calc(100% - 54px)', borderColor: 'lightgrey', height: '30px', borderWidth: '0.5px', borderRadius: '5px' }}
    />
    <div
      className={css.fixedButtons}
      onClick={() => {
        setPortcss(css.inactive_tab);
        setPortcss1(css.active_tab);
      }}
      style={{ position: 'absolute', right: 0, top: '0.5px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '30px' }}
    >
      Edit
    </div>
  </div>
</div>

<div className={`text-bold my-1 ${portcss1}`} style={{ backgroundColor: '#fff', padding: '8px', borderRadius: '5px' }}>
  <div className={`${css.MuiFormControl_root} ${css.MuiTextField_root}`} style={{ verticalAlign: 'bottom' }}>
    <label className="form-label text-capitalize">Username</label>
    <input
      aria-invalid="false"
      type="text"
      placeholder={profile && profile.Name ? profile.Name : 'Enter username'}
      value={Name}
      onChange={(e) => {
        const value = e.target.value;
        // Define forbidden suffixes
        const forbiddenSuffixes = ['.com', '.co', '.in', '.club', '.live'];
        // Check if the value length is up to 14 characters and does not end with forbidden suffixes
        const isValid = value.length <= 14 && !forbiddenSuffixes.some(suffix => value.endsWith(suffix));
        if (isValid) {
          setName(value);
        }
      }}
      className={css.inputField}
      style={{ borderColor: 'lightgrey', height: '30px' }}
    />
  </div>
  <div
    className={css.fixedButton}
    style={{ padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '30px' }} // Adjusted padding value and centered text
    onClick={() => {
      setPortcss(css.active_tab);
      setPortcss1(css.inactive_tab);
      UpdateProfile(Id);
    }}
  >
    Save
  </div>
</div>

<div className={`text-none my-1 ${portcssEmail} font-weight-none`} style={{ fontSize: '1em', color: '#000000', padding: '1px' }}>
  <label className="form-label text-capitalize">Email ID</label>
  <div className="align-self-stretch" style={{ position: 'relative' }}>
    <input
      type="text"
      className="form-control"
      value={profile ? profile.Email : 'N/A'}
      readOnly
      disabled
      style={{ width: 'calc(100% - 54px)', borderColor: 'lightgrey', height: '30px', borderWidth: '0.5px', borderRadius: '5px' }}
    />
    <div
      className={css.fixedButtonss}
      onClick={() => {
        setPortcssEmail(css.inactive_tab);
        setPortcssEmail1(css.active_tab);
      }}
      style={{ position: 'absolute', right: 0, top: '0.5px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '30px' }}
    >
      Edit
    </div>
  </div>
</div>

<div className={`text-bold my-1 ${portcssEmail1}`} style={{ backgroundColor: '#fff', padding: '8px', borderRadius: '5px' }}>
  <div className={`${css.MuiFormControl_root} ${css.MuiTextField_root}`} style={{ verticalAlign: 'bottom' }}>
    <label className="form-label text-capitalize">Email ID</label>
    <input
      aria-invalid="false"
      type="text"
      maxLength={35}
      placeholder={profile && profile.Email ? profile.Email : 'Enter email address'}
      value={Email}
      onChange={(e) => setEmail(e.target.value)}
      className={css.inputField}
      style={{ borderColor: 'lightgrey', height: '30px' }}
    />
  </div>
  <div
    className={css.fixedButtonsss}
    style={{ padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '30px' }} // Adjusted padding value and centered text
    onClick={() => {
      setPortcssEmail(css.active_tab);
      setPortcssEmail1(css.inactive_tab);
      UpdateProfile2(Id);
    }}
  >
    Save
  </div>
</div>

<div className={`text-none my-1`} style={{ fontSize: '1em', color: '#000000', padding: '1px' }}>
  <label className="form-label text-capitalize">Mobile Number</label>
  <div className="align-self-stretch">
    <input
      type="text"
      className="form-control"
      readOnly
      disabled
      value={profile && profile.Phone !== undefined ? profile.Phone : 'N/A'}
      style={{ borderColor: 'lightgrey', height: '30px', borderRadius: '5px' }}
    />
  </div>
</div>


<br />
 <div className="" style={{ border: `1px solid ${borderColor}`, borderRadius: '5px' }}>
  <Link to={isUnverified ? "/Kyc2" : "/Profile"} className="w-100 p-3 d-block">
    <div className="d-flex justify-content-between align-items-center">
      <div className="Profile_mytext__hcLxx kyc-status-profile">
        <p className="mb-0 kyc-status-profiles" style={{ fontFamily: 'Poppins', fontWeight: 'bold' }}>KYC status</p>
        <div style={{ color: statusColor, fontSize: '18px', fontWeight: 'bold' }}>
          {statusText}&nbsp;
          {statusColor === 'green' ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="green">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill={statusColor}>
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"></path>
            </svg>
          )}
        </div>
      </div>
      <div>
        <button className="kyc-btn" style={{ backgroundColor: 'white', borderColor: buttonColor, color: buttonColor, borderRadius: '3px', border: `1px solid ${buttonColor}`, height: '30px', display: 'flex', alignItems: 'center' }}>
          <b>{buttonText}</b>
        </button>
      </div>
    </div>
  </Link>
</div>
    </div> 
</div>
    

<div className="card mt-3" style={{ border: '1px solid #ccc', width: '93%', margin: '0 auto', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2), 0 6px 20px rgba(0, 0, 0, 0.19)' }}>
   <div className="card-header text-center" style={{ fontWeight: 'bold', fontSize: '14px', letterSpacing: '0.9px', backgroundColor: '#f8f9fb', padding: '8px 16px', margin: 'top' }}>Metrics</div>
   
    <div className="d-flex flex-wrap justify-content-between">
        <div className="flex-grow-1 flex-basis-50 p-2">
            <div className="card mt-0" style={{ border: '1px solid #ccc', width: '100%', margin: '0 auto', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2), 0 6px 20px rgba(0, 0, 0, 0.19)' }}>
                <div className="card-header text-left" style={{ fontWeight: 500, fontSize: '12px', letterSpacing: '0.9px', backgroundColor: '#f2f2f2', padding: '8px 16px', color: '#333' }}>
                    <div className="d-flex align-items-center gap-1">
                        <img src="https://i.postimg.cc/7ZxsmLJm/Cashwon.webp" alt="" width="15px" />&nbsp;
                       <span style={{ color: '#333' }}>Games Played</span>
                    </div>
                </div>
                <div className="px-3 py-1">
                    <span style={{ fontSize: '1em', color: '#333', fontWeight: 'bold' }}>{total || total === 0 ? total : 0}</span>
                </div>
            </div>

            <div className="card mt-2" style={{ border: '1px solid #ccc', width: '100%', margin: '0 auto', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2), 0 6px 20px rgba(0, 0, 0, 0.19)' }}>
                <div className="card-header text-left" style={{ fontWeight: 500, fontSize: '12px', letterSpacing: '0.9px', backgroundColor: '#f2f2f2', padding: '8px 16px', color: '#333' }}>
                    <div className="d-flex align-items-center gap-1">
                        <img src="https://i.postimg.cc/NMSxtwnF/1704228936578.png" alt="" width="15px" />&nbsp;
                        <span style={{ color: '#333' }}>Referral Earning</span>
                    </div>
                </div>
                <div className="px-3 py-1">
                  <span style={{ fontSize: '1em', color: '#333', fontWeight: 'bold' }}>
  {profile ? profile.referral_earning.toFixed(0) : '0'}
</span>  
                </div>
            </div>
        </div>

        <div className="flex-grow-1 flex-basis-50 p-2">
            <div className="card mt-0" style={{ border: '1px solid #ccc', width: '100%', margin: '0 auto', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2), 0 6px 20px rgba(0, 0, 0, 0.19)' }}>
                <div className="card-header text-left" style={{ fontWeight: 500, fontSize: '12px', letterSpacing: '0.9px', backgroundColor: '#f2f2f2', padding: '8px 16px', color: '#333' }}>
                    <div className="d-flex align-items-center gap-1">
                        <img src="https://i.postimg.cc/9FK7x8k0/Cash-won.png" alt="" width="15px" />&nbsp;
                        <span style={{ color: '#333' }}>Total Cash won</span>
                    </div>
                </div>
                <div className="px-3 py-1">
                  <span style={{ fontSize: '1em', color: '#333', fontWeight: 'bold' }}>{(profile && profile.wonAmount !== undefined ? profile.wonAmount.toFixed(1) : 0)}</span>  
                </div>
            </div>

            <div className="card mt-2" style={{ border: '1px solid #ccc', width: '100%', margin: '0 auto', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2), 0 6px 20px rgba(0, 0, 0, 0.19)' }}>
                <div className="card-header text-left" style={{ fontWeight: 500, fontSize: '12px', letterSpacing: '0.9px', backgroundColor: '#f2f2f2', padding: '8px 16px', color: '#333' }}>
                    <div className="d-flex align-items-center gap-1">
                        <img src="https://i.postimg.cc/tC3z8XdR/penalty.png" alt="" width="15px" />&nbsp;
                        <span style={{ color: '#333' }}>Penalty</span>
                    </div>
                </div>
                <div className="px-3 py-1">
                    <span style={{ fontSize: '1em', color: '#333', fontWeight: 'bold' }}>0</span>
                </div>
            </div>
        </div>
    </div>
</div>

<div className="p-3 snipcss-A1eLC snip-div">
    <button
    className="w-100"
    style={{
        background: 'none',
        border: '1px solid rgb(220, 53, 69)',
        color: 'rgb(220, 53, 69)',
        padding: '8px',
        borderRadius: '8px',
    }}
    onClick={() => {
        Swal.fire({
            title: 'Are you sure you want to logout ?',
            showCancelButton: true,
            showDenyButton: true,
            confirmButtonColor: 'red',
            denyButtonColor: 'transparent',
            cancelButtonColor: 'grey',
            confirmButtonText: 'Confrim          ',
            denyButtonText: '        ',
            cancelButtonText: '          Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                logout();
            }
        });
    }}
>
    Logout
</button>
</div>
</div>

     <ToastContainer
  style={{ marginBottom: '25px' }}
  position="bottom-right"
  autoClose={3000}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
  theme="light"
/>
      <div className="rightContainer">
        <Rightcontainer />
      </div>
      {/* <ModalProfile style3={
                profileModalstyle
            } Enter={Enter}/> */}
      <div className={css.kyc_select} id="profileModal">
        <div className={css.overlay} />
        <div
          className={`${css.box}`}
          style={{
            bottom: "0px",
            position: "absolute",
          }}
        >
         <div className={css.bg_white}>
            <div className={`${css.header} ${css.cxy} ${css.flex_column}`}>
            </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

};
export default Profile1;
