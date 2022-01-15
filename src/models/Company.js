const mongoose = require('mongoose');

const { Schema } = mongoose;

const companySchema = new Schema({
    companyName: {
        type: String,
        required: [true, 'Company name is required!'],
        unique: true,
        enum: ['COKE', 'PEPSI'],
    },
});

const Company = mongoose.model('Company', companySchema);

module.exports = Company;
