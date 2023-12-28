const User = require("../models/userModel");
const Properties = require("../models/propertyModel");
const { sendToken } = require("../utils/auth");
const nodemailer = require("nodemailer");
const formidable = require("formidable");
const cloudinary = require("cloudinary");


//homepage or controller for  / route
exports.homepage = (req, res, next) => {
  res.json({ message: "this is homepage..." });
};

//controller for signup router
exports.signup = async (req, res, next) => {
  try {

    let user = await User.findOne({ email: req.body.email }).exec();
    if (user) {
      return res.status(501).json({ message: "user exists" });
    }
    const newUser = new User(req.body);
    user = await newUser.save();
    sendToken(user, req, res, 200);
    
const transport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    auth: {
        user: "msakshams24@gmail.com",
        pass: "oifiofltaekdrewb",
    },
});

const mailOptions = {
    from: "get properties solutions<msakshams24@gmail.com>",
    to: req.body.email,
    subject: "Registration Successful",
    text: "Kudos for registering on Get Properties Solution we'll help you in to find you dream place.",
    html: `<h1>Thank you for registering on Get Properties Solutions</h1>`,
};

transport.sendMail(mailOptions, async (err, info) => {
    if (err) return res.status(500).json({ message: err });
    console.log(info);
});
  } catch (error) {
    res.status(501).json({ message: error.message });
  }
};

//controller for signin router
exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email }).select("+password").exec();
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const matchpassword = user.comparepassword(password);
    if (!matchpassword) {
      return res.status(500).json({ message: "wrong credentials" });
    }
    sendToken(user, req, res, 200);
  } catch (error) {
    res.status(501).json({ message: error.message });
  }
};

//controller for signout router
exports.signout = (req, res, next) => {
  res.clearCookie("token");
  res.status(200).json({ message: "logged out successfully" });
};

