import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Gateway from "./Gateway";

export const Sitesettings = () => {
  // All settings in a single state object
  const [settings, setSettings] = useState({
    // Basic Information
    WebTitle: "",
    WebsiteName: "",
    CompanyName: "",
    CompanyAddress: "",
    CompanyMobile: "",
    CompanyEmail: "",
    CompanyWebsite: "",
    Logo: "",
    SmallLogo: "",
    version: "",
    settingId: "",
    
    // Notices
    DepositNotice: "",
    WithdrawNotice: "",
    HomepageNotice: "",
    MainpageNotice: "",
    isDepositNoticeActive: true,
    isWithdrawNoticeActive: true,
    isHomepageNoticeActive: true,
    isMainpageNoticeActive: true,
    
    // Maintenance Mode
    isMaintenanceMode: false,
    MaintenanceMessage: "Website is under maintenance. Please try again later."
  });

  // For logo previews
  const [previews, setPreviews] = useState({
    Logo: "",
    SmallLogo: ""
  });

  // Loading states
  const [loading, setLoading] = useState(false);
  const [logoLoading, setLogoLoading] = useState(false);

  const baseUrl = process.env.NODE_ENV === "development" 
    ? process.env.REACT_APP_BACKEND_LOCAL_API 
    : process.env.REACT_APP_BACKEND_LIVE_API;

  // File input refs
  const fileRefs = {
    Logo: useRef(null),
    SmallLogo: useRef(null)
  };

  // Fetch settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(baseUrl + "settings/data");
        const data = res.data;
        
        setSettings(prev => ({
          ...prev,
          // Basic Info
          settingId: data._id || '',
          WebTitle: data.WebTitle || '',
          WebsiteName: data.WebsiteName || '',
          CompanyName: data.CompanyName || '',
          CompanyAddress: data.CompanyAddress || '',
          CompanyMobile: data.CompanyMobile || '',
          CompanyEmail: data.CompanyEmail || '',
          CompanyWebsite: data.CompanyWebsite || '',
          Logo: data.Logo || '',
          SmallLogo: data.SmallLogo || '',
          version: data.version || '',
          
          // Notices
          DepositNotice: data.DepositNotice || '',
          WithdrawNotice: data.WithdrawNotice || '',
          HomepageNotice: data.HomepageNotice || '',
          MainpageNotice: data.MainpageNotice || '',
          isDepositNoticeActive: data.isDepositNoticeActive ?? true,
          isWithdrawNoticeActive: data.isWithdrawNoticeActive ?? true,
          isHomepageNoticeActive: data.isHomepageNoticeActive ?? true,
          isMainpageNoticeActive: data.isMainpageNoticeActive ?? true,
          
          // Maintenance Mode
          isMaintenanceMode: data.isMaintenanceMode ?? false,
          MaintenanceMessage: data.MaintenanceMessage || "Website is under maintenance. Please try again later."
        }));

        // Set previews for existing logos
        setPreviews({
          Logo: data.Logo ? `${baseUrl}uploads/${data.Logo}` : '',
          SmallLogo: data.SmallLogo ? `${baseUrl}uploads/${data.SmallLogo}` : ''
        });
        
      } catch (error) {
        console.error("Error fetching settings:", error);
        alert("Failed to load settings");
      }
    };
    fetchSettings();
  }, [baseUrl]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle logo file selection with preview
  const handleLogoChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviews(prev => ({
          ...prev,
          [name]: event.target.result
        }));
      };
      reader.readAsDataURL(files[0]);
      
      // Store the file object in state
      setSettings(prev => ({
        ...prev,
        [name]: files[0]  // Store the actual file object
      }));
    }
  };

  // Remove selected logo
  const removeLogo = (fieldName) => {
    setPreviews(prev => ({ ...prev, [fieldName]: '' }));
    setSettings(prev => ({ ...prev, [fieldName]: '' }));
    if (fileRefs[fieldName].current) {
      fileRefs[fieldName].current.value = '';
    }
  };

  // Save only logos
  const saveLogos = async () => {
    try {
      setLogoLoading(true);
      const formData = new FormData();
      
      // Append logo files if they exist
      if (settings.Logo instanceof File) {
        formData.append("Logo", settings.Logo);
      }
      if (settings.SmallLogo instanceof File) {
        formData.append("SmallLogo", settings.SmallLogo);
      }
      
      // Include settingId for update
      formData.append("settingId", settings.settingId);

      const response = await axios.post(baseUrl + "settings/logos", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if(response.data.status === 'success'){
        alert("Logos updated successfully!");
        // Update previews with new image paths
        if (response.data.Logo) {
          setPreviews(prev => ({ ...prev, Logo: `${baseUrl}uploads/${response.data.Logo}` }));
        }
        if (response.data.SmallLogo) {
          setPreviews(prev => ({ ...prev, SmallLogo: `${baseUrl}uploads/${response.data.SmallLogo}` }));
        }
      } else {
        alert("Failed to update logos");
      }
    } catch (error) {
      console.error("Error updating logos:", error);
      alert("Error updating logos");
    } finally {
      setLogoLoading(false);
    }
  };

  // Save all other settings (excluding logos)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      
      // Append all settings except logos
      Object.keys(settings).forEach(key => {
        if (key !== 'Logo' && key !== 'SmallLogo') {
          formData.append(key, settings[key]);
        }
      });

      const response = await axios.post(baseUrl + "settings", formData);
      
      if(response.data.status === 'success'){
        alert("Settings updated successfully!");
      } else {
        alert("Failed to update settings");
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      alert("Error updating settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card admin-card">
            <div className="card-header admin-card-header">
              <h3 className="text-uppercase font-weight-bold text-black mb-0">
                <i className="fas fa-cog me-2"></i>Website Settings
              </h3>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="card-body">
                {/* Basic Information Section */}
                <div className="mb-5">
                  <h4 className="section-header">
                    <i className="fas fa-info-circle me-2"></i>Basic Information
                  </h4>
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Website Title</label>
                      <input 
                        className="form-control admin-input" 
                        type="text" 
                        name="WebTitle"
                        value={settings.WebTitle} 
                        onChange={handleChange} 
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Website Name</label>
                      <input 
                        className="form-control admin-input" 
                        type="text" 
                        name="WebsiteName"
                        value={settings.WebsiteName} 
                        onChange={handleChange} 
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Challenge Notice</label>
                      <input 
                        className="form-control admin-input" 
                        type="text" 
                        name="CompanyName"
                        value={settings.CompanyName} 
                        onChange={handleChange} 
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">home notice</label>
                      <input 
                        className="form-control admin-input" 
                        type="text" 
                        name="CompanyAddress"
                        value={settings.CompanyAddress} 
                        onChange={handleChange} 
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Company Mobile</label>
                      <input 
                        className="form-control admin-input" 
                        type="text" 
                        name="CompanyMobile"
                        value={settings.CompanyMobile} 
                        onChange={handleChange} 
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Version</label>
                      <input 
                        className="form-control admin-input" 
                        type="text" 
                        name="version"
                        value={settings.version} 
                        onChange={handleChange} 
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Company Email</label>
                      <input 
                        className="form-control admin-input" 
                        type="email" 
                        name="CompanyEmail"
                        value={settings.CompanyEmail} 
                        onChange={handleChange} 
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Company Website</label>
                      <input 
                        className="form-control admin-input" 
                        type="url" 
                        name="CompanyWebsite"
                        value={settings.CompanyWebsite} 
                        onChange={handleChange} 
                      />
                    </div>
                  </div>
                </div>

                {/* Logos Section with Separate Save Button */}
                <div className="mb-5">
                  <h4 className="section-header">
                    <i className="fas fa-images me-2"></i>Logos
                  </h4>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Main Logo</label>
                      <input 
                        ref={fileRefs.Logo}
                        className="form-control admin-input" 
                        type="file" 
                        name="Logo" 
                        onChange={handleLogoChange}
                        accept="image/*"
                      />
                     
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Small Logo</label>
                      <input 
                        ref={fileRefs.SmallLogo}
                        className="form-control admin-input" 
                        type="file" 
                        name="SmallLogo" 
                        onChange={handleLogoChange}
                        accept="image/*"
                      />
                     
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 text-end">
                      <button 
                        type="button" 
                        className="btn btn-success px-4"
                        onClick={saveLogos}
                        disabled={logoLoading}
                      >
                        {logoLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Saving...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-save me-2"></i>Save Logos
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

               

                {/* Maintenance Mode Section */}
                <div className="mb-4">
                  <h4 className="section-header">
                    <i className="fas fa-tools me-2"></i>Maintenance Mode
                  </h4>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <div className="form-check form-switch">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          name="isMaintenanceMode"
                          checked={settings.isMaintenanceMode} 
                          onChange={handleChange} 
                          id="maintenanceMode"
                        />
                        <label className="form-check-label" htmlFor="maintenanceMode">
                          Enable Maintenance Mode
                        </label>
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Maintenance Message</label>
                      <textarea 
                        className="form-control admin-input" 
                        rows="2" 
                        name="MaintenanceMessage"
                        value={settings.MaintenanceMessage} 
                        onChange={handleChange} 
                        disabled={!settings.isMaintenanceMode}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="card-footer admin-card-footer">
                <button type="submit" className="btn btn-primary px-4" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save me-2"></i>Save Settings
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <Gateway />
    </div>
  );
};