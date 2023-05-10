const { model, Schema } = require("mongoose")

const siteSchema = new Schema({ // Opciones de mongoose para definir esquema:https://mongoosejs.com/docs/schematypes.html#schematype-options
    // agentId: { type: Number },
    name: { type: String, unique: true},
    // slug: { type: String },
    status: { type: String },
    description: { type: String },
    category: { type: String },
    // price: { type: String },
    // isNegotiable: { type: Boolean },
    // propertyType: { type: String },
    // condition: { type: String },
    rating: { type: Schema.Types.Mixed },
    ratingCount: { type: Number },
    contactNumber: { type: String },
    inclusiveElements: [String],
    // image: {
    //     type: {
    //         url: { type: String },
    //         thumb_url: { type: String }
    //     }
    // },
    schedule: {
        Lunes: {
            start: { type: String },
            end: { type: String },
        },
        Martes: { 
            start: { type: String },
            end: { type: String },
        },
        Miercoles: { 
            start: { type: String },
            end: { type: String },
        },
        Jueves: { 
            start: { type: String },
            end: { type: String },
        },
        Viernes: { 
            start: { type: String },
            end: { type: String },
        },
        Sabado: { 
            start: { type: String },
            end: { type: String },
        },
        Domingo: { 
            start: { type: String },
            end: { type: String },
        },
    },
    siteAddress: { type: String },
    location: {
            // id: { type: Number },
            lat: { type: String },
            lng: { type: String },
            formattedAddress: { type: String },
            zipcode: { type: String },
            city: { type: String },
            state_long: { type: String },
            state_short: { type: String },
            country_long: { type: String },
            country_short: { type: String }
    },
    locality: { type: String },
    neighborhood: { type: String },
    siteAddress: { type: String },
    gallery: [],
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
},
    { timestamps: true })

module.exports = model("Site", siteSchema) // Después mongo le pone la s (users)