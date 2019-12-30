const express=require("express");
const router=express.Router();
const sql=require("mssql");
const dir="C:\\Users\\Berke\\Desktop\\SmarTransportSOA\\Home\\";

router.use(express.urlencoded({
  extended: true
}));

const dbConfig ={
  server:"localhost",
  database:"SmarTransport",
  user:"",
  password:""

}



function DurakAl(callback){
  const conn=new sql.ConnectionPool(dbConfig);
  const request= new sql.Request(conn);
 

  conn.connect((err) => {
    if(err)
    {
      console.log(err);
      return;
    }

    request.query("SELECT * FROM Durak",(err,recordset) => {
      if(err)
    {
      console.log(err);
      return;
    }
    else
    {
     var a =JSON.stringify(recordset);
      callback(a);
   
    }

    conn.close();

    } )
  });

}



function KullanıcıBak(email,şifre,callback){
  const conn=new sql.ConnectionPool(dbConfig);
  const request= new sql.Request(conn);
 

  conn.connect((err) => {
    if(err)
    {
      console.log(err);
      return;
    }

    request.query("SELECT * FROM Kullanıcı WHERE email='"+email+"' AND şifre='"+şifre+"'",(err,recordset) => {
      if(err)
    {
      console.log(err);
      return;
    }
    else
    {
    

if(recordset.recordset.length!=0)
callback(true);
else
callback(false);



   
    }

    conn.close();

    } )
  });

}

router.get("/",function (req,res){


  DurakAl((recordset) => {
  
    res.render(dir+"Home.ejs", {Data :recordset});
  } );
  })
    
    
    router.get("/About",function (req,res){
    
     res.render(dir+"About.ejs");

  
    
     } );
    
    router.get("/Contact",function (req,res){
    
    res.render(dir+"Contact.ejs");
 
    } );
    
    router.get("/SSS",function (req,res){
    
     res.render(dir+"SSS.ejs");
             
    } );

    router.get("/YoneticiPaneli",function (req,res){
    
      res.render(dir+"YöneticiPaneli.ejs");
              
     } );

     router.post("/YoneticiPaneli/Submit",function (req,res) {

 KullanıcıBak(req.body.email,req.body.şifre,(KullanıcıVar) =>{
if(KullanıcıVar)
res.redirect("/YoneticiPaneli");
else
res.redirect("/");

 })

     })
    
    
      module.exports=router;