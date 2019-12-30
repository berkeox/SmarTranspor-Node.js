const express=require("express");
const router=express.Router();
const sql=require("mssql");
const dir="C:\\Users\\Berke\\Desktop\\SmarTransportSOA\\Durak\\";
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
  var Data;

  conn.connect((err) => {
    if(err)
    {
      console.log(err);
      return;
    }

    request.query("DurakListele",(err,recordset) => {
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
function TekDurakAl(id,callback){
  const conn=new sql.ConnectionPool(dbConfig);
  const request= new sql.Request(conn);

  conn.connect((err) => {
    if(err)
    {
      console.log(err);
      return;
    }

    request.query("DurakSeç "+id,(err,recordset) => {
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

function DurakKaydet(DurakAd,Lat,Lng,DurakTürü,callback) {
  const conn = new sql.ConnectionPool(dbConfig);
  const request = new sql.Request(conn);

  conn.connect((err) => {
    if (err) {
      console.log(err);
      return;
    }

    request.query("INSERT INTO Durak(DurakAd,Lat,Lng,DurakTürü) VALUES('"+DurakAd+"','"+Lat+"','"+Lng+"','"+DurakTürü+"')", (err) => {
      if (err) {
        console.log(err);
        return;
      }
      else {

        callback();

      }

      conn.close();

    })
  });

}

function DurakDüzenle(ID,DurakAd,Lat,Lng,DurakTürü, callback) {
  const conn = new sql.ConnectionPool(dbConfig);
  const request = new sql.Request(conn);

  conn.connect((err) => {
    if (err) {
      console.log(err);
      return;
    }

    request.query("UPDATE Durak SET DurakAd='"+DurakAd+"',Lat='"+Lat+"',Lng='"+Lng+"',DurakTürü='"+DurakTürü+"' WHERE DurakNo='"+ID+"'", (err) => {
      if (err) {
        console.log(err);
        return;
      }
      else {

        callback();

      }

      conn.close();

    })
  });

}

function DurakSil(ID, callback) {
  const conn = new sql.ConnectionPool(dbConfig);
  const request = new sql.Request(conn);

  conn.connect((err) => {
    if (err) {
      console.log(err);
      return;
    }

    request.query("DELETE FROM Durak WHERE DurakNo='"+ID+"'", (err) => {
      if (err) {
        console.log(err);
        return;
      }
      else {

        callback();

      }

      conn.close();

    })
  });

}


router.get("/",function (req,res){


     DurakAl((recordset) => {
      recordset=JSON.parse(recordset);
      const dat=recordset.recordset;
      res.render(dir+"Index.ejs", {DurakData :dat}); 
    } );
    
     } );
    
    router.get("/Edit/:id",function (req,res){
      const id = req.params.id;
      TekDurakAl(id,(recordset) => {
        recordset=JSON.parse(recordset);
        const dat=recordset.recordset;
       
          res.render(dir+"Edit.ejs", {DurakData :dat}); 
        } );
        
    
     } );
    
    router.get("/Details/:id",function (req,res){
      const id = req.params.id;
      TekDurakAl(id,(recordset) => {
        recordset=JSON.parse(recordset);
        const dat=recordset.recordset;
          res.render(dir+"Details.ejs", {DurakData :dat}); 
        } );
        
    
    } );
    
    router.get("/Create",function (req,res){
    
     res.render(dir+"Create.ejs");
              
    } );

        
    router.get("/Delete/:id",function (req,res){    
      DurakSil(req.params.id,() => {

            res.redirect("/Durak");

      })           
     } );

     router.post("/Create/Submit", function (req, res) {

      DurakKaydet(req.body.DurakAd,req.body.Lat,req.body.Lng,req.body.DurakTürü,() => {
        res.redirect("/Durak");
    
      })
    
    })
    
    
    router.post("/Edit/Submit/:id", function (req, res) {
    
      DurakDüzenle(req.params.id,req.body.DurakAd,req.body.Lat,req.body.Lng,req.body.DurakTürü,() => {
        res.redirect("/Durak");
    
      })
    
    })
    
    
      module.exports=router;