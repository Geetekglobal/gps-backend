const express = require("express");
var router = express.Router();
const {
  homepage,
  signup,
  signin,
  signout,
  update,
  propertiesCreate,
  sendmail,
  resetpassword,
  forgetpassword,
  propertyUpdate,
  propertyDelete,
  showProperty,
  showFeaturedProperties,
  findPropertiesForRent,
  findPropertiesForSale,
  findPropertiesForLease,
  findPropertiesForShared,
  findApartments,
  findHouses,
  findOffices,
  findLuxuryHomes,
  findCommercialProperties,
  findResidentialProperties,
} = require("../controllers/indexController");
const { isLoggedin } = require("../utils/auth");



//homepage
router.get("/", homepage);
//sign-up
router.post("/signup", signup);
//login
router.post("/login", signin);
//logout
router.get("/logout",isLoggedin, signout);
//update
router.post('/update/:id',isLoggedin,update);
//sendmail
router.get('/sendmail',sendmail)
//forgot-password
router.get('/forget-password',forgetpassword)
//reset password
router.get('/reset-password',resetpassword)
//create property
router.get('/createproperty',isLoggedin,propertiesCreate)
//update property
router.get('/updateproperty',isLoggedin,propertyUpdate)
//delete property
router.get('/deleteproperty',isLoggedin,propertyDelete)
//show property
router.get('/property',showProperty)
//show featured property
router.get('/featuredproperty',showFeaturedProperties)
//show for rent property
router.get('/forrentproperty',findPropertiesForRent)
//show for sale property
router.get('/forsaleproperty',findPropertiesForSale)
//show for lease property
router.get('/forleaseproperty',findPropertiesForLease)
//show for shared property
router.get('/forsharedproperty',findPropertiesForShared)
//show for find Apartments property
router.get('/apartments',findApartments)
//show for find Houses property
router.get('/houses',findHouses)
//show for find Offices property
router.get('/offices',findOffices)
//show for find LuxuryHomes property
router.get('/luxuryhomes',findLuxuryHomes)
//show for find Commercial Properties property
router.get('/commercial',findCommercialProperties)
//show for find Residential Properties property
router.get('/residential',findResidentialProperties)

module.exports = router;
