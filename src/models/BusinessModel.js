const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BusinessSchema = new Schema({
    businessName: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
        unique: false,
        required: true
    },
    images: [{
        type: String,
        unique: false,
        required: false
    }],
    telephone: {
        type: String,
        required: false,
        unique: false
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
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, 'is invalid']
    },
    address: {
        type: String,
        required: false,
        unique: false,
        trim: true
    }
});

const Business = mongoose.model('Business', BusinessSchema)

module.exports = { Business }