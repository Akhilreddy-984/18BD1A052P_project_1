const express=require('express');
const middleware = require('./middleware');
const app=express();
app.use(express.json());

let server= require('./server');

const MongoClient = require('mongodb').MongoClient;

 // Connection URL
const url = 'mongodb://localhost:27017';
 
// Database Name
const dbName = 'hospitalManagement';

const hospitalsCollection='hospitalDetails';
 const venttilatorsCollection="ventilatorDetails";
// Use connect method to connect to the server
let db=null;
MongoClient.connect(url, function(err, client) {
  if(err)
  {
      console.log("Error in connecting to server");
  }
  console.log("Connected successfully to server");
  console.log(`Database:${dbName}`);
 
   db = client.db(dbName);
 
});

app.get('/api/getHospitalDetails',middleware.checkToken,(req,res)=>{

    
    db.collection(hospitalsCollection).find().toArray((err,documents)=>{
        if(err)
        {
            console.log(err);
        }
        else{
            res.send(documents);
        }
    });
    // const hospital=Hospitals.find(h=> h.name===req.params.name);
    // if(!hospital) return res.status(404).send("The hospital with given name not found");

    // res.send(hospital);

});

app.get('/api/getVentilatorDetails',middleware.checkToken,(req,res)=>{
    db.collection(venttilatorsCollection).find().toArray((err,documents)=>{
        if(err)
        {
            console.log(err);
        }
        else{
            res.send(documents);
        }
    });


    // const ventilator=Ventilators.find(v=> v.vId===req.params.vid);
    // if(!ventilator) return res.status(404).send("The ventilators with given name not found");
    // res.send(ventilator);

});
//Search ventilator Details by status
app.post('/api/SearchVentilatorDetailsByStatus',middleware.checkToken,(req,res)=>{
    var stat=req.body.status;
    db.collection(venttilatorsCollection).find({status: stat}).toArray((err,documents)=>{
        if(err)
        {
            console.log(err);
        }
        else{
            res.send(documents);
        }
    });
});

    //Search Ventilator Details By Hospital Name
    app.post('/api/SearchVentilatorDetailsByName',middleware.checkToken,(req,res)=>{
        var hname=req.query.name;
        db.collection(venttilatorsCollection).find({name: hname}).toArray((err,documents)=>{
            if(err)
            {
                console.log(err);
            }
            else{
                res.send(documents);
            }
        });


    // const ventilator=Ventilators.find(v=> v.vId===req.params.vid);
    // if(!ventilator) return res.status(404).send("The ventilators with given name not found");
    // res.send(ventilator);

});

app.get('/api/get_Hospital_info_and_its_ventilators_info_By_Hname/:hname',middleware.checkToken,(req,res)=>{

    arr=[];
    db.collection(hospitalsCollection).find({name:req.params.hname}).toArray((err,documents)=>{
        if(err)
        {
            console.log(err);
        }
        else{
            arr.push(documents);
        }
    });
    db.collection(venttilatorsCollection).find({name:req.params.hname}).toArray((err,documents)=>{
        if(err)
        {
            console.log(err);
        }
        else{
            arr.push(documents);
            res.send(arr);
        }
    });


    // const hospital=Hospitals.find(h=> h.name===req.params.name);
    // if(!hospital) return res.status(404).send("The hospital with given name not found");

    // res.send(hospital);

});


//update ventilator
app.put('/api/updateVentilator',middleware.checkToken,(req,res)=>{

    const VID=req.body.id;
    const str=req.body.status;
    console.log(str);
    db.collection(venttilatorsCollection).findOneAndUpdate({vId:VID},{$set:{status:str}},{returnOriginal:false},(err,result)=>{
        if(err)
          console.log("error");
        else
            res.send(result);
    })

});

app.post('/api/addVentilator',middleware.checkToken,(req,res)=>{

    const userInput=req.body;
    db.collection(venttilatorsCollection).insert(userInput,(err,result)=>{
        if(err)
            console.log(err);
        else
            res.send(result);

    });

});
//Add hospital
app.post('/api/addHospital',middleware.checkToken,(req,res)=>{

    const userInput=req.body;
    db.collection(hospitalsCollection).insert(userInput,(err,result)=>{
        if(err)
            console.log(err);
        else
            res.send(result);

    });

});
//Delete Ventilator by Id
app.delete('/api/delVentilator/:vid',middleware.checkToken,(req,res)=>{

    const VID=req.params.vid;
            db.collection(venttilatorsCollection).deleteOne({vId:VID},(err,result)=>{
            if(err)
                console.log(err);
            else
                {
                    if(result.deletedCount==0)
                         return res.send("No such Ventilator is present");

                    res.send(result);
                }
            });
    

    });






app.listen(3000,()=>console.log('listening on:3000..'))