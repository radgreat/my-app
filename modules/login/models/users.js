const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true 
    },

    password: {
        type: String,
        required: false,
        minlength: 8
    },

    role: {
        type: String,
        enum: [ 'user', 'admin'],
        default: 'user'
    },

    verified: {
        type: Boolean,
        default: false
    },

    googleId: {
        type: String,
        unique: true,
        sparse: true, // important so MongoDB allows multiple nulls
        default: null
    },

    // Optional: if you want to store the name returned from Google
    name: {
        type: String,
        default: null
    },

    facebookId: {
        type: String,
        unique: false,
        sparse: true,
        default: null
    },

    authProvider: {
        type: String,
        enum: ['local', 'google', 'facebook', 'both'],
        default: 'local'
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
})

// // 🔐 Auto-hash password before saving
// userSchema.pre('save', async function (next) {
//   // Only hash if password is new or modified
//   if (!this.isModified('password')) return next();

//   try {
//     const hashed = await bcrypt.hash(this.password, 10);
//     this.password = hashed;
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

module.exports = mongoose.model('Users', userSchema);

//THIS LINE prevents OverwriteModelError:
//module.exports = mongoose.models.Users || mongoose.model('Users', userSchema);

