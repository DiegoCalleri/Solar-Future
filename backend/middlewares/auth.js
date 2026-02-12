const jwt = require("jsonwebtoken");

const checkAuth = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith("Bearer ")) {
        return res.status(401).send({ message: "Необходима авторизация" });
    }

    const token = authorization.replace("Bearer ", "");

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        return res.status(500).send({ message: "JWT_SECRET не задан" });
    }
    try {
        req.user = jwt.verify(token, secret);
        console.log(req.user, token);
    } catch (err) {
        console.log(err);
        return res.status(401).send({ message: "Необходима авторизация" });
    }

    next();

}

const checkCookiesJWT = (req, res, next) => {
    if (!req.cookies.jwt) {
        return res.redirect("/");
    }
    req.headers.authorization = `Bearer ${req.cookies.jwt}`;
    next();
};


module.exports = { checkAuth, checkCookiesJWT };