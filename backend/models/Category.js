const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    category: { 
        type: String, 
        default: 'Uncategorized' 
    },
    recipe:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Recipe'
    }]
});

module.exports = mongoose.model('Category', CategorySchema);