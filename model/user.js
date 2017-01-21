var mongoose = require('mongoose');
var personschema = new mongoose.Schema({
	firstName: {
		type: String,
		required: [true, 'firstName is required']
	}, 
	lastName: {
		type: String,
		required: [true, 'lastName is required']
	},
	Email: {
		type:String,
		required: [true, 'email is required'],
		validate: {
			validator: function(v) {
				return /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(v);
			},
			message: 'is not a valid email address'
		}
	},
	DOB: { 
		type: Date, 
		dafault:Date.now,
		required: [true, 'dob is required'] 
	},
	gender: {
		type:String,
		required:[true, 'gender is required']
	},
	age: {
		type:Number,
		required:[true, 'age is required']
	}
});
mongoose.model('user',personschema);