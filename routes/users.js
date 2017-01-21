
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');//used to manipulate the post
var _ = require('underscore');
//var db = require('../db.js');


router.use(bodyParser.urlencoded({ extended: true }))
router.use(methodOverride(function(req, res){
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
      }
}))

router.use(bodyParser.json());
/* GET users listing. 
router.get('/', function(req, res) {
  res.send('respond with a resource');
});*/


router.post('/', function(req, res) {
	var firstName = req.body.firstName;
	var lastName = req.body.lastName;
	var email = req.body.Email;
	var dob = req.body.DOB;
	var gender = req.body.gender
	var age = req.body.age;

	//var body = _.pick(req.body, 'firstName', 'lastName', 'age');
	//console.log('body');
	mongoose.model('user').create({
		firstName: firstName,
		lastName:lastName,
		Email:email,
		DOB:dob,
		gender:gender,
		age: age
		},function(error, user) {
		if(error) {
			res.status(400).json(error);
			//console.log('creating user sucessfully');
		} else {
		console.log('creating user sucessfully' +user);
		res.format({
			html: function() {
			//res.location("user");
			res.redirect("/user");
			},
			json: function() { 
				res.json(user.toJSON());
			}
		});
	  }			

	});	
});

router.get('/', function(req,res) {
	mongoose.model('user').find({}, function(err, users) {
		if(err) {
			res.status(400).send(err);
		} else {
			res.format({
				html: function() {
					res.render('newindex.ejs', {
						"users": users 
					});
				},
				json: function(){
					res.json(users);
				}
			});
		}
	});
});


/*router.get('/all', function(req, res) {
	var query = req.query.params;
	//where = [];
	//where('firstName').equals('query.firstName');

	mongoose.model('user').find({}).where({
		firstName:{
			$match:query.firstName
		}
	}).exec(function(err, user) {
		if(err) {
			res.status(400).send(err);
		} else {
			res.format({
				html: function() {
					res.render('/user');
				},
				json: function() {
					res.json(users);
				}
			});
		}
	});
});
*/			
router.get('/new', function(req, res) {
    res.render('newuser', { title: 'Add New user' });
});

router.param('id', function(req, res, next, id) {
	mongoose.model('user').findById(id, function(err, user) {
		if(err) {
			console.log('error in requesting id');
			res.status(404).send('error: data not found');

		} else {
			req.id = id;
			next();
		}
	}); 
});


router.get('/:id', function(req, res) {
	//var userid = req.params.id;
	mongoose.model('user').findById(req.id, function(err, user) {
		if(err) {
			console.loG('hello');


			 res.status(400).send('error:getting id');
		} else {

			console.log('hello');
			//var userdob = user.DOB.toISOString();
			//userdob = userdob.substring(0, userdob.indexOf('T'));
			res.format({
				html: function() {
					res.render('newshow.ejs', {
						
						"user": user
					});
				},
				json: function() {
					res.json(user.toJSON());
				}
			});
		}
	});
});

router.get('/:id/edit', function(req,res) {
	mongoose.model('user').findById(req.id, function(err, user) {
		if(err) {
			res.status(400).send("error: getting id");
		} else {
			//var userdob = user.DOB.toISOString();
			//userdob = userdob.substring(0, userdob.indexOf('T'));

			console.log('user');
			console.log(user);
			console.log('user');
			res.format({
				html: function() {
					res.render('newedit.ejs', {
						title: 'Edit' + user._id,
						"user":user
					});
				},
				json: function() {
					res.json(user.tojson());
				}
			});
		}
	});
});

router.put('/:id/edit', function(req,res) {
	var firstName = req.body.firstName;
	var lastName = req.body.lastName;
	var email = req.body.Email;
	var dob = req.body.DOB;
	var gender = req.body.gender

	mongoose.model('user').findById(req.id, function(err, user) {

		if(err) {
			res.status(404).send('error: data not found!!!!');
			console.log('error in put');
		} else {
			user.update({
			firstName: firstName,
			lastName: lastName,
			Email: email,
			gender: gender

		}, function(err,user) {
			if(err) {
				console.log(err);
				res.status(400).send('error: problem in updating data');
			} else {
				res.format({
					html: function() {
						res.redirect('/user/' + req.id);
					},
					json: function() {
						res.json(user.toJSON());
					}
				});
			}
		});
	
		}
	});
});

router.delete("/:id", function(req, res) {
	mongoose.model('user').findById(req.id, function(err, user) {
		if(err) {
			res.status(404).send('error: data not found');
			console.log('error in delete')
		} else {
			user.remove(function(err, user) {
				if(err) {
					res.status(400).send('error: problem in updating data');
				} else {
					res.format({
						html: function() {
							res.redirect('/user');
						},
						json: function(){
							res.json(user);
						}
					});
				}
			});
		}
	});
});

module.exports = router;
