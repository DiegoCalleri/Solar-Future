const sendAllUsers = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(req.user));
}

const sendUserCreated = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({message: 'Пользователь успешно создан'}));
}

const sendUserUpdated = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({message: 'Пользователь успешно обновлен'}));
};

const sendUserDeleted = (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({message: 'Пользователь успешно удален'}));
};

const sendMe = (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(req.user));
};

module.exports = { sendAllUsers, sendUserCreated, sendUserUpdated, sendUserDeleted, sendMe };