const { model, Schema } = require("mongoose")

const keyPointSchema = new Schema({
    classification: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    gallery: [],
    location: {
        lat: { type: String, required: true },
        lng: { type: String, required: true },
    },
    formattedAddress: {
        type: String,
        required: true,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
    }],
}, { timestamps: true });

module.exports = model('KeyPoint', keyPointSchema);