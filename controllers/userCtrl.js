const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userCtrl = {

///////////////////////////////////////////      USER REGISTRATION      ////////////////////////////////////////////

    register: async (req, res) => {
        try {

            const { name, email, password } = req.body
            const user = await User.findOne({ email:req.body.email })                               // check whether user exists or not
            if (user) {
                res.status(400).json({ msg: 'User already exists' });
            }
            if (password.length < 6) {
                res.status(400).json({ msg: 'Password is too short' });
            }
            const passwordHash = await bcrypt.hash(password, 10);                    // hashing password
            const newUser = new User({ name, email, password: passwordHash })
            await newUser.save();                                                    // save to mongodb
            res.json({ msg: 'User Registration Successfull' });
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

///////////////////////////////////////////      USER LOGIN      ////////////////////////////////////////////

    login: async (req, res) => {
        try {
            await User.findOne({ email: req.body.email }).exec((err, user) => {                     //  searching for user
                if (err) return res.status(500).json({ msg: err.message })
                if (!user) return res.status(404).json({ msg: 'User not found' })

                let validPassword = bcrypt.compareSync(req.body.password, user.password);           // validating password
                if (!validPassword) return res.status(401).json({ accessToken: null, msg: "Invalid Password" });

                let token = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 86400 })       // token creation

                res.status(200).json({
                    accessToken: token,
                    name: user.name,
                    email: user.email
                })
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

///////////////////////////////////////////      USER INFORMATION      ////////////////////////////////////////////
    
    getDetails: async (req, res) => {
        const details = await User.findById(req.user.id)
            .populate({ path: 'schedule', select: 'day beginWork endWork' })
            .populate({ path: "limitedApps", select: "appName weekDayLimit weekEndLimit" })
        res.status(200).json(details)
    }
}

module.exports = userCtrl;
