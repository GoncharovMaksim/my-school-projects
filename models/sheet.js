//sheet.js
 import mongoose from 'mongoose';

const sheetSchema = new mongoose.Schema({
	sheetTitle: { type: String, required: true },
	sheetContent: { type: String, required: true },
});



const Sheet = mongoose.models.Sheet || mongoose.model('Sheet', sheetSchema);
module.exports = Sheet;
