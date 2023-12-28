const mongoose = require("mongoose");

const propertyModel = new mongoose.Schema({
    propertyname : {
        type: String,
        required: [true,"property name is required"],
        maxLength : [256, "property name should have almost 256 characters"],
    },
    address:{
        type : String,
        required: [true,"address is required"],
        maxLength: [256,"address should have almost 256 characters"],
    },
    neighborhood:{
        type:String,
        required:[true,"neighborhood is required"] ,
    },
    price:{
        type:String,
        required:[true,"price is required"],
        maxLength:[999999999999999,"price must be almost 999999999 characters long"]
    },
    country:{
        type: String,
        required: [true,"country is required"],
        maxLength: [256,"country should almost have 256 characters"]
    },
    label:{
        type:String,
        enum:["Featured", "Hot Offer"]
    },
    description:{
        type:String,
        required: [true,"description is required"],
        maxLength: [8000,"description should have almost 8000 characters"],
    },
    propertyimages:{
        type: [Object],
        default: {
          public_id: "",
          url: "",
        },
    },
    bedroom:{
        type: String,
        required: [true,"bedroom number is required"],
    },
    bathroom:{
        type: String,
        required: [true,"bathroom number is required"],
    },
    garage:{
        type: String,
        required: [true,"garage number is required"],
    },
    garagearea:{
        type: String,
        required: [true,"garage area is required"],
    },
    size:{
        type: String,
        required: [true,"size of the property is required"],
    },
    landsize:{
        type:String,
        required: [true,"land size is not required"],
    },
    yearbuilt:{
        type: String,
        required: [true,"year built is required"],
    },
    status:{
        type: String,
        enum: ["For Sale","For Rent","For Lease","Shared"],
    },
    features:{
        type:[String],
        required:[true,"features are required"],
        default: [],
    },
    floorplans: [
        {
            floorNumber: { type: String },
            floorImg: {
                public_id: { type: String, default: "" },
                url: { type: String, default: "" },
            },
            floorSize: { type: String },
            floorBedroom: { type: String },
            floorBathroom: { type: String },
            floorPrice: { type: String },
        },
    ],
    propertytype:{
        type:String,
        enum:["commercial","residential","land","land leasing","office leasing","shared","hostel"],
        required:[true,"type of property is required"]
    },
    propertycatagory:{
        type:String,
        enum:["apartment","house","luxury homes","office","store","shared apartment","shared house","private hostel","university hostel"],
        required:[true,"type of property is required"]
    },
    furnishing: {
        type: String,
        enum: ['furnished', 'semi-furnished', 'unfurnished'],
        default: 'unfurnished',
        required:[true,"type of property is required"]
      },
    uploadedby:{type: mongoose.Schema.Types.ObjectId, ref: "user"},
  },
  {timestamps: true}
);

const property = mongoose.model("property", propertyModel);
module.exports = property;