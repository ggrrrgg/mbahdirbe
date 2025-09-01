const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;


const UserSchema = new Schema({
    firstName: {
        type: String,
        required: false,
        unique: false,
        trim: true
    },
    lastName: {
        type: String,
        required: false,
        unique: false,
        trim: true
    },
    businessName: {
        type: String,
        required: false,
        unique: false,
        trim: true
    },
    telephone: {
        type: String,
        required: false,
        unique: false
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, 'is invalid']
    },
    website: {
        type: String,
        required: false,
        unique: false,
        trim: true,
        validate: {
            validator: function (v) {
                return !v || /^(https?:\/\/)[\w.-]+\.[a-z]{2,}.*$/.test(v);
            },
            message: props => `${props.value} is not a valid URL!`
        }
    },
    password: {
        type: String,
        required: true,
        unique: false,
        minlength: 8
    },
    address: {
        type: String,
        required: false,
        unique: false,
        trim: true
    },
    admin: {
        type: Boolean,
        default: false
    }
});

// 🔑 Pre-save hook to hash password
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); // only hash if new or modified
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// 🔓 Method to compare password during login
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// const ModelName = mongoose.model('Name that appears in Cloud Atlas GUI');
const User = mongoose.model('User', UserSchema);

module.exports = {
	User
}