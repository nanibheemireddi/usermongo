var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');//used to manipulate the post
var _ = require('underscore');
//var db = require('../model/db.js');


/* GET home page. */
router.get('/', function(req, res) {
	console.log("Hey nani")
	res.render('todo', { todo: 'Todos' });
});


router.get('/todos', function(req, res) {
	mongoose.model('todo').find({})
	.populate('user',{firstName:1,lastName:1})
	.exec(function(err,user){
		if(err){
			res.json(err)
		} else {
			res.json(user);
		}
	})
});


router.post('/todos', function(req, res) {

	var description = req.body.description;
	var completed = req.body.completed;
	var user = req.body.user
	mongoose.model('todo').create({
		description: description,
		completed: completed,
		user:user
	}, function(err, todo) {
		if(err) {
			res.status(400).send(err);
		} else {
			res.json(todo.toJSON());
		}
	});
});



router.get('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);

	db.todo.findById(todoId).then(function (todo) {
		if(todo) {
			res.json(todo.toJSON());
		} else {
			res.status(404).json('{error: data not found}');
		}
	}).catch(function () {
		res.status(500).json("{error: server not found}");
	});
	
});

router.delete('/todos/:id', function(req, res) {
 var todoId = parseInt(req.params.id, 10);

 db.todo.destroy({
 	where: {
 		id:todoId
 	}
 }).then(function(rowsDeleted) {
 		if(rowsDeleted === 0) {
 			res.status(404).json('{error: data not found }')
 		} else {
 			res.status(204).send();
 		}
 },function() {
 	res.status(500).json('{error: server not found}');
 });

});


router.put('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var body = _.pick(req.body, "description", "completed");
	var attributes = {};

	if (body.hasOwnProperty('completed')) {
		attributes.completed = body.completed;
	}
	
	if (body.hasOwnProperty('description')) {
		attributes.description = body.description;
	} 

	db.todo.findById(todoId).then(function(todo) {
		if(todo) {
			 todo.update(attributes).then(function(todo) {
				res.json(todo.toJSON());
			},function() {
				res.status(400).json({'error': 'input missing'});
			});
		} else {
			res.status(404).json({'error':'data not found'});
		}
	},function(e) {
		res.status(500).send(e);
	});
});



module.exports = router;
