
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const morgan = require('morgan');
const cors = require('cors');


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






app.get('/name', (req, res) => {
    console.log("Just got a request!")

    console.log(req.headers['x-forwarded-for'] )
    res.send('ip =   '+ req.headers['x-forwarded-for'])
})


app.get("/api/users", function (req, res) {

  let content = fs.readFileSync(filepath, "utf8");
  let users = JSON.parse(content);
  console.log( users[0].lamp)
  res.send(users[0].state, users[0].frequency );
});
app.get("/joystick", function (req, res) {

  let content = fs.readFileSync(filepath, "utf8");
  let users = JSON.parse(content);
  console.log( users[0].x)
  let data = users[0]
  res.send(data);
});
app.put("/joystick", jsonParser, function (req, res) {


  if (!req.body) res.status(400).send("Failed to change");

  let userId = 1
  let x = req.body.x;
  let y = req.body.y;



  let data = fs.readFileSync(filepath, "utf8");
  let users = JSON.parse(data);
  let user;

  for (let i = 0; i < users.length; i++) {
    if (users[i].id == userId) {
      user = users[i];
      break;
    }
  }

  if (user) {
    user.x = x;
    user.y = y;

    let data = JSON.stringify(users);
    fs.writeFileSync(filepath, data);
    res.send(user);
  }


});



app.post("/api/users", jsonParser, function (req, res) {

  if (!req.body) res.sendStatus(400);

  let userName = req.body.name;
  let userAge = req.body.age;
  console.log(req.body)
  let user = {name: userName, age: userAge};

  let data = fs.readFileSync(filepath, "utf8");
  let users = JSON.parse(data);

  let id = Math.max(...users.map((user) => user.id));

  if (Number.isFinite(id)) {
    user.id = id + 1;
  } else {
    user.id = 1;
  }

  users.push(user);

  data = JSON.stringify(users);
  fs.writeFileSync(filepath, data);
  res.send(user);
});

app.delete("/api/users/:id", function (req, res) {

  let id = req.params.id;
  let data = fs.readFileSync(filepath, "utf8");
  let users = JSON.parse(data);
  let index = -1;

  for (let i = 0; i < users.length; i++) {
    if (users[i].id == id) {
      index = i;
      break;
    }
  }

  if (index > -1) {
    let user = users.splice(index, 1)[0];

    for (let i = 0; i < users.length; i++) {
      users[i].id = i + 1;
    }

    let data = JSON.stringify(users);
    fs.writeFileSync(filepath, data);
    res.send(user);
  }
  else {
    res.status(404).send("User isn't found by ID");
  }
});

app.put("/api/users", jsonParser, function (req, res) {


  if (!req.body) res.status(400).send("Failed to change");

  let userId = req.body.id;
  let userState = req.body.state;


  let data = fs.readFileSync(filepath, "utf8");
  let users = JSON.parse(data);
  let user;

  for (let i = 0; i < users.length; i++) {
    if (users[i].id == userId) {
      user = users[i];
      break;
    }
  }

  if (user) {
    user.state = userState;

    let data = JSON.stringify(users);
    fs.writeFileSync(filepath, data);
    res.send(user);
  }
  else {
    res.status(404).send(user);
  }

});
app.put("/api/frequency", jsonParser, function (req, res) {


  if (!req.body) res.status(400).send("Failed to change");

  let userId = req.body.id;
  let userState = req.body.frequency;


  let data = fs.readFileSync(filepath, "utf8");
  let users = JSON.parse(data);
  let user;

  for (let i = 0; i < users.length; i++) {
    if (users[i].id == userId) {
      user = users[i];
      break;
    }
  }

  if (user) {
    user.frequency = userState;

    let data = JSON.stringify(users);
    fs.writeFileSync(filepath, data);
    res.send(user);
  }
  else {
    res.status(404).send(user);
  }

});
app.put("/temp", jsonParser, function (req, res) {


  if (!req.body) res.status(400).send("Failed to change");

  let userId = req.body.id;
  let userValue = req.body.value;


  let data = fs.readFileSync(filepath, "utf8");
  let users = JSON.parse(data);
  let user;

  for (let i = 0; i < users.length; i++) {
    if (users[i].id == userId) {
      user = users[i];
      break;
    }
  }

  if (user) {
    user.value = userValue;

    let data = JSON.stringify(users);
    fs.writeFileSync(filepath, data);
    res.send(user);
  }
  else {
    res.status(404).send(user);
  }

});

app.put("/smoke", jsonParser, function (req, res) {


  if (!req.body) res.status(400).send("Failed to change");

  let userId = req.body.id;
  let userValue = req.body.value;


  let data = fs.readFileSync(filepath, "utf8");
  let users = JSON.parse(data);
  let user;

  for (let i = 0; i < users.length; i++) {
    if (users[i].id == userId) {
      user = users[i];
      break;
    }
  }

  if (user) {
    user.value = userValue;

    let data = JSON.stringify(users);
    fs.writeFileSync(filepath, data);
    res.send(user);
  }
  else {
    res.status(404).send(user);
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

