const express=require("express");
const router=express.Router();
const sql=require("mssql");
const dir="C:\\Users\\Berke\\Desktop\\SmarTransportSOA\\Hat\\";
router.use(express.urlencoded({
  extended: true
}));

const dbConfig ={
  server:"localhost",
  database:"SmarTransport",
  user:"",
  password:""

}

function HatAl(callback){
  const conn=new sql.ConnectionPool(dbConfig);
  const request= new sql.Request(conn);
 

  conn.connect((err) => {
    if(err)
    {
      console.log(err);
      return;
    }

    request.query("HatListele",(err,recordset) => {
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

function TekHatAl(id,callback){
  const conn=new sql.ConnectionPool(dbConfig);
  const request= new sql.Request(conn);

  conn.connect((err) => {
    if(err)
    {
      console.log(err);
      return;
    }

    request.query("HatSeç "+id,(err,recordset) => {
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

function HatKaydet(TaşıtID, DurakNo,callback) {
  const conn = new sql.ConnectionPool(dbConfig);
  const request = new sql.Request(conn);

  conn.connect((err) => {
    if (err) {
      console.log(err);
      return;
    }

    request.query("INSERT INTO HAT(TaşıtID, DurakNo) VALUES('"+TaşıtID+"','"+DurakNo+"')", (err) => {
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

function HatDüzenle(ID,TaşıtID, DurakNo, callback) {
  const conn = new sql.ConnectionPool(dbConfig);
  const request = new sql.Request(conn);

  conn.connect((err) => {
    if (err) {
      console.log(err);
      return;
    }

    request.query("UPDATE HAT SET TaşıtID='"+TaşıtID+"',DurakNo='"+DurakNo+"' WHERE ID='"+ID+"'", (err) => {
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

function HatSil(ID, callback) {
  const conn = new sql.ConnectionPool(dbConfig);
  const request = new sql.Request(conn);

  conn.connect((err) => {
    if (err) {
      console.log(err);
      return;
    }

    request.query("DELETE FROM HAT WHERE ID='"+ID+"'", (err) => {
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

  HatAl((recordset) => {

    recordset=JSON.parse(recordset);
    const dat=recordset.recordset;
      res.render(dir+"Index.ejs", {HatData :dat}); 
    } );

     } );
    
    router.get("/Edit/:id",function (req,res){
      const id = req.params.id;
     
      TekHatAl(id,(recordset) => {
        recordset=JSON.parse(recordset);
        const dat=recordset.recordset;
        
          res.render(dir+"Edit.ejs", {HatData :dat}); 
        } );
    
     } );
    
    router.get("/Details/:id",function (req,res){
      const id = req.params.id;
      TekHatAl(id,(recordset) => {
        recordset=JSON.parse(recordset);
        const dat=recordset.recordset;
       
          res.render(dir+"Details.ejs", {HatData :dat}); 
        } );
   
    } );
    
    router.get("/Create",function (req,res){
    
     res.render(dir+"Create.ejs");
              
    } );


router.get("/Delete/:id",function (req,res){
HatSil(req.params.id,() => {
  res.redirect("/Hat");
})


})


    router.post("/Create/Submit",function (req,res) {
HatKaydet(req.body.TaşıtID,req.body.DurakNo,() => {

  res.redirect("/Hat");
})
})



    router.post("/Edit/Submit/:id",function (req,res) {

      HatDüzenle(req.params.id,req.body.TaşıtID,req.body.DurakNo,() => {
      
        res.redirect("/Hat");
      })
      
    })
    
    
      module.exports=router;