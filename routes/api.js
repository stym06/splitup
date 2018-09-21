const express=require('express');
const app = express();
const router=express.Router();
const Joi=require('joi');
const knex=require('../config/knex'); //config and init
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
var secret = 'splitup';

//POST to /api/users
router.post('/users',function(req,res){
	const schema={
		name:Joi.string().min(3).max(30).required(),
		username:Joi.string().max(10),
		email:Joi.string().email(),
		password:Joi.string().min(3),
		password2:Joi.string().min(3)
	}

	const result1=Joi.validate(req.body,schema);

	if(result1.error){
		//if the input validation fails
		console.log(result1.error.details[0].message);
		res.send({"success":false,"result":result1.error.details[0].message});
		return; //end further execution
	}

	var data=req.body; //contains POST data

	bcrypt.hash(data.password, saltRounds, function(err, hash) {
	  	// Store hash in your password DB.
	 	knex('user').insert({
			name:data.name,
			username:data.username,
			email:data.email,
			password:hash
		},'id')
		.then(function(rows){
			//201 status code indicates successful db addition
			res.status(201).send({"success":true,"result":rows});
		})
		.catch(function(err){
			//error handling
			if(err) res.send({"success":false,"result":err});
		})
	});

})

//POST /api/authenticate
router.post('/authenticate',function(req,res){
	const schema={
		email:Joi.string().email(),
		password:Joi.string().min(3)
	}

	const result1=Joi.validate(req.body,schema);

	if(result1.error){
		//if the input validation fails
		console.log(result1.error.details[0].message);
		res.send({"success":false,"result":result1.error.details[0].message});
		return; //end further execution
	}

	var data=req.body; //contains POST data

	knex.select().from('user').where({email:data.email}).then(function(row){
		var username=row[0].username;
		var email = row[0].email;
		var hash = row[0].password;
		var id = row[0].id;
		bcrypt.compare(data.password, hash, function(err, result) {
		    // res == true
		    if(result){
		    	var token = jwt.sign({id:id,username: username,email:email}, secret, { expiresIn: '1h' });
		    	res.send({"success":true,"username":username,"token":token});
		    }
		    else
		    	res.send({"success":false,"result":"Email/Password incorrect!"});
		});
	})
	.catch(function(err){
		//error handling
		res.send({"success":false,"error":err,"result":"Could not authenticate user"});
	})
})

// POST /api/teams
// Makes changes to `team` & `tag` & `team_tag`
router.post('/teams',function(req,res){
	const schema={
		name:Joi.string().min(3).max(30).required(),
		desc:Joi.string().min(3).max(100).required(),
		type:[Joi.string(), Joi.number()],
		img:Joi.string().required(),
		uid:[Joi.string(), Joi.number()],
		limit:[Joi.string(), Joi.number()],
		count:[Joi.string(), Joi.number()],
		tag: Joi.array().items(Joi.object())
	}

	const result1=Joi.validate(req.body,schema);

	if(result1.error){
		//if the input validation fails
		res.status(400).send({"error":result1.error.details[0].message});
		return; //end further execution
	}

	var data=req.body; //contains POST data
	knex('team').insert({
		name:data.name,
		desc:data.desc,
		type:data.type,
		feature_image_url:data.img,
		admin_user_id:data.uid,
		limit:data.limit,
		count:data.count
	})
	.returning('id')
	.then(function(id){
		//201 status code indicates successful db addition
		// console.log(id);
		var team_id = id[0];
		for(var i=0;i<data.tag.length;i++){
			var tag2 = data.tag[i].name;
			knex('tag').insert({
				name:tag2
			})
			.returning('id2')
			.then(function(id2){
				var tag_id=id2[0];
				// console.log("Tag: "+tag_id);
				// console.log("Team: "+team_id);
				knex('team_tag').insert({
					team_id:team_id,
					tag_id:tag_id
				})
				.then(function(data){
					
				})
			})
			// console.log(data.tag[i].name);
		}
		res.status(201).send({"status":201});
	})
	.catch(function(err){
		//error handling
		if(err) res.status(500).send(err).end();
	})
})

//POST /api/messages/
router.post('/messages',function(req,res){
	const schema = {
		message: Joi.string().min(3).max(1000).required(),
		team_id:[Joi.string(), Joi.number()],
		user_id:[Joi.string(), Joi.number()],
	}

	const result1=Joi.validate(req.body,schema);

	if(result1.error){
		//if the input validation fails
		res.status(400).send(result1.error.details[0].message);
		return; //end further execution
	}

	var data=req.body; //contains POST data
	knex('team_chat').insert({
		message:data.message,
		team_id:data.team_id,
		user_id:data.user_id
	},'id')
	.then(function(rows){
		//201 status code indicates successful db addition
		res.status(201).send({"status":201,"result":rows});
	})
	.catch(function(err){
		//error handling
		if(err) res.status(500).send(err).end();
	})

})

//GET /api/teams/all
router.get('/teams/all',function(req,res){
	knex.select().from('team').then(function(rows){
		if(rows.length==0)
			res.status(404).send({"status":"null"});
		else
			res.status(200).send({"status":"ok","groups":rows});

	})
	.catch(function(err){
		//error handling
		if(err) res.status(500).send(err).end();
	})
})

//GET /api/teams/:user_id

//GET /team/:id
router.get('/team/:id',function(req,res){
	knex.select().from('team').where({id:req.params.id}).then(function(rows){
		if(rows.length==0)
			res.status(404).send({"error":1});
		else
			res.status(200).send({"error":0,"team":rows});

	})
	.catch(function(err){
		//error handling
		if(err) res.status(500).send(err).end();
	})
})

//GET /api/user/:user_id
router.get('/user/:id',function(req,res){
	knex.select().from('user').where({id:req.params.id}).then(function(rows){
		if(rows.length==0)
			res.send({"success":false});
		else
			res.send({"success":true,"result":rows[0]});

	})
	.catch(function(err){
		//error handling
		if(err) res.send({"success":false,"result":err});
	})
})

//Verification of token
router.use(function(req,res,next){
	var token = req.body.token || req.body.query || req.headers['x-access-token'];
	if(token){
		//verify token
		jwt.verify(token,secret,function(err,decoded){
			if(err) res.send({"success":false,"message":"Token invalid"});
			else{
				req.decoded = decoded;
				next();
			}
		})
	}
	else{
		res.send({"success":false,"result":"No token Provided."});
	}
})

//POST decrypting the token
router.post('/me',function(req,res){
	res.send(req.decoded);
})




module.exports=router;