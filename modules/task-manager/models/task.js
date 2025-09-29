const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    
    details: {
        type: String,
        trim: true
    },

    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending'
    },

    dueDate: {
        type: Date
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    }
})

module.exports = mongoose.model('Task', taskSchema);