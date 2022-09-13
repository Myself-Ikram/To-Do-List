
//Importing Express
const express = require("express");
const app = express();

//Importing Body Parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));

//Public folder for css & js files
app.use(express.static("public"));

//Views folder for ejs files
app.set('view engine', 'ejs');

//Lodash
const _ = require("lodash");

//Importing Mongoose
const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://admin-ikram:admin@cluster0.dewmf45.mongodb.net/TodolistDB",{useNewUrlParser:true});

//Specifing Schema
const itemSchema = new mongoose.Schema({
    name:String,
})

//Creating a collection
const Item = new mongoose.model("item",itemSchema);
const bathing = new Item({name:"Bathing"})
const breakfast = new Item({name:"Breakfast"})
const work = new Item({name:"Work"})

//Get method for Home page
app.get("/",function(req,res){
    Item.find({},function(err,items){
        if(items.length===0){
            Item.insertMany([bathing,breakfast,work],error);
            res.redirect("/");
        }
        else{
            res.render("list", {day : "Today", newItems : items});
        }
    })
})

//Creating Dynamic List specified by User
app.get("/:newList",function(req,res){
    const  newList = _.capitalize(req.params.newList);
    List = new mongoose.model(newList,itemSchema);
    List.find({},function(err,items){
        res.render("list",{day : newList, newItems : items}); 
    })
    
})

//Adding items in the List 
app.post("/",function(req,res){
    const btnClicked = req.body.btn;
    if(btnClicked === "Today"){
        const userItem = new Item({
            name:req.body.addItem,
        })
        userItem.save(function(err){
            if(!err){
                res.redirect("/");
            }    
        });
    }
    //Adding items in the Dynamic List(Created  by user)
    else{
        const pList = new mongoose.model(btnClicked,itemSchema);
        const newListI = new pList({
            name:req.body.addItem,
        })
        newListI.save();
        res.redirect("/" + btnClicked);
    }

//Deleting items in the List    
})
app.post("/delete",function(req,res){
   const checked = req.body.checkbox;
   const route = req.body.hid;
   if(route === "Today"){
        Item.deleteOne({_id: checked},error);
        res.redirect("/");
   }
   //Deleting items in the Dynamic List(Created  by user)
   else{
        const dItem = new mongoose.model(route,itemSchema);
        dItem.deleteOne({_id: checked},error);
        res.redirect("/" + route);
   }
})

//Predefined function for Error Handling
function error(err){
    if(err){console.log(err)}
    else{console.log("success")}
}

//Server starts at port 3000!
app.listen(3000,function(){
    console.log("Server Started At 3000!!!!");
})
