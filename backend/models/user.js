const mongoose = require('mongoose');

const {Schema} = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    status: {
        type: Object,
        required: true
    },
    posts: [{
        type: Schema.types.ObjectId,
        ref: 'Post'
    }]
}, {timestamp: true});

module.exports = mongoose.model('User', userSchema);
