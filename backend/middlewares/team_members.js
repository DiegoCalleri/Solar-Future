const team_members = require('../models/team_members');

const findAllTeamMembers = async (req, res, next) => {
    req.teamMembersArray = await team_members.find({}).sort({ createdAt: 1 });
    next();
};

const findTeamMemberById = async (req, res, next) => {
    try {
        req.teamMember = await team_members.findById(req.params.id);
        next();
    } catch (err) {
        res.status(404).send({ message: 'Участник не найден' });
    }
};

const updateTeamMember = async (req, res, next) => {
    try {
        if (req.body.skills && typeof req.body.skills === 'string') {
            req.body.skills = req.body.skills.split(',').map(s => s.trim()).filter(Boolean);
        }
        req.teamMember = await team_members.findByIdAndUpdate(req.params.id, req.body, { new: true });
        next();
    } catch (err) {
        res.status(404).send({ message: 'Ошибка при обновлении участника' });
    }
};

const deleteTeamMember = async (req, res, next) => {
    try {
        await team_members.findByIdAndDelete(req.params.id);
        next();
    } catch (err) {
        res.status(404).send({ message: 'Ошибка при удалении участника' });
    }
};

const createTeamMember = async (req, res, next) => {
    try {
        if (req.body.skills && typeof req.body.skills === 'string') {
            req.body.skills = req.body.skills.split(',').map(s => s.trim()).filter(Boolean);
        }
        req.teamMember = await team_members.create(req.body);
        next();
    } catch (err) {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).send(JSON.stringify({ message: 'Ошибка при добавлении участника' }));
    }
};

module.exports = {
    findAllTeamMembers,
    findTeamMemberById,
    updateTeamMember,
    deleteTeamMember,
    createTeamMember,
};
