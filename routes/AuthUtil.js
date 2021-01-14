const FirebaseConfig = require('./FirebaseConfig');

const getAuthToken = (req, res, next) => {
    if (
        req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
        req.authToken = req.headers.authorization.split(' ')[1];
    } else {
        req.authToken = null;
    }
    next();
};


const checkIfAuthenticated = (req, res, next) => {
    getAuthToken(req, res, async () => {
        try {
            const { authToken } = req;
            const userInfo = await FirebaseConfig
                .auth()
                .verifyIdToken(authToken);
            req.user = userInfo;
            return next();
        } catch (e) {
            return res
                .status(200)
                .send({ message: 'Yetkiniz yoktur.' , status : 0});
        }
    });
};

module.exports = checkIfAuthenticated;