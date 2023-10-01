var express = require('express');
var router = express.Router();
var connection = require("../db")
var authenticateJWT = require('./verfiyjwt')
const jwtDecode =require('jwt-decode')

/* GET users listing. */

router.get('/', function(req, res, next) {
  connection.query('SELECT * from users', (err, rows, fields) => {
    if (err) throw err
    console.log(rows);
    res.send(`${JSON.stringify(rows)}`)
  })
  // res.send("hello")
});

router.get('/getAllNotes',authenticateJWT,(req,res)=>{
  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1];
  const id= jwtDecode(token).userId.id;
  try {
    connection.query(`Select * from notes where id=${id}`,(err,rows,fields)=>{
      if(err) throw err;
      if(rows.length>0)
      res.send(JSON.stringify(rows))
      else {
        res.json({response:"No notes found"})
      }
    })
  }
  catch (error) {
    res.sendStatus(500).send("Error")
  }
})

router.get('/getNote/:id',(req,res,next)=>{
  try {
    connection.query(`Select description,title from Notes where id=${req.params.id}`,(err,rows,fields)=>{
      if(err) throw err;
      if(rows.length>0)
      res.send(JSON.stringify(rows))
      else {
        console.log("Hello error");
        res.status(404).send("No note found with id "+ req.params.id)
      }
    })
  } catch (error) {
      res.sendStatus(500).send("No Note Found with id "+req.params.id)
  }
})

router.put('/updateNotes',authenticateJWT,(req,res)=>{
  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1];
  const id= jwtDecode(token).userId.id;
  const title = req.body.title;
  const description = req.body.description;
  const noteId = req.body.noteId;
  try {
    connection.query(`update notes set title="${title}",description="${description}" where noteId=${noteId} and id=${id}`,(err,rows,fields)=>{
      if(err) throw err;
      res.send("Updated Successfully")
    
    })
  } catch (error) {
    res.status(404).send("Error")
  }
})

router.post('/createNotes',authenticateJWT,(req,res)=>{
  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1];
  const id= jwtDecode(token).userId.id;
  try {
    connection.query(`Insert into notes (description,title,id) values ('${req.body.noteData}','${req.body.title}', ${id})`,(err,rows,fields)=>{
      if (err) throw err;
      res.send("Created Successfully")
    })
  } catch (error) {
    res.sendStatus(500)
  }
})

router.delete('/deleteNote/:id',authenticateJWT,(req,res)=>{
  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1];
  const id= jwtDecode(token).userId.id;
  try {
    connection.query(`delete from notes where noteId=${req.params.id}`,(err,rows,fields)=>{
      if (err) throw err;
      res.send("Deleted Successfully")  
    })
  } catch (error) {
    res.status(403).send("Unable to delete ,try again later")
  }
})


module.exports = router;
