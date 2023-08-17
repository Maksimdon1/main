
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const morgan = require('morgan');
const cors = require('cors');
const CyclicDb = require("@cyclic.sh/dynamodb")
const db = CyclicDb("kind-red-sea-urchin-fezCyclicDB")


var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')

const DBSOURCE = "shop.sqlite";

// Declare app
const app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

const jsonParser = express.json();
// middlewares

app.use(morgan('dev'));
app.use(cors());
const filepath = './users.json'
// default route for server
app.use(express.urlencoded({limit: '50mb', extended: true}))










const run = async function(){
  // instantiate a collection
  let users = db.collection('users')



let mikes_work = await users.set('mike',{
  firstname : 'maksim',
  secondname : 'kozyrev'
})

console.log(mikes_work)
  
}
app.get('/name', (req, res) => {
  run()
})




app.post("/api/register", async (req, res) => {
  var errors = [];
  var data = [];
  try {
    const { Login, Email, Password, Name, Surname,Token, SysLevel} = req.body;

    if (!Login) {
      errors.push("Login is missing");
    }
    if (!Token) {
      errors.push("Login is missing");
    }
    if (!Name) {
      errors.push("Name is missing");
    }
    if (!Surname) {
      errors.push("Surname is missing");
    }
    if (!Email) {
      errors.push("Email is missing");
    }
    if (errors.length) {
      res.status(400).json({ error: errors.join(",") });
      return;
    }
    let userExists = false;

    var sql = "SELECT * FROM Users WHERE Email = ?";
    await db.all(sql, Email, (err, result) => {
      if (err) {
        res.status(402).json({ error: err.message });
        return;
      }

      if (result.length === 0) {
        

        data = {
          
          Login: Login,
          Email: Email,
          Password: Password,
          Token : Token,
          DateCreated: Date("now"),
          Name : Name,
          Surname : Surname,
          SysLevel : SysLevel
        };

        var sql =
          "INSERT INTO Users (Login, Email, Password, Token, DateCreated, Name , Surname, SysLevel) VALUES (?,?,?,?,?,?,?,?)";
        var params = [
          data.Login,
          data.Email,
          data.Password,
          data.Token,
          Date("now"),
          data.Name,
          data.Surname,
          data.SysLevel
        ];
        var user = db.run(sql, params, function (err, innerResult) {
          if (err) {
            res.status(400).json({ error: err.message });
            return;
          }
          else{
            console.log(this['lastID']);
          }
        });
      } else {
        userExists = true;
        // res.status(404).send("User Already Exist. Please Login");
      }
    });

    setTimeout(() => {
      if (!userExists) {
        res.status(201).send(data);
      } else {
        res.status(201).json("Record already exists. Please login");
      }
    }, 500);
  } catch (err) {
    console.log(err);
  }
});


app.post("/api/login", async (req, res) => {
  try {
    const { Login, Password } = req.body;
    // Make sure there is an Email and Password in the request
    if (!(Login && Password)) {
      res.status(400).send("All input is required");
    }

    let user = [];

    let params = [
      Login,
      Password
    ]
    var date = new Date();
    const loginTime = {
      day : date.getDay(),
      hour : date.getHours(),
      minute : date.getMinutes(),
      month : date.getMonth(),
      year : date.getFullYear(),
      second :date.getSeconds()
    }
       var data = [ JSON.stringify( loginTime) , Login,Password];

        let sql = `UPDATE Users SET 
                 
        DateLoggedIn = ?
                  WHERE Login = ? AND Password = ?`;
        db.run(sql, data, function (err) {
          if (err) {
            return console.error(err.message);
          }
          console.log(`Row(s) updated: ${this}`);
          
      
     
        });
    
    var sqls = "SELECT * FROM Users WHERE Login = ? AND Password = ?";
    db.all(sqls, params, function (err, rows) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      else{
     
         res.status(200).send(rows);
      }

     
    });
  } catch (err) {
    console.log(err);
  }
});





app.get("/user/light", function(req, res) {

    let data = fs.readFileSync("./users.json", "utf8");
    let js = JSON.parse(data);
    res.send(js)


});

app.put("/user/light", function(req, res) {
    if(     req.body.id  && req.body.fluence  ){
        const {id, fluence} = req.body



        let data = fs.readFileSync("./users.json", "utf8");
        let js = JSON.parse(data);
        let device = js[id][0]
        device.fluence = fluence
        js[id][0] = device
        fs.writeFileSync("./users.json", JSON.stringify(js));
        res.send('123')
    }
    else{
        res.status(400).send("Failed to change")
    }

});

app.get("/server/light", function(req, res) {
  console.log(req.socket.remoteAddress)
    res.send('123')

});

app.put("/server/light", function(req, res) {


    if(     req.body.id && req.body.value   ){
        const {id, value} = req.body
        console.log(req.socket.remoteAddress)



        let data = fs.readFileSync("./users.json", "utf8");
        let js = JSON.parse(data);
        let device = js[id][0]
        const now = new Date
        get_time = now.toLocaleString()
        console.log(now.toLocaleString())
        device.time_updated = get_time
        device.value = value
        console.log(value)
        js[id][0] = device
        fs.writeFileSync("./users.json", JSON.stringify(js));
        res.send('123')

    }
    else{
        res.status(400).send("Failed to change")
    }


});

app.get("/user/temp", function(req, res) {
    res.send('123')

});

app.put("/user/temp", function(req, res) {
    if(     req.body.id  && req.body.fluence  ){
        console.log(req.body.id,  req.body.fluence)
        res.send('123')
    }

});

app.get("/server/temp", function(req, res) {
    res.send('123')

});

app.put("/server/temp", function(req, res) {
    if(     req.body.id && req.body.value && req.body.type  ){
        console.log(req.body.id , req.body.value, req.body.type )
        res.send('123')
    }

});






// 404 route for server
app.use((req, res, next) => res.status(404).send({
  message: "Could not find specified route that was requested...!"
}));





app.listen(process.env.PORT || 3000)

