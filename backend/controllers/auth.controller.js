const User = require('../models/user.model');
const Token = require('../models/token.model')
const bcrypt = require('bcrypt')
var _ = require('lodash')
const auth_helper = require("../helpers/auth.helper");

const registerUser = async (req, res) => {
    try {
        if (req.body.password !== req.body.repassword) throw Error("Password and confirm password must match !")
        let user = await User.findOne({ email: req.body.email })
        if (user) throw Error("User existed!")
        user = new User();
        user.firstname = req.body.firstname;
        user.lastname = req.body.lastname;
        user.phonenumber = req.body.phonenumber
        user.email = req.body.email;
        user.password = bcrypt.hashSync(req.body.password, Math.round(process.env.SALT_ROUND))
        user.save((err, doc) => {
            if (err) {
                return res.status(500).json({ msg: err.message })
            }
            console.log(doc)
            return res.status(200).json({ msg: "Successfully register!" })
        })
    } catch (error) {
        return res.status(422).json({ msg: error.message })
    }
}

const logInUser = async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email })
        if (user === null)
            return res.status(422).json({ msg: "User or password not correct!" });
        let comparePassword = bcrypt.compareSync(req.body.password, user.password);
        if (!comparePassword)
            return res.status(422).json({ msg: "User or password not correct!" });
        let access_token = await auth_helper.generateToken(
            user.toJSON(),
            process.env.SECRET_TOKEN_KEY, process.env.TOKEN_LIFE
        );

        let refresh_token = await Token.findOne({ user: user._id })
        if (refresh_token !== null) {
            return res.status(200).json({
                msg: "Successly Login!",
                access_token: access_token,
                tokens: {
                    user_id: user._id,
                    access_token: access_token,
                    refresh_token: refresh_token
                },
            })
        }
        refresh_token = await auth_helper.generateToken(
            { user_id: user._id },
            process.env.SECRET_REFRESH_TOKEN_KEY,
            process.env.REFRESH_TOKEN_LIFE
        );

        await saveToken(refresh_token, user._id);
        // await saveCookiesWhenLogIn(res, user._id, access_token, refresh_token);

        return res.status(200).json({
            msg: "Successly Login!",
            access_token: access_token,
            tokens: {
                user_id: user._id,
                access_token: access_token,
                refresh_token: refresh_token
            },
        })
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

const logOutUser = async (req, res) => {

}

const getNewAccessToken = async (req, res) => {
    const refreshTokenFromClient = req.body.refresh_token || req.query.refresh_token || req.headers["x-refresh-token"];
    if (refreshTokenFromClient) {
        try {
            const decoded = await auth_helper.verifyToken(
                refreshTokenFromClient,
                process.env.SECRET_REFRESH_TOKEN_KEY
            );
            const _decoded = _.omit(decoded, ["iat", "exp"])

            let token = await Token.findOne({ user: _decoded.user_id })
            if (token == null) throw Error('Refresh token was expired. Please make a new signin request');
            const user = await User.findById(_decoded.user_id).exec()
            // console.log(user)
            const access_token = await auth_helper.generateToken(
                user.toJSON(),
                process.env.SECRET_TOKEN_KEY,
                process.env.TOKEN_LIFE
            );
            // res.cookie('TOKENS', { ...req.signedCookies.TOKENS, access_token: access_token }, { signed: true });
            // res.cookie('ACCESS_TOKEN', { access_token: access_token });

            return res.status(200).json({ access_token: access_token })
        } catch (error) {
            return res.status(403).json({
                msg: error.message
            });
        }
    } else {
        return res.status(403).send({
            msg: 'No token provided.',
        });
    }

}

const saveToken = async (refresh_token, user) => {
    try {
        await Token.findOneAndRemove({ user: user });
        await new Token({
            user: user._id,
            token: refresh_token
        }).save()
    } catch (error) {
        throw error
    }
}

const saveCookiesWhenLogIn = async (res, user_id, access_token, refresh_token) => {
    res.cookie('ACCESS_TOKEN', access_token)
    res.cookie('TOKENS', {
        user_id: user_id,
        access_token: access_token,
        refresh_token: refresh_token
    }, { maxAge: 2592000000, expires: new Date(Date.now() + 2592000000), signed: true })
}

const clearCookiesWhenLogOut = async (req, res, next) => {
    try {
        if (!req?.signedCookies?.TOKENS) throw Error('You haven\'t logged into your account');
        let cookieTOKENS = await req.signedCookies.TOKENS
        await Token.findOneAndRemove({ user: cookieTOKENS.user_id })
        await res.clearCookie('TOKENS')
        await res.clearCookie('ACCESS_TOKEN')
        return res.json({ msg: "logout success!" })
    } catch (error) {
        return res.status(401).json({ msg: error.message });
    }
}

module.exports = {
    registerUser,
    logInUser,
    getNewAccessToken
}
