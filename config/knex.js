// var site ='simplifiedlabs.net';
// var usr = 'apcreati_manish';
// var pwd = 'splitup_codecoffee';
// var db ='apcreati_splitup';

// const knex=require('knex')({
// 	  client: 'mysql',
// 	  connection: {
// 	    host : 'simplifiedlabs.net',
// 	    user : 'apcreati_manish',
// 	    password : 'splitup_codecoffee',
// 	    database : 'apcreati_splitup'
// 	  }
// })

const knex=require('knex')({
	  client: 'mysql',
	  connection: {
	    host : 'localhost',
	    user : 'root',
	    password : '',
	    database : 'split_up'
	  }
})



module.exports=knex;