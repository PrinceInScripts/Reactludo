import React from 'react'
import "../css/layout.css"
import Header from '../Components/Header'
import "../css/help.css"
import Rightcontainer from '../Components/Rightcontainer'



const Help = () => {
  return (
    <div>
        <div className="leftContainer">
             <div><Header/></div>


            <div className="container mt-5">
            <div className="row">
                <div className="col-12 mt-5 pt-5 video">
                <br />
                <p><iframe frameBorder={0} src="" width={310} height={300} className="note-video-clip" /><br /></p>
                </div>
                <div className="col-12 my-5 text-center font-weight-bold">
                <a className="text-success" href="https://web.whatsapp.com/send?phone=&text=Hi admin, I need help.&app_absent=0" target="_blank">
                    <i className="fab fa-whatsapp text-success" /> Click here to contact Admin</a>
                </div>
            </div>
            </div>
          
        </div>
       <div className='rightContainer'>
         <Rightcontainer/>
       </div>
    </div>
  )
}

export default Help