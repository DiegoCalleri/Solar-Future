const sendAllTeamMembers = (req, res) => {
    res.send(req.teamMembersArray);
};

const sendTeamMemberUpdated = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ message: 'Участник успешно обновлён' }));
};

const sendTeamMemberCreated = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Участник успешно добавлен' }));
};

const sendTeamMemberDeleted = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Участник успешно удалён' }));
};

module.exports = {
    sendAllTeamMembers,
    sendTeamMemberUpdated,
    sendTeamMemberCreated,
    sendTeamMemberDeleted,
};
