var express = require('express');
var router = express.Router();
const upload = require("../utils/upload");
const {loadData, saveData, saveMemeData, loadMemeData}=require("../utils/data");
const path=require("path");
var Jimp = require('jimp');


const pathToMemes= path.join(__dirname,"../public/memes/"); 
const pathToIcon= path.join(__dirname,"../public/images/icon.png"); 

const pathToUpload=path.join(__dirname,"../public/uploads");

//------------------------------HOME PAGE GOES HERE:
router.get('/', function(req, res, next) {
res.render('index', { title: 'Dreams and', subtitle: 'Dont give up your dreams.... Keep sleeping <3', 
icon:"https://scontent.fvca1-1.fna.fbcdn.net/v/t1.0-9/93621379_2659021344382597_4708140998096584704_n.jpg?_nc_cat=103&_nc_sid=8024bb&_nc_ohc=5dTJe3m06lgAX-HNDgb&_nc_ht=scontent.fvca1-1.fna&oh=7c4d99fdc693d0586e2e885b0d3de936&oe=5EC00C2F",

});
});
//------------------------------HOME PAGE GOES HERE:


//------------------------------BROWSE GOES HERE:
router.get("/browse",(req,res)=>{
  const data=loadData()
  res.render("allImages", {images: data})
})
//------------------------------BROWSE GOES HERE:

//------------------------------POST UPLOAD GOES HERE:
router.post("/upload",upload,async(req,res)=>{
console.log(req.file);
const data=loadData()
const found = data.findIndex(e => e.originalname === req.file.originalname || e.size === req.file.size);

if(!req.file){
return res.render("allImages", {error:"you'll need to upload a file"})}
else if(found !== -1) {
  return(res.render("allImages", {error:"image already existed. Please upload again"})
)
// fs.unlinkSync(pathToUpload);
}

else {  
  try{let picture=req.file.path;
let image = await Jimp.read(picture);
image.resize(Jimp.AUTO, 250, Jimp.RESIZE_BEZIER);
await image.writeAsync(picture);


req.file.id= data.length===0?1:data[data.length-1].id+1
data.push(req.file); saveData(data)
return res.render("allImages", {images: data})} catch(e){
  fs.unlinkSync(req.file.path);
  res.render("allImages", {error:"blah blah blah wrong"})
}
}
})
//------------------------------POST UPLOAD GOES HERE:





router.post("/addtext",async (req,res,next)=>{
const{top,bot,id}=req.body
// let textColor=req.body;
// let textcolor;
// if(textColor=true){textcolor="BLACK"}
// if(textColor=false){textcolor="WHITE"}
// console.log("wefwefwefwefwefwefwefwefwefwefwefwefwefwefwefwefwefwefwefwefwefwefwefwefwefwefwefwef",top,bot,id, BLACK, WHITE)
if(!id) 
return res.redirect("/browse",{error:"please submit ID"})
if(!top && !bot)
return res.redirect("/browse",{error:"please submit some funny text"})
//use id to query original img
const data=loadData();
const selectedImageIndex=data.findIndex(image=>image.id===id*1)
if(selectedImageIndex===-1){
  return res.redirect("/browse",{error:"image ID not found"})
}
const selectedImage=data[selectedImageIndex]
let image= await Jimp.read(selectedImage.path);
let font= await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK); 
  
    image.print(font,0,20,
    {text: top,alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,alignmentY: Jimp.VERTICAL_ALIGN_TOP},
    250,250);
    image.print(font,0,-20,
    {text: bot,alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,alignmentY: Jimp.VERTICAL_ALIGN_BOTTOM},
    250,250); 

let newName=Date.now().toString()+selectedImage.filename
await image.writeAsync(pathToMemes+newName)

const memes=loadMemeData();
let newData={
  id:memes.length>0?memes[memes.length-1]+1:1,
  path:pathToMemes+newName,
  filename:newName
}


memes.push(newData)
saveMemeData(memes)
res.render("allMemes",{images:memes})
})

router.get("/memes",(req,res)=>{
  const data=loadMemeData()
  res.render("allMemes", {images: data})
})  




//

// router.post("/addtext",async (req,res)=>{
// // const querymeme=req.query
// const data=loadData()
// // console.log("FILE ORIGINAL NAME HEEHEHEHEHEH",file.originalname)
// const memeData = loadMemeData()

// const pathToEachImage=path.join(__dirname,`../public/uploads/${data.originalname}`);
// const pathToAllMemes= path.join(__dirname,`../public/memes/${data.originalname}+ memed`); 
// let texttop=  req.body.memetexttop;
// let textbottom= req.body.memetextbottom;

// let font= await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
// let image= await Jimp.read(pathToEachImage);
//   image.print(font,0,0,
//   {text: texttop,alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE},
//   250,250);
//   image.print(font,0,0,
//   {text: textbottom,alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE},
//   250,250);  
 
// await image.writeAsync(pathToAllMemes);
// memeData.push(req.file); 
// console.log(req.file);
// saveMemeData(memeData)
// return res.render("allImages", {images: memeData})

//  })

//




module.exports = router;




