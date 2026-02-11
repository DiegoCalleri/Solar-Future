const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: '' },
    skills: { type: [String], default: [] },
    organization: { type: String, default: '' },
    image: { type: String, default: '' },
    group: { type: String, enum: ['руководитель', 'участник'], default: 'участник' },
}, { timestamps: true });

module.exports = mongoose.model('team_members', teamMemberSchema);
