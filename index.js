//  let {addition} = require("./addition"); // call the module
// addition(3, 7);
// addition(7, 7);

            //WEB SERVER
// const http = require('http');
// //port
// const port = parseInt(process.env.port)  //create a port
// || 4000;
// //web server
// http.createServer((req, res) => {
//     const currUrl = req.url;
//     console.log('Url: ', currUrl, '\nMethod: ', req.method);
//     res.writeHead(200, {'Content-type': 'text/html'});  //what response is expected on the content type
//     switch(currUrl) {
//         case '/':
//             res.end('You are in home page Bro!');
//         break
//         case '/about':
//             res.end('About me page');
//         break
//         case '/data':
//             res.end('Page data');
//         break
//         default:
//             res.end('Page / content was not found');
//     }
// }).listen(port, () => {
//     console.log(`Server is running at port ${port}`);
// })

        //---EXPRESS APP---
const express = require('express');

        //---PATH---
const path = require('path');

        // ---DB---
const db = require('./config');

        //---body parser--
const bodyParser = require('body-parser');  //converts the data from 1 format to another eg from js to json

         //---port---
const port = parseInt(process.env.port) || 2000;

        //---EXPRESS APP---
const app = express();

//ROUTER
const route = express.Router();

app.use(
    route,
    express.json,
    bodyParser.urlencoded({extended: false})    //MIDDLE WAY
)

route.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, './view/index.html'));    //MIDDLE WAY  ---- '/' it is a end point/destination
})

route.get('/users', (req, res)=> {          // never use 'select * ' in a router coz it slows the loading - choose the info the client need to see
    const strQry =
    `
    SELECT firstName, lastName, emailAdd, country
    FROM users;
    `
    //db
db.query(strQry, (err, data) => {       
    if (err) throw err;
    res.status(200).json({result: data})    
})
})

// Register
route.post('/register', bodyParser.json(), (req,res)=> {
    let detail = req.body;       //collects data from the user -- body is a pipeline that is used to fetch the data5
    console.log(detail);
    // sql query
    const strQry =
    `INSERT INTO users SET ?;`; // 'set?;  -- allows inserting of data into the table-
    db.query(strQry, [detail], (err)=> {
        if(err) {
            res.status(400).json({err});
        }else {
            res.status(200).json({msg: "A user record was used"})
        }
    })
})

//UPDATE
route.put('/users/:id', bodyParser.json(), (req, res) => {
    let detail = req.body;
    const strQry =
    `UPDATE users
    SET ? WHERE userId = ?;
    `;
    db.query(strQry, [detail, req.params.id], (err) => {
        if (err) {
            res.status(400).json({err});
        } else {
            res.status(200).json({msg: "A record has been updated"})
        }
    })
})
route.delete('/user/:id', (req, res) => {
    let detail = req.body;
    const strQry =
    `DELETE FROM Users
    WHERE userId = ?;
    `
    db.query(strQry, [detail], (err) => {
        if (err) {
            res.status(400).json({err});
        } else {
            res.status(200).json({msg: "A record has been deleted"})
        }
    })
})



app.listen(port, () => {
    console.log(`Server is running at ${port}`);
})