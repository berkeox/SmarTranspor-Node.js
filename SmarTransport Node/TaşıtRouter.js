const express=require("express");
const router=express.Router();
const sql=require("mssql");
const dir="C:\\Users\\Berke\\Desktop\\SmarTransportSOA\\Taşıt\\";
router.use(express.urlencoded({
  extended: true
}));
const dbConfig ={
  server:"localhost",
  database:"SmarTransport",
  user:"",
  password:""

}

function TaşıtAl(callback){
  const conn=new sql.ConnectionPool(dbConfig);
  const request= new sql.Request(conn);
  var Data;

  conn.connect((err) => {
    if(err)
    {
      console.log(err);
      return;
    }

    request.query("TaşıtListele",(err,recordset) => {
      if(err)
    {
      console.log(err);
      return;
    }
    else
    {
     var a =JSON.stringify(recordset);
      callback(a);
      //console.log(record);
    }

    conn.close();

    } )
  });

}

function TekTaşıtAl(id,callback){
  const conn=new sql.ConnectionPool(dbConfig);
  const request= new sql.Request(conn);

  conn.connect((err) => {
    if(err)
    {
      console.log(err);
      return;
    }

    request.query("TaşıtSeç "+id,(err,recordset) => {
      if(err)
    {
      console.log(err);
      return;
    }
    else
    {
     var a =JSON.stringify(recordset);
      callback(a);
      //console.log(record);
    }

    conn.close();

    } )
  });

}

function TaşıtKaydet(TaşıtID,TaşıtAdı,TaşıtTürü,callback) {
  const conn = new sql.ConnectionPool(dbConfig);
  const request = new sql.Request(conn);

  conn.connect((err) => {
    if (err) {
      console.log(err);
      return;
    }

    request.query("INSERT INTO Taşıt(TaşıtID,TaşıtAdı,TaşıtTürü) VALUES('"+TaşıtID+"','"+TaşıtAdı+"','"+TaşıtTürü+"')", (err) => {
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

function TaşıtDüzenle(ID,TaşıtAdı,TaşıtTürü, callback) {
  const conn = new sql.ConnectionPool(dbConfig);
  const request = new sql.Request(conn);

  conn.connect((err) => {
    if (err) {
      console.log(err);
      return;
    }

    request.query("UPDATE Taşıt SET TaşıtAdı='"+TaşıtAdı+"',TaşıtTürü='"+TaşıtTürü+"' WHERE TaşıtID='"+ID+"'", (err) => {
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

function TaşıtSil(ID, callback) {
  const conn = new sql.ConnectionPool(dbConfig);
  const request = new sql.Request(conn);

  conn.connect((err) => {
    if (err) {
      console.log(err);
      return;
    }

    request.query("DELETE FROM Taşıt WHERE TaşıtID='"+ID+"'", (err) => {
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
   
  TaşıtAl((recordset) => {
   
    recordset=JSON.parse(recordset);
    const dat=recordset.recordset;
      res.render(dir+"Index.ejs", {TaşıtData :dat}); 
    } );
    
     } );
    
    router.get("/Edit/:id",function (req,res){
      const id = req.params.id;
      TekTaşıtAl(id,(recordset) => {
        recordset=JSON.parse(recordset);
        const dat=recordset.recordset;
        
          res.render(dir+"Edit.ejs", {TaşıtData :dat}); 
        } );
     
     } );
    
    router.get("/Details/:id",function (req,res){
      const id = req.params.id;
      TekTaşıtAl(id,(recordset) => {
        
        recordset=JSON.parse(recordset);
        const dat=recordset.recordset;
          res.render(dir+"Details.ejs", {TaşıtData :dat}); 
        } );
    
    } );
    
    router.get("/Create",function (req,res){
    
     res.render(dir+"Create.ejs");
             
    } );

    router.get("/Delete/:id",function (req,res){
      TaşıtSil(req.params.id,() => {
        res.redirect("/Tasit");
      })
      
      
      });

      
    router.post("/Create/Submit",function (req,res) {
      TaşıtKaydet(req.body.TaşıtID,req.body.TaşıtAdı,req.body.TaşıtTürü,() => {
      
        res.redirect("/Tasit");
      })
      })
      
      
      
          router.post("/Edit/Submit/:id",function (req,res) {
      
            TaşıtDüzenle(req.params.id,req.body.TaşıtAdı,req.body.TaşıtTürü,() => {
            
              res.redirect("/Tasit");
            })
            
          })
    
    
      module.exports=router;