const fs=require("fs");
const path=require("path");

const pathToData=path.join(__dirname,"../images.json");
const pathToMemeData=path.join(__dirname,"../memes.json");

function loadData(){
    const buffer=fs.readFileSync(pathToData);
    const data=buffer.toString();
    return JSON.parse(data);
}
function saveData(data){    
    fs.writeFileSync(pathToData, JSON.stringify(data))
}

function loadMemeData(){
    const buffer=fs.readFileSync(pathToMemeData);
    const data=buffer.toString();
    return JSON.parse(data);
}
function saveMemeData(data){
    fs.writeFileSync(pathToMemeData, JSON.stringify(data))
}

module.exports={loadData,saveData,loadMemeData,saveMemeData};