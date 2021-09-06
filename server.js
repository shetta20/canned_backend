const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const knex = require('knex');
const pg = require('pg');
const cors = require('cors');

//Parse incoming body
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(
    cors({
        origin: "*",
        methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
    }
    )
    )

const postgres = knex({
        client: 'pg',
        connection: {
            connectionString: process.env.DATABASE_URL,
            ssl: {
              rejectUnauthorized: false
            }
          },
        searchPath: ['knex', 'public'],
    });


//Get method on root
app.get('/', (req,res)=> {
res.send("Nothing to return. Base end point :)");
})

//Get method on /users
app.get('/response', async function (req,res){

    let userid = req.query.userid;
    console.log("Get Worked")
    const myres = await postgres.select('*').from('responses').where('userid',userid);
    res.send(myres);
})

app.get('/savedresponse', async function (req,res){
    let userid = req.query.userid;
    console.log("Get Worked")
    const myres = await postgres.select('*').from('savedresponse').where('userid',userid);
    res.send(myres);
})

app.get('/note', async function (req,res){
    console.log("Get Worked")
    const myres = await postgres.select('*').from('notes');
    res.send(myres);
})

app.post('/savedresponse',cors(), function(req,res){
    console.log(req.body);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    const myres =  postgres('savedresponse').insert(req.body).then((data) => console.log("data from knex",req,res))
        .catch((err) => { res.send({"error":err.detail}); throw err.detail;})
        .finally(() => res.send({"error":"Awesome! Your response is saved"}));
    console.log("Response post worked")
});

//Get method on /users
app.get('/canned', async function (req,res){
    console.log("Get Worked")
    const myres = await postgres.select('*').from('canned');
    res.send(myres);
})

//Post method on users
app.post('/response',cors(), function(req,res){
    console.log(req.body);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    const myres =  postgres('responses').insert(req.body).then((data) => console.log("data from knex",req,res))
        .catch((err) => { res.send({"error":err.detail}); throw err.detail;})
        .finally(() => res.send({"error":"Awesome! Response added successfully"}));
    console.log("Response post worked")
});

app.post('/users',cors(), function(req,res){
    console.log(req.body);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    const myres =  postgres('respuser').insert(req.body).then((data) => console.log("data from knex",req,res))
        .catch((err) => { res.send({"error":err.detail}); throw err.detail;})
        .finally(() => res.send({"error":"User added successfully"}));
    console.log("Response post worked")
});

app.delete('/users',cors(), function(req,res){
    console.log(req.body);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    const myres =  postgres('respuser').insert(req.body).then((data) => console.log("data from knex",req,res))
        .catch((err) => { res.send({"error":err.detail}); throw err.detail;})
        .finally(() => res.send({"error":"User added successfully"}));
    console.log("Response post worked")
});

app.post('/auth',cors(), async function(req,res){
    console.log(req.body);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    
    const myres = await postgres.select('*').from('respuser').where('userid',req.body.userid);
    console.log("Recieved",req.body)
    if(myres.length !== 0 && req.body.password === myres[0].password)
        res.send({"error":"Success"})
    else
        res.send({"error":"Fail"})
});

app.post('/canned',cors(), async function(req,res){
    console.log(req.body);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    const myres = await postgres('canned').insert(req.body).then(() => console.log("data inserted"))
        .catch((err) => { res.send({"error":err.detail}); throw err.detail;})
        .finally(() => res.send({"error":"Awesome! Canned Response added successfully"}));
    res.send("Canned post worked:")
});

app.post('/note',cors(), async function(req,res){
    temp = ""
    console.log(req.body);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    const myres = await postgres('notes').insert(req.body).then(() => console.log("data inserted"))
        .catch((err) => { res.send({"error":err.detail}); throw err.detail;})
        .finally(() => {});
    res.send("Done")
});

// app.get('/metadata', async function (req,res){
//     console.log("Get Here")
//     const myres = await postgres.select('tno','ttitle').from('tickets').orderBy('tno');
//     res.send(myres);
// })

// app.get('/manpower/:id', async function (req,res){
//     console.log("Get Here with id")
//     const myres = await postgres.where('id',req.params.id).from('manpower').orderBy('id');
//     myres.length?res.send(myres):res.send("No such ticket found")

// })


// //Delete user method
// app.delete('/manpower/:id', (req,res)=>{
//     console.log(req.params);
// postgres("manpower").where("id",req.params.id).del().then(function (count) {
//   console.log(count);
// }).finally(function () {
// });
// res.send('Done Deleting ticket');
// })

//Listen to requests
app.listen(process.env.PORT || 5000,()=>{console.log("worked")})
