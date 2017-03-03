var mongoose = require('mongoose');
var todoSchema = new mongoose.Schema({
	description: {
		type: String,
		required: [true, 'firstName is required']
	}, 
	completed: {
		type: String,
		required: [true, 'lastName is required']
	},
	user : {
		type: mongoose.Schema.Types.ObjectId, ref: 'user' 
	}

	
});
mongoose.model('todo',todoSchema);