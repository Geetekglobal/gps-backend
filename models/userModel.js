const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userModel = new mongoose.Schema(
  {
    profile: {
      firstname: {
        type: String,
        minLength: [1, "name must have atleast 1 characters"],
        required: [true, "firstname is required"],
      },
      lastname: {
        type: String,
        required: [true, "lastname is required"],
      },
      about: {
        type: String,
        maxLength: [143, "about must have almost 143 characters"],
        // required: [true, "username is required"],
      },
      avatar: {
        type: Object,
        default: {
          public_id: "",
          url: "",
        },
      },
      fax: {
        type: String,
      },
      website:{
        type: String,
        maxLength: [256, "website must have almost 256 characters"],
      },
      skype:{
        type: String,
        maxLength: [256, "skype must have almost 256 characters"],
      },
      facebook:{
        type: String,
        maxLength: [256, "facebook must have almost 256 characters"],
      },
      x:{
        type: String,
        maxLength: [256, "x must have almost 256 characters"],
      },
      linkedin:{
        type: String,
        maxLength: [256, "linkedin must have almost 256 characters"],
      },
      instagram:{
        type: String,
        maxLength: [256, "instagram must have almost 256 characters"],
      },
      country:{
        type:String,
        required:[true,"country is required"],
        maxLength: [256,"country must have almost 256 characters"]
      }
    },
    username:{
        type: String,
        required: [true,"username is required"],
        unique: true,
        minlength: [2, 'Username must be at least 2  characters'],
    },
    mobile: {
      type: String,
      required: [true, "mobile is required"],
    },
    email: {
      type: String,
      unique: true,
      require: [true, "email is required"],
      validate: [validator.isEmail, "email is invalid"],
    },
    password: {
      type: String,
      select: false,
      minLength: [8, "password must have atleast 8 characters"],
      required: [true, "password field must not empty"],
      match: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/,
    },
    role: {
      type: String,
      required: true,
      enum: ["buyer/tenant", "owner", "student", "agent", "builder", "agency"],
    },

    isApproved: { type: Boolean, default: false },

    studentDetails: {
      feePayer: {
        type: String,
        required: function () {
          return this.role === "student";
        },
      },
      documents: {
        type: [String],
        required: function () {
          return this.role === "student";
        },
      },
      university: {
        type: String,
        required: function () {
          return this.role === "student";
        },
      },
      degree: {
        type: String,
        required: function () {
          return this.role === "student";
        },
      },
      course: {
        type: String,
        required: function () {
          return this.role === "student";
        },
      },
    },
    builderDetails: {
      portfolio: {
        type: [String],
        required: function () {
          return this.role === "builder";
        },
      },
    },
    agentDetails: {
      companyName: {
        type: String,
        required: function () {
          return this.role === "agent" || this.role === "agency";
        },
      },
      officeAddress: {
        type: String,
        required: function () {
          return this.role === "agent" || this.role === "agency";
        },
      },
      officeNumber: {
        type: String,
        required: function () {
          return this.role === "agent" || this.role === "agency";
        },
      },
      licenses: {
        type: [String],
        required: function () {
          return this.role === "agent" || this.role === "agency";
        },
      },
      position: {
        type: String,
        required: function () {
          return this.role === "agent"; 
        },
      },
    },
    connectedId:[{
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    }],
    properties:[{type:mongoose.Schema.Types.ObjectId, ref:"property"}],
    passwordResetToken: {
      type:Number,
      default:0,
      enum:[0,1]
    },
    favorites: [
      {
        propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "property" },
      },
    ],

    savedSearches: [
      {
        keyword: String,
        bedroom: String,
        country: String,
        state: String,
        city: String,
        minPrice: String,
        maxPrice: String,
        status: String,
      },
    ],
  },
  { timestamps: true }
);

userModel.pre("save", async function () {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  });
  userModel.methods.comparepassword = function (userpassword) {
    return bcrypt.compareSync(userpassword, this.password);
  };
  userModel.methods.gettoken = function () {
    return jwt.sign({ id: this._id }, "SECRETKEYJWT", { expiresIn: "1h" });
  };

const user = mongoose.model("user", userModel);
module.exports = user;
