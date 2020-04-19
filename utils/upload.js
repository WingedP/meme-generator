const multer=require("multer")
const path=require("path");




const pathToUpload=path.join(__dirname,"../public/uploads");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,pathToUpload) 
    },
    filename: function (req, file, cb) {
    const allows=["image/gif", "image/jpeg", "image/jpg", "image/png"]
    if(!allows.includes(file.mimetype)){
    const error=new Error("Filetype not accepted. Please upload again.")
    cb(error, undefined)} 
    
    cb(null,file.originalname)
    
    }
  })


   
  const upload = multer({ storage: storage }).single("fileUpload");

  module.exports=upload; 