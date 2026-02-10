const allowedCors = [
    	'http://127.0.0.1:3000',
	'https://amirowdenis.ru',
];

function cors(req, res, next) {
    const { origin } = req.headers;
    
    if (allowedCors.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }

    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
    next();
};


module.exports = cors;