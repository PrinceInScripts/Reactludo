const mongoose = require("mongoose");

const SiteSettingsSchema = new mongoose.Schema({
    // Basic Information
    WebTitle: {
        type: String,
        default: ""
    },
    WebsiteName: {
        type: String,
        default: ""
    },
    CompanyName: {
        type: String,
        default: ""
    },
    CompanyMobile: {
        type: String,
        default: ""
    },
    CompanyEmail: {
        type: String,
        default: ""
    },
    CompanyWebsite: {
        type: String,
        default: ""
    },
    CompanyAddress: {
        type: String,
        default: ""
    },
    
    // Logos
    Logo: {
        type: String,
        default: null
    },
    SmallLogo: {
        type: String,
        default: null
    },
    
    // Landing Images
    LandingImage1: {
        type: String,
        default: null
    },
    LandingImage2: {
        type: String,
        default: null
    },
    LandingImage3: {
        type: String,
        default: null
    },
    LandingImage4: {
        type: String,
        default: null
    },
    isLandingImage1: {
        type: Boolean,
        default: true
    },
    isLandingImage2: {
        type: Boolean,
        default: true
    },
    isLandingImage3: {
        type: Boolean,
        default: true
    },
    isLandingImage4: {
        type: Boolean,
        default: true
    },
    
    // Version
    version: {
        type: String,
        default: "1.0.0"
    },
    
    // Notices
    DepositNotice: {
        type: String,
        default: ""
    },
    WithdrawNotice: {
        type: String,
        default: ""
    },
    HomepageNotice: {
        type: String,
        default: ""
    },
    MainpageNotice: {
        type: String,
        default: ""
    },
    isDepositNoticeActive: {
        type: Boolean,
        default: true
    },
    isWithdrawNoticeActive: {
        type: Boolean,
        default: true
    },
    isHomepageNoticeActive: {
        type: Boolean,
        default: true
    },
    isMainpageNoticeActive: {
        type: Boolean,
        default: true
    },
    
    // Maintenance Mode
    isMaintenanceMode: {
        type: Boolean,
        default: false
    },
    MaintenanceMessage: {
        type: String,
        default: "Website is under maintenance. Please try again later."
    }
}, { 
    timestamps: true 
});

const SiteSettings = mongoose.model("SiteSettings", SiteSettingsSchema);
module.exports = SiteSettings;