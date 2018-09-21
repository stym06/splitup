const express = require('express');
const app = express();
const morgan = require('morgan');
const knex=require('./config/knex'); //config and init
const Joi=require('joi');
const path=require('path');
const auth = require('./config/auth');
const passport = require('passport');
const social = require('./config/passport')(app,passport);

app.use(auth);


const port = process.env.PORT || 8000;

// app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(__dirname+'/public'));


app.use('/api',require('./routes/api'));



app.get('*',function(req,res){
	res.sendFile(path.join(__dirname+'/public/views/index.html'));
})

app.listen(port,function(){
	console.log('Connected!');
})