const mysql = require('mysql2')
const connection = mysql.createConnection({
  host: 'btnhobmygm6ugz0tjcmq-mysql.services.clever-cloud.com',
  user: 'u8gmxlh2mohvktli',
  password: 'oPEUV6oXW7eF2V2bhuBW',
  database: 'btnhobmygm6ugz0tjcmq'
})

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

module.exports= connection