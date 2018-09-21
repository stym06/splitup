var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var session = require('express-session');
const knex=require('./knex'); //config and init
var jwt = require('jsonwebtoken');
var secret = 'splitup';

module.exports = function(app,passport){

	
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(session({
	  secret: 'keyboard cat',
	  resave: false,
	  saveUninitialized: true,
	  cookie: { secure: false }
	}))

    passport.serializeUser(function(user, done) {
    	token = jwt.sign({id:user.id,username: user.username,email:user.email}, secret, { expiresIn: '1h' });
    	done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
	  User.findById(id, function(err, user) {
	    done(err, user);
	  });
	});

	passport.use(new GoogleStrategy({
	    clientID: '104841457116-5kurgam0kfarimrjj6m904pit4mh9gm6.apps.googleusercontent.com',
	    clientSecret: 'h3kBcBDSaYku5FooOa3EBjoF',
	    callbackURL: "http://localhost:8000/auth/google/callback"
	  },
	  function(accessToken, refreshToken, profile, done) {
	  		console.log(profile);
	  		var email = profile.emails[0].value;
	  		knex.select().from('user').where({email:email}).asCallback(function(err,rows){
	  			var user = rows[0];
	  			
	  			if(user && user != null){
	  				// console.log(user);
	  				done(null,user);
	  			}
	  			else{
	  				//User not found
	  				//Create User, add to database and done(null,user)
	  				var google_id = profile.id;
	  				var name=profile.displayName;
	  				var mail = profile.emails[0].value;

	  				knex('user').insert({
						name:name,
						google_id:google_id,
						email:mail
					},'id')
					.then(function(rows2){
						//201 status code indicates successful db addition
						var new_id = rows2[0];
						knex.select().from('user').where({id:new_id}).asCallback(function(err3,rows3){
							var user2 = rows3[0];
							// token = jwt.sign({id:user2.id,username: user2.username,email:user2.email}, secret, { expiresIn: '1h' });	
							if(user2){
								done(null,user2);
							}
							else{
								done(err);
							}
						})
			
					})
					.catch(function(err){
						//error handling
						done(err);
					})

	  				// done(err);
	  			}
	  		})
	  }
	))

	app.get('/auth/google',
	  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login','profile','email'] }));

	app.get('/auth/google/callback', 
	  passport.authenticate('google', { failureRedirect: '/auth/google' }),
	  function(req, res) {
	    res.redirect('/google/'+token);
	  });

	return passport;
}