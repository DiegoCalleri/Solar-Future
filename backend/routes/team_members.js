const teamRouter = require('express').Router();
const {
    findAllTeamMembers,
    findTeamMemberById,
    updateTeamMember,
    deleteTeamMember,
    createTeamMember,
} = require('../middlewares/team_members');
const {
    sendAllTeamMembers,
    sendTeamMemberUpdated,
    sendTeamMemberCreated,
    sendTeamMemberDeleted,
} = require('../controllers/team_members');
const { checkAuth } = require('../middlewares/auth');

teamRouter.get('/team_members', findAllTeamMembers, sendAllTeamMembers);
teamRouter.put('/team_members/:id', checkAuth, findTeamMemberById, updateTeamMember, sendTeamMemberUpdated);
teamRouter.delete('/team_members/:id', checkAuth, deleteTeamMember, sendTeamMemberDeleted);
teamRouter.post('/team_members', checkAuth, createTeamMember, sendTeamMemberCreated);

module.exports = teamRouter;
