var express=require("express");
var app=express();
const sql=require("mssql");
 
const dbConfig ={
    server:"localhost",
    database:"SmarTransport",
    user:"",
    password:""
  
  }

//config
app.set("view engine","ejs");




//Routes
app.use(require("./HomeRouter"));
app.use("/Hat",require("./HatRouter"));
app.use("/Kullanici",require("./KullanıcıRouter"));
app.use("/Durak",require("./DurakRouter"));
app.use("/Tasit",require("./TaşıtRouter"));


app.post("/CommonTransport/:durakno1/:durakno2",(req,res) => {


   var DurakNo1=req.params.durakno1;
   var DurakNo2=req.params.durakno2;
    var DurakOtoNo1;
    var DurakOtoNo2;
    var CommonBusNos;
    var availableBus =[];
    var called=0;
    var tek=0;

    LookForBuses(DurakNo1,(result) => { //1

        DurakOtoNo1=result;
        LookForBuses(DurakNo2,(result) => { //2
     
            DurakOtoNo2=result;
          

            LookForCommonBuses(DurakOtoNo1,DurakOtoNo2,(result) => { //3
               
            CommonBusNos=result;


             for(var i=0;i<CommonBusNos.length;i++)
             {
               
                if(typeof CommonBusNos[i]!=="undefined")
                {
                   
                    GetCommonBusIntel(CommonBusNos[i],(result) =>{ //4
                       called++;
                        availableBus.push(result);

                        if(called===CommonBusNos.length)
                        {
                            tek++;
                            res.send(availableBus);
                        }
                         
                    })
  
                }
             }
             

            })

        })




    })

})

function LookForBuses(DurakNo,callback)
{
    const conn=new sql.ConnectionPool(dbConfig);
    const request= new sql.Request(conn);

    conn.connect((err) => {
        if(err)
        {
          console.log(err);
          return;
        }

        request.query("SELECT TaşıtID FROM Hat WHERE DurakNo='"+DurakNo+"'",(err,recordset) => {
            if(err)
            {
              console.log(err);
              return;
            }
            else
            {
             var a =JSON.stringify(recordset.recordset);
              callback(a);
           
            }


        })

    })

}



function GetCommonBusIntel(TaşıtID,callback)
{

    const conn=new sql.ConnectionPool(dbConfig);
    const request= new sql.Request(conn);

    conn.connect((err) => {
        if(err)
        {
          console.log(err);
          return;
        }

        request.query("SELECT TaşıtID,TaşıtAdı,TaşıtTürü FROM Taşıt WHERE TaşıtID='"+TaşıtID+"'",(err,recordset) => {
            if(err)
            {
              console.log(err);
              return;
            }
            else
            {
             var a =JSON.stringify(recordset.recordset);
              callback(a);
           
            }
        })

    })
}

function LookForCommonBuses(OtoNumbers1,OtoNumbers2,callback)
{
 var Numbers1=JSON.parse(OtoNumbers1);
 var Numbers2=JSON.parse(OtoNumbers2);

 var CommonNumbers=[];

    for(var i=0;i<Numbers1.length;i++)
    {
       

        for(var x=0;x<Numbers2.length;x++)
        {
            if(Numbers1[i].TaşıtID === Numbers2[x].TaşıtID)
            CommonNumbers.push(Numbers1[i].TaşıtID);
        }
    }

    callback(CommonNumbers);
}



app.listen(1337,function () {
    console.log("Açıldı");
})