//controller for update profile
exports.update = async (req, res, next) => {
  try {
    const { id } = req.user._id;
    const {
      mobile,
      email,
      username,
      about,
      role,
      firstname,
      lastname,
      fax,
      website,
      skype,
      facebook,
      x,
      linkedin,
      instagram,
      country,
      feepayer,
      documents,
      university,
      degree,
      course,
      portfolio,
      companyName,
      officeAddress,
      officeNumber,
      licenses,
      position,
    } = req.params;
    if (user) {
      const user = await User.findByIdAndUpdate(
        { id },
        {
          "profile.firstname": firstname,
          "profile.lastname": lastname,
          email,
          username,
          "profile.about": about,
          role,
          mobile,
          "profile.fax": fax,
          "profile.website": website,
          "profile.instagram": instagram,
          "profile.skype": skype,
          "profile.facebook": facebook,
          "profile.x": x,
          "profile.linkedin": linkedin,
          "profile.country": country,
          "studentDetails.feepayer": feepayer,
          "studentDetails.documents": documents,
          "studentDetails.university": university,
          "studentDetails.degree": degree,
          "studentDetails.course": course,
          "builderDetails.portfolio": portfolio,
          "agentDetails.companyName": companyName,
          "agentDetails.officeAddress": officeAddress,
          "agentDetails.officeNumber": officeNumber,
          "agentDetails.licenses": licenses,
          "agentDetails.position": position,
        }
      ).exec();
      await user.save();
      res.status(200).json({ message: "Updated", "updated user": user });
    } else {
      res.status(500).json({ message: "user not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

//controller for delete user

exports.deleteuser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.user._id).exec();
    if (user) {
      return res.status(200).json({ message: "user Deleted" });
    } else {
      return res.status(500).json({ message: "user not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

//controller for forget password 
exports.forgetpassword = async (req,res,next)=>{
  try {
      const user = await User.findById(req.params.id).select('+password').exec();
      if(user.passwordResetToken === 1){
          user.passwordResetToken = 0;
          user.password = req.body.password;
          await user.save();
          res.status(200).json({message : "password changed!"})
      }
      else{
          res.status(500).json({message : "link expired ! try again" })
      }
  } catch (error) {
      res.status(500).json({message : error})
  }
}

//controller for reset password
exports.resetpassword = async (req,res,next)=>{
  try {
      const user = await User.findById(req.params.email).select('+password').exec()
      if(user.passwordResetToken === 1){
          user.passwordResetToken = 0;
         if(req.body.password === req.body.confirmpassword){
          user.password = req.body.password;
          await user.save();
          res.status(200).json({message : 'password changed'})
         }
         else{
          res.status(500).json({message : "try again later"})
         }
      
      }
      else{
          res.status(500).json({message : "link expired !try again later"})
      }
  } catch (error) {
      res.status(500).json({message : error})
  }
}


exports.sendmail = async(req,res,next) => {
  try {
      const {email} = req.body;
      const user = await User.findOne({email}).exec();
      if(!user){
          return res.status(404).json({message : 'user not found'});
      }
      const pageurl =
      req.protocol +
      "://" +
      req.get("host") +
      "/forget-password/" +
      user._id;
  // res.status(200).json({ message: pageurl });

  const transport = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      auth: {
          user: "msakshams24@gmail.com",
          pass: "oifiofltaekdrewb",
      },
  });

  const mailOptions = {
      from: "get properties solutions<msakshams24@gmail.com>",
      to: req.body.email,
      subject: "Password Reset Link",
      text: "Do not share this link to anyone.",
      html: `<a href=${pageurl}>Password Reset Link</a>`,
  };

  transport.sendMail(mailOptions, async (err, info) => {
      if (err) return res.status(500).json({ message: err });
      // console.log(info);
      await User.findByIdAndUpdate(user._id, { passwordResetToken: 1 });
      res.status(200).json({
          message: "Email sent! check inbox/spam",
      });
  });
  } catch (error) {
      res.status(500).json({message : error})
  }
}


//controller for create properties

// exports.createProperties = async (req, res, next) => {
//     try {
//         const {
//           propertyname,
//           address,
//           neighborhood,
//           price,
//           country,
//           label,
//           description,
//           bedroom,
//           bathroom,
//           garage,
//           garagearea,
//           size,
//           landsize,
//           yearbuilt,
//           status,
//           features,
//           firstfloor,
//           secondfloor,
//           thirdfloor,
//         } = req.params;
//         console.log(req.body)
//         const property = new Properties({
//       ...req.body,
//           uploadedby: req.user._id,
//         }).exec();
//         await req.user.properties.push(property._id);
//         await property.save();
//         await req.user.save()
//         res.status(200).json({message:"property created !", property})
//     } catch (error) {
//       console.log(error)
//         res.status(500).json({message:"error occured", error})
//     }
// };

exports.propertiesCreate = async(req,res,next)=>{
  try {

    console.log(req.user.role)
    if(req.user.role === "owner" && "agent" && "agency"){
      const property = new Properties({
    ...req.body,
        uploadedby: req.user._id,
      })
      // console.log(property)
      await req.user.properties.push(property._id);
      await property.save();
      await req.user.save()
  res.status(200).json({message: "property created!",property})
    }else{
      res.status(401).json({message: "you are not authorized"})
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({message:"error occurred !",error})
  }
}

//controller fo property update

exports.propertyUpdate = async (req, res, next) => {
  try {
    const { id } = req.body;
    const {
      propertyname,
      address,
      neighborhood,
      price,
      country,
      label,
      description,
      propertyimages,
      bedroom,
      bathroom,
      garage,
      garagearea,
      size,
      landsize,
      yearbuilt,
      status,
      features,
      floorimg,
      floorsize,
      floorbedroom,
      floorbathroom,
      floorprice,
      propertytype,
      propertycatagory,
    } = req.params;

    const property = await Properties.findByIdAndUpdate(id, {
      propertyname,
      address,
      neighborhood,
      price,
      country,
      label,
      description,
      propertyimages,
      bedroom,
      bathroom,
      garage,
      garagearea,
      size,
      landsize,
      yearbuilt,
      status,
      features,
      $set: {
        "floorplans.$[floor].floorimg": floorimg,
        "floorplans.$[floor].floorsize": floorsize,
        "floorplans.$[floor].floorbedroom": floorbedroom,
        "floorplans.$[floor].floorbathroom": floorbathroom,
        "floorplans.$[floor].floorprice": floorprice,
      },
      propertytype,
      propertycatagory,
    },
    {
      arrayFilters: [{ "floor.floorNumber": { $eq: "firstfloor" } }],
      new: true,
    }).exec();

    if (property) {
      res.status(201).json({ message: 'Property updated successfully' });
    } else {
      res.status(404).send('Property not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error occurred', error });
  }
};

//controller for delete property
exports.propertyDelete = async (req,res,next)=>{
try {
  const propertyDelete = await Properties.findByIdAndDelete(req.user.properties._id).exec();
  if(propertyDelete){
    res.status(200).json({message:'Property deleted Successfully'});
  }else{
    res.status(404).json({message:"Property not found"})
  }
} catch (error) {
  res.status(500).json({message: "error occured", error})
}
}

//controller for show all property
exports.showProperty = async (req,res,next)=>{
  try {
    const allProperty = await Properties.find().sort({ createdAt: -1 }).exec();
    res.status(200).json({message: "properties", allProperty})
  } catch (error) {
    res.status(500).json({message : "error", error})
  }
}

//controller for featured property
exports.showFeaturedProperties = async (req, res, next) => {
  try {
    // Find the latest 8 featured properties sorted by createdAt in descending order
    const featuredProperties = await Properties
      .find({ label: 'Featured' }) // Assuming 'Featured' is the label for featured properties
      .sort({ createdAt: -1 })    // Sorting in descending order by createdAt
      .limit(8)                   // Limiting the result to 8 properties
      .exec();

    res.status(200).json({message:"featured Properties",featuredProperties});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error',error });
  }
};

//controller for rent properties

exports.findPropertiesForRent = async (req, res, next) => {
  try {
    const propertiesForRent = await Properties
      .find({ status: 'For Rent' }) // Assuming 'For Rent' is the status for properties available for rent
      .sort({ createdAt: -1 })      // Sorting in descending order by createdAt
      .exec();

    res.json(propertiesForRent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//controller for sale properties

exports.findPropertiesForSale = async (req, res, next) => {
  try {
    const propertiesForRent = await Properties
      .find({ status: 'For Sale' }) 
      .sort({ createdAt: -1 })      // Sorting in descending order by createdAt
      .exec();

    res.json(propertiesForRent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//controller for lease properties

exports.findPropertiesForLease = async (req, res, next) => {
  try {
    const propertiesForRent = await Properties
      .find({ status: 'For Lease' }) 
      .sort({ createdAt: -1 })      // Sorting in descending order by createdAt
      .exec();

    res.json(propertiesForRent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//controller for shared properties
exports.findPropertiesForShared = async (req, res, next) => {
  try {
    const propertiesForRent = await Properties
      .find({ status: 'Shared' }) 
      .sort({ createdAt: -1 })      // Sorting in descending order by createdAt
      .exec();

    res.json(propertiesForRent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller for finding apartments
exports.findApartments = async (req, res, next) => {
  try {
    const apartments = await Properties.find({ propertytype: 'apartment' }).sort({ createdAt: -1 }).exec();
    res.json(apartments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller for finding houses
exports.findHouses = async (req, res, next) => {
  try {
    const houses = await Properties.find({ propertytype: 'house' }).sort({ createdAt: -1 }).exec();
    res.json(houses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller for finding offices
exports.findOffices = async (req, res, next) => {
  try {
    const offices = await Properties.find({ propertytype: 'office' }).sort({ createdAt: -1 }).exec();
    res.json(offices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller for finding luxury homes
exports.findLuxuryHomes = async (req, res, next) => {
  try {
    const luxuryHomes = await Properties.find({ propertytype: 'luxury homes' }).sort({ createdAt: -1 }).exec();
    res.json(luxuryHomes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller for finding commercial properties
exports.findCommercialProperties = async (req, res, next) => {
  try {
    const commercialProperties = await Properties.find({ propertytype: 'commercial' }).sort({ createdAt: -1 }).exec();
    res.json(commercialProperties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller for finding residential properties
exports.findResidentialProperties = async (req, res, next) => {
  try {
    const residentialProperties = await Properties.find({ propertytype: 'residential' }).sort({ createdAt: -1 }).exec();
    res.json(residentialProperties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller for finding land properties
exports.findLandProperties = async (req, res, next) => {
  try {
    const landProperties = await Properties.find({ propertytype: 'land' }).sort({ createdAt: -1 }).exec();
    res.json(landProperties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller for finding land leasing properties
exports.findLandLeasingProperties = async (req, res, next) => {
  try {
    const landLeasingProperties = await Properties.find({ propertytype: 'land leasing' }).sort({ createdAt: -1 }).exec();
    res.json(landLeasingProperties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller for finding office leasing properties
exports.findOfficeLeasingProperties = async (req, res, next) => {
  try {
    const officeLeasingProperties = await Properties.find({ propertytype: 'office leasing' }).sort({ createdAt: -1 }).exec();
    res.json(officeLeasingProperties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller for finding hostel properties
exports.findHostelProperties = async (req, res, next) => {
  try {
    const hostelProperties = await Properties.find({ propertytype: 'hostel' }).sort({ createdAt: -1 }).exec();
    res.json(hostelProperties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller for finding store properties
exports.findStoreProperties = async (req, res, next) => {
  try {
    const storeProperties = await Properties.find({ propertycatagory: 'store' }).sort({ createdAt: -1 }).exec();
    res.json(storeProperties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller for finding shared apartment properties
exports.findSharedApartmentProperties = async (req, res, next) => {
  try {
    const sharedApartmentProperties = await Properties.find({ propertycatagory: 'shared apartment' }).sort({ createdAt: -1 }).exec();
    res.json(sharedApartmentProperties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller for finding shared house properties
exports.findSharedHouseProperties = async (req, res, next) => {
  try {
    const sharedHouseProperties = await Properties.find({ propertycatagory: 'shared house' }).sort({ createdAt: -1 }).exec();
    res.json(sharedHouseProperties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller for finding private hostel properties
exports.findPrivateHostelProperties = async (req, res, next) => {
  try {
    const privateHostelProperties = await Properties.find({ propertycatagory: 'private hostel' }).sort({ createdAt: -1 }).exec();
    res.json(privateHostelProperties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller for finding university hostel properties
exports.findUniversityHostelProperties = async (req, res, next) => {
  try {
    const universityHostelProperties = await Properties.find({ propertycatagory: 'university hostel' }).sort({ createdAt: -1 }).exec();
    res.json(universityHostelProperties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller for finding furnished office properties
exports.findFurnishedOffice = async (req, res, next) => {
  try {
    const furnishedOffice = await Properties.find({ propertytype: 'office', furnishing: 'furnished' }).sort({ createdAt: -1 }).exec();
    res.json(furnishedOffice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller for finding semi-furnished office properties
exports.findSemiFurnishedOffice = async (req, res, next) => {
  try {
    const semiFurnishedOffice = await Properties.find({ propertytype: 'office', furnishing: 'semi-furnished' }).sort({ createdAt: -1 }).exec();
    res.json(semiFurnishedOffice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller for finding unfurnished office properties
exports.findUnfurnishedOffice = async (req, res, next) => {
  try {
    const unfurnishedOffice = await Properties.find({ propertytype: 'office', furnishing: 'unfurnished' }).sort({ createdAt: -1 }).exec();
    res.json(unfurnishedOffice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.findFurnishedApartments = async (req, res, next) => {
  try {
    const furnishedApartments = await Properties.find({ propertytype: 'apartment', furnishing: 'furnished' }).sort({ createdAt: -1 }).exec();
    res.json(furnishedApartments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller for finding semi-furnished apartment properties
exports.findSemiFurnishedApartments = async (req, res, next) => {
  try {
    const semiFurnishedApartments = await Properties.find({ propertytype: 'apartment', furnishing: 'semi-furnished' }).sort({ createdAt: -1 }).exec();
    res.json(semiFurnishedApartments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller for finding unfurnished apartment properties
exports.findUnfurnishedApartments = async (req, res, next) => {
  try {
    const unfurnishedApartments = await Properties.find({ propertytype: 'apartment', furnishing: 'unfurnished' }).sort({ createdAt: -1 }).exec();
    res.json(unfurnishedApartments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Controller for finding furnished house properties
exports.findFurnishedHouses = async (req, res, next) => {
  try {
    const furnishedHouses = await Properties.find({ propertytype: 'house', furnishing: 'furnished' }).sort({ createdAt: -1 }).exec();
    res.json(furnishedHouses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller for finding semi-furnished house properties
exports.findSemiFurnishedHouses = async (req, res, next) => {
  try {
    const semiFurnishedHouses = await Properties.find({ propertytype: 'house', furnishing: 'semi-furnished' }).sort({ createdAt: -1 }).exec();
    res.json(semiFurnishedHouses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller for finding unfurnished house properties
exports.findUnfurnishedHouses = async (req, res, next) => {
  try {
    const unfurnishedHouses = await Properties.find({ propertytype: 'house', furnishing: 'unfurnished' }).sort({ createdAt: -1 }).exec();
    res.json(unfurnishedHouses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller for finding furnished luxury homes
exports.findFurnishedLuxuryHomes = async (req, res, next) => {
  try {
    const furnishedLuxuryHomes = await Properties.find({ propertytype: 'luxury homes', furnishing: 'furnished' }).sort({ createdAt: -1 }).exec();
    res.json(furnishedLuxuryHomes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller for finding semi-furnished luxury homes
exports.findSemiFurnishedLuxuryHomes = async (req, res, next) => {
  try {
    const semiFurnishedLuxuryHomes = await Properties.find({ propertytype: 'luxury homes', furnishing: 'semi-furnished' }).sort({ createdAt: -1 }).exec();
    res.json(semiFurnishedLuxuryHomes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller for finding unfurnished luxury homes
exports.findUnfurnishedLuxuryHomes = async (req, res, next) => {
  try {
    const unfurnishedLuxuryHomes = await Properties.find({ propertytype: 'luxury homes', furnishing: 'unfurnished' }).sort({ createdAt: -1 }).exec();
    res.json(unfurnishedLuxuryHomes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//controller for search
exports.searchProperties = async (req, res, next) => {
  try {
    const {
      keyword,
      bedroom,
      country,
      state,
      city,
      minPrice,
      maxPrice,
      status,
    } = req.query;

    // Build a query object based on provided filters
    const query = {};
    if (keyword) {
      query.$or = [
        { propertyname: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
      ];
    }
    if (bedroom) query.bedroom = bedroom;
    if (country) query.country = country;
    if (state) query.state = state;
    if (city) query.city = city;
    if (minPrice) query.price = { $gte: minPrice };
    if (maxPrice) query.price = { ...query.price, $lte: maxPrice };
    if (status) query.status = status;

    // Find properties based on the constructed query
    const properties = await Properties.find(query).sort({ createdAt: -1 }).exec();

    res.json(properties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// Controller for adding a property to favorites
exports.addToFavorites = async (req, res, next) => {
  try {
    const { propertyId } = req.body;
    const user = await User.findById(req.user.id);

    // Check if the property is already in favorites
    if (user.favorites.includes(propertyId)) {
      return res.status(400).json({ message: 'Property already in favorites' });
    }

    // Add the property to favorites
    user.favorites.push(propertyId);

    await user.save();

    res.json({ message: 'Property added to favorites successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller for saving a search
exports.saveSearch = async (req, res, next) => {
  try {
    const { keyword, bedroom, country, state, city, minPrice, maxPrice, status } = req.body;
    const user = await User.findById(req.user.id);

    // Check if the search is already saved
    const existingSearch = user.savedSearches.find((search) => {
      return (
        search.keyword === keyword &&
        search.bedroom === bedroom &&
        search.country === country &&
        search.state === state &&
        search.city === city &&
        search.minPrice === minPrice &&
        search.maxPrice === maxPrice &&
        search.status === status
      );
    });

    if (existingSearch) {
      return res.status(400).json({ message: 'Search criteria already saved' });
    }

    // Save the search criteria
    user.savedSearches.push({
      keyword,
      bedroom,
      country,
      state,
      city,
      minPrice,
      maxPrice,
      status,
    });

    await user.save();

    res.json({ message: 'Search criteria saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};