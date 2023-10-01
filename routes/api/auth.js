var express = require('express');
var auth = express.Router();
var jwt= require("jsonwebtoken")
var accessTokenSecret = require("../../secret")
const {OAuth2Client} = require('google-auth-library');
const connection = require('../../db');
const client = new OAuth2Client();
async function verify(credential,clientId) {
  const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: clientId,
  });
  const payload = ticket.getPayload();
  return payload;
}

auth.post('/googleAuth',(req,res)=>{
    let credential = req.body.credential;
    let clientId = req.body.clientId;
    console.log(req);
    verify(credential,clientId).then((r)=>{
        console.log(r);
        connection.query(`SELECT * from users where email="${r.email}";`,(err,rows,fields)=>{
            if (err) throw err;
            console.log(rows);
            if(!(rows.length>0)){
                connection.query(`INSERT INTO users (email,name,login_type) VALUES ("${r.email}","${r.name}","google")`,(err1,rows1,fields1)=>{
                    if(err1) throw err1
                    const accessToken = jwt.sign({ username: r.name,email:r.email,userId: rows1 }, accessTokenSecret);
                    res.json({response:r,token:accessToken,status:"New User Created"})
                })
            } else {
                console.log(rows);
                const accessToken = jwt.sign({ username: r.name,email:r.email,userId: rows[0] }, accessTokenSecret);
                    res.json({response:r,token:accessToken})
            }
        })
    }).catch((error)=>{
        console.log(error);
        res.send(JSON.stringify({"status":"Invalid request"}))
    })
})

module.exports= auth
