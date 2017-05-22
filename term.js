var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var termSchema = new Schema({
  term: { type: String, required: true },
  when: { type: String, required: true },
  created_at: Date,
  updated_at: Date
});

termSchema.pre('save', function(next) {
  var currentDate = new Date();
  this.updated_at = currentDate;
  if (!this.created_at)
    this.created_at = currentDate;
  console.log(this);  
  next();
});

var Term = mongoose.model('Term', termSchema);

module.exports = Term;