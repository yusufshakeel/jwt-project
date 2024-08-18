require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const {userAuth} = require('./user-auth');
const tweets = require('./tweets');
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

const refreshTokens = new Map();

app.get('/', (req, res) => {
    res.json({message: 'Hello, World!'});
});

app.get('/tweets', authenticate, (req, res) => {
    res.json({tweets});
});

app.post('/login', (req, res) => {
    const {username, password} = req.body;
    const {isValid} = userAuth(username, password);
    if (!isValid) {
        res.status(400).json({code: 400, errors: [{message: 'Invalid username or password'}]});
        return;
    }
    res.json(generateTokens(username));
});

app.delete('/logout', authenticate, (req, res) => {
    const {username} = req.tokenData;
    refreshTokens.delete(username);
    res.json({username});
});

app.post('/token', validateRefreshToken, (req, res) => {
    const {username} = req.tokenData;
    const {accessToken} = generateTokens(username, false);
    res.json({accessToken});
});

function authenticate(req, res, next) {
    const {authorization} = req.headers;
    const accessToken = authorization?.split(' ')[1];
    if (!accessToken) {
        res.status(400).json({code: 400, errors: [{message: 'Access token not found'}]});
        return;
    }
    jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            res.status(403).json({code: 403, errors: [{message: err.message}]});
            return;
        }
        req.tokenData = decoded;
        next();
    });
}

function validateRefreshToken(req, res, next) {
    const {token, username} = req.body;
    if (!token) {
        res.status(400).json({code: 400, errors: [{message: 'Token missing'}]});
        return;
    }
    if (!username) {
        res.status(400).json({code: 400, errors: [{message: 'Username missing'}]});
        return;
    }
    if (!refreshTokens.has(username)) {
        res.status(400).json({code: 400, errors: [{message: 'Invalid username or token'}]});
        return;
    }
    jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            res.status(403).json({code: 403, errors: [{message: err.message}]});
            return;
        }
        req.tokenData = decoded;
        next();
    });
}

function generateTokens(username, setRefreshToken = true) {
    const accessToken = jwt.sign({username}, process.env.JWT_ACCESS_TOKEN_SECRET, {expiresIn: '1m'});
    const refreshToken = jwt.sign({username}, process.env.JWT_REFRESH_TOKEN_SECRET);
    setRefreshToken && refreshTokens.set(username, {username, refreshToken});
    return {accessToken, refreshToken};
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});