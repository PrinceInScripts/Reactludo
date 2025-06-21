const SiteSettings = require("../Model/settings");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper function to process and save images
const processImage = async (file, folder = "icon") => {
  if (!file) return null;
  
  fs.access(`./public/${folder}`, (error) => {
    if (error) {
      fs.mkdirSync(`./public/${folder}`, { recursive: true });
    }
  });

  const { buffer } = file[0];
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const ref = `${uniqueSuffix}.webp`;
  
  await sharp(buffer)
    .webp({ quality: 20 })
    .toFile(`./public/${folder}/` + ref);
    
  return `public/${folder}/` + ref;
};

// Update or create settings
router.post(
  "/settings",
  upload.fields([
    { name: "Logo", maxCount: 1 },
    { name: "SmallLogo", maxCount: 1 },
    { name: "LandingImage1", maxCount: 1 },
    { name: "LandingImage2", maxCount: 1 },
    { name: "LandingImage3", maxCount: 1 },
    { name: "LandingImage4", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const {
        settingId,
        WebTitle,
        WebsiteName,
        CompanyName,
        CompanyAddress,
        CompanyMobile,
        CompanyEmail,
        CompanyWebsite,
        isLandingImage1,
        isLandingImage2,
        isLandingImage3,
        isLandingImage4,
        version,
        DepositNotice,
        WithdrawNotice,
        HomepageNotice,
        MainpageNotice,
        isDepositNoticeActive,
        isWithdrawNoticeActive,
        isHomepageNoticeActive,
        isMainpageNoticeActive,
        isMaintenanceMode,
        MaintenanceMessage
      } = req.body;

      if (settingId) {
        // Update existing settings
        const updatesetting = await SiteSettings.findById(settingId);
        
        // Basic Info
        updatesetting.WebTitle = WebTitle;
        updatesetting.WebsiteName = WebsiteName;
        updatesetting.CompanyName = CompanyName;
        updatesetting.CompanyAddress = CompanyAddress;
        updatesetting.CompanyMobile = CompanyMobile;
        updatesetting.CompanyEmail = CompanyEmail;
        updatesetting.CompanyWebsite = CompanyWebsite;
        
        // Process images
        if (req.files.Logo) {
          updatesetting.Logo = await processImage(req.files.Logo);
        }
        if (req.files.SmallLogo) {
          updatesetting.SmallLogo = await processImage(req.files.SmallLogo);
        }
        if (req.files.LandingImage1) {
          updatesetting.LandingImage1 = await processImage(req.files.LandingImage1, "landing");
        }
        if (req.files.LandingImage2) {
          updatesetting.LandingImage2 = await processImage(req.files.LandingImage2, "landing");
        }
        if (req.files.LandingImage3) {
          updatesetting.LandingImage3 = await processImage(req.files.LandingImage3, "landing");
        }
        if (req.files.LandingImage4) {
          updatesetting.LandingImage4 = await processImage(req.files.LandingImage4, "landing");
        }
        
        // Landing Images Status
        updatesetting.isLandingImage1 = isLandingImage1;
        updatesetting.isLandingImage2 = isLandingImage2;
        updatesetting.isLandingImage3 = isLandingImage3;
        updatesetting.isLandingImage4 = isLandingImage4;
        
        // Version
        updatesetting.version = version;
        
        // Notices
        updatesetting.DepositNotice = DepositNotice;
        updatesetting.WithdrawNotice = WithdrawNotice;
        updatesetting.HomepageNotice = HomepageNotice;
        updatesetting.MainpageNotice = MainpageNotice;
        updatesetting.isDepositNoticeActive = isDepositNoticeActive;
        updatesetting.isWithdrawNoticeActive = isWithdrawNoticeActive;
        updatesetting.isHomepageNoticeActive = isHomepageNoticeActive;
        updatesetting.isMainpageNoticeActive = isMainpageNoticeActive;
        
        // Maintenance Mode
        updatesetting.isMaintenanceMode = isMaintenanceMode;
        updatesetting.MaintenanceMessage = MaintenanceMessage;
        
        await updatesetting.save();
        res.send({ status: "success", data: updatesetting });
      } else {
        // Create new settings
        const data = new SiteSettings({
          WebTitle,
          WebsiteName,
          CompanyName,
          CompanyAddress,
          CompanyMobile,
          CompanyEmail,
          CompanyWebsite,
          Logo: req.files.Logo ? await processImage(req.files.Logo) : null,
          SmallLogo: req.files.SmallLogo ? await processImage(req.files.SmallLogo) : null,
          LandingImage1: req.files.LandingImage1 ? await processImage(req.files.LandingImage1, "landing") : null,
          LandingImage2: req.files.LandingImage2 ? await processImage(req.files.LandingImage2, "landing") : null,
          LandingImage3: req.files.LandingImage3 ? await processImage(req.files.LandingImage3, "landing") : null,
          LandingImage4: req.files.LandingImage4 ? await processImage(req.files.LandingImage4, "landing") : null,
          isLandingImage1,
          isLandingImage2,
          isLandingImage3,
          isLandingImage4,
          version,
          DepositNotice,
          WithdrawNotice,
          HomepageNotice,
          MainpageNotice,
          isDepositNoticeActive,
          isWithdrawNoticeActive,
          isHomepageNoticeActive,
          isMainpageNoticeActive,
          isMaintenanceMode,
          MaintenanceMessage
        });

        const val = await data.save();
        res.send({ status: "success", data: val });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({ status: "failed", message: err.message });
    }
  }
);

// Get settings
router.get("/settings/data", async (req, res) => {
  try {
    const settings = await SiteSettings.findOne();
    if (!settings) {
      return res.status(404).send({ status: "not_found", message: "No settings found" });
    }
    res.send(settings);
  } catch (e) {
    console.error(e);
    res.status(500).send({ status: "error", message: e.message });
  }
});

// Check maintenance mode
router.get("/settings/maintenance", async (req, res) => {
  try {
    const settings = await SiteSettings.findOne();
    if (!settings) {
      return res.send({ isMaintenanceMode: false, message: "" });
    }
    res.send({
      isMaintenanceMode: settings.isMaintenanceMode,
      message: settings.MaintenanceMessage
    });
  } catch (e) {
    console.error(e);
    res.status(500).send({ status: "error", message: e.message });
  }
});

module.exports = router;