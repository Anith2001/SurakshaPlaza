const express=require("express")
const app=express();
const bodyParser=require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const Json2csvParser = require("json2csv").Parser;
const fs=require("file-system")
var db;
const url="mongodb://localhost:27017/Inventory";
MongoClient.connect(url,{ useUnifiedTopology: true },function(err,database){
    if(err) throw err;
    db=database.db("Inventory")
    console.log("connected to database Inventory")
})
app.set('view engine','ejs')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'))

app.get("/",function(req,res){
    db.collection('Police').find().toArray(function(err,result){
        if(err) throw err;
    res.render('homepage.ejs',{data:result});
    });
});
app.get("/home",function(req,res){
    res.redirect("/");
});
app.get("/create",function(req,res){
    res.render('add.ejs')
});
app.post("/Add",function(req,res){
    db.collection('Police').save(req.body);
    res.redirect("/");
});
app.post("/delete",function(req,res){
    db.collection('Police').findOneAndDelete({pid:req.body.pid},(err,result)=>{
        if(err) throw err;
    res.redirect("/");
    });
});
app.get("/update",function(req,res){
    var id=req.query.pid;
    db.collection('Police').find().toArray((err,result)=>{
        if(err) throw err;
        res.render("update.ejs",{data:{pid:id}});
    });
});
app.post("/updatedata",function(req,res){
    //var d=req.body.pid;
    var query={$set:{size:req.body.size,quantity:req.body.quantity}}
    db.collection('Police').findOneAndUpdate({pid:req.body.pid},query,(err,result)=>{
        if(err) throw err;
    res.redirect("/");
    });
});
app.get("/saledetails",function(req,res){
    db.collection("Sale").find().toArray(function(err,result){
        if(err) throw err;
    res.render("saledetails.ejs",{data:result});
    });
});
app.get("/download",function(req,res){
    db.collection("Sale").find().toArray(function(err,result){
        if(err) throw err;
    const json2csvParser = new Json2csvParser({ header: true });
    const csvData = json2csvParser.parse(result);
    fs.writeFile("SaleDetails1.csv",csvData,function(error){
        if(error) throw error;
    console.log("written successfully");
    res.download("SaleDetails1.csv")
    });
    });
});
app.listen(5000);