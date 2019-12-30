const express = require("express");
const router = express.Router();
const sql = require("mssql");
const dir = "C:\\Users\\Berke\\Desktop\\SmarTransportSOA\\Kullanıcı\\";


router.use(express.urlencoded({
  extended: true
}));

const dbConfig = {
  server: "localhost",
  database: "SmarTransport",
  user: "",
  password: ""

}

function KullanıcıAl(callback) {
  const conn = new sql.ConnectionPool(dbConfig);
  const request = new sql.Request(conn);
  var Data;

  conn.connect((err) => {
    if (err) {
      console.log(err);
      return;
    }

    request.query("KullanıcıListele", (err, recordset) => {
      if (err) {
        console.log(err);
        return;
      }
      else {
        var a = JSON.stringify(recordset);
        callback(a);

      }

      conn.close();

    })
  });

}


function TekKullanıcıAl(id, callback) {
  const conn = new sql.ConnectionPool(dbConfig);
  const request = new sql.Request(conn);

  conn.connect((err) => {
    if (err) {
      console.log(err);
      return;
    }

    request.query("KullanıcıSeç "+id, (err, recordset) => {
      if (err) {
        console.log(err);
        return;
      }
      else {
        var a = JSON.stringify(recordset);
        callback(a);

      }

      conn.close();

    })
  });

}


function KullanıcıKaydet(email, şifre, isim, soyisim, telefon, adres, cinsiyet, callback) {
  const conn = new sql.ConnectionPool(dbConfig);
  const request = new sql.Request(conn);

  conn.connect((err) => {
    if (err) {
      console.log(err);
      return;
    }

    request.query("INSERT INTO Kullanıcı(email,şifre,isim,soyisim,telefon,adres,cinsiyet) VALUES('" + email + "','" + şifre + "','" + isim + "','" + soyisim + "','" + telefon + "','" + adres + "','" + cinsiyet + "')", (err) => {
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


function KullanıcıDüzenle(ID,email, şifre, isim, soyisim, telefon, adres, cinsiyet, callback) {
  const conn = new sql.ConnectionPool(dbConfig);
  const request = new sql.Request(conn);

  conn.connect((err) => {
    if (err) {
      console.log(err);
      return;
    }

    request.query("UPDATE Kullanıcı SET email='"+email+"',şifre='"+şifre+"',isim='"+isim+"',soyisim='"+soyisim+"',telefon='"+telefon+"',adres='"+adres+"',cinsiyet='"+cinsiyet+"' WHERE ID='"+ID+"'", (err) => {
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


function KullanıcıSil(ID, callback) {
  const conn = new sql.ConnectionPool(dbConfig);
  const request = new sql.Request(conn);

  conn.connect((err) => {
    if (err) {
      console.log(err);
      return;
    }

    request.query("DELETE FROM Kullanıcı WHERE ID='"+ID+"'", (err) => {
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

router.get("/", function (req, res) {

  KullanıcıAl((recordset) => {
    recordset = JSON.parse(recordset);
    const dat = recordset.recordset;

    res.render(dir + "Index.ejs", { KullanıcıData: dat });
  });

});

router.get("/Edit/:id", function (req, res) {

  const id = req.params.id;
  TekKullanıcıAl(id, (recordset) => {
    recordset = JSON.parse(recordset);
    const dat = recordset.recordset;

    res.render(dir + "Edit.ejs", { KullanıcıData: dat });
  });

});

router.get("/Details/:id", function (req, res) {

  const id = req.params.id;
  TekKullanıcıAl(id, (recordset) => {
    recordset = JSON.parse(recordset);
    const dat = recordset.recordset;
    res.render(dir + "Details.ejs", { KullanıcıData: dat });
  });


});

router.get("/Create", function (req, res) {

  res.render(dir + "Create.ejs");

});

router.get("/Delete/:id", function (req, res) {

  KullanıcıSil(req.params.id,() => {
    res.redirect("/Kullanici");

  })

})

router.post("/Create/Submit", function (req, res) {

  KullanıcıKaydet(req.body.email,req.body.şifre,req.body.isim,req.body.soyisim,req.body.telefon,req.body.adres,req.body.cinsiyet,() => {
    res.redirect("/Kullanici");

  })

})


router.post("/Edit/Submit/:id", function (req, res) {

  KullanıcıDüzenle(req.params.id,req.body.email,req.body.şifre,req.body.isim,req.body.soyisim,req.body.telefon,req.body.adres,req.body.cinsiyet,() => {
    res.redirect("/Kullanici");

  })

})





module.exports = router;