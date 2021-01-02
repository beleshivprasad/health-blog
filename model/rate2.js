const mongoose = require( 'mongoose' );
const rateSchema = new mongoose.Schema( {
    email:{
        type:String,
        required:true
    },
    rate: {
        type: Number,
        required: true
    },
    feedback: {
        type: String,
        required: true
    },
} );

module.exports = mongoose.model( "rate2", rateSchema );