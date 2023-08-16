const express = require('express')
const cors = require('cors');
const fs = require('fs');
const app = express()
app.get('/name', (req, res) => {
    console.log("Just got a request!")

    console.log(req.headers['x-forwarded-for'] )
    res.send('ip =   '+ req.headers['x-forwarded-for'])
})





app.get("/user/light", function(req, res) {

    let data = fs.readFileSync("./users.json", "utf8");
    let js = JSON.parse(data);
    res.send(js)


});
app.put("/server/light", function(req, res) {
    console.log( req.body )


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






app.listen(process.env.PORT || 3000)
