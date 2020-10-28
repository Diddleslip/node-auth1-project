const bcryptjs = require("bcryptjs");

const router = require("express").Router();

const Users = require("../users/user-model"); // Make DB here
const { isValid } = require("../users/users-service");

function restricted(req, res, next) {
    if(req.session && req.session.loggedIn) {
        next();
    } else {
        res.status(401).json({ message: "You shall not pass!" });
    }
}


router.post("/register", (req, res) => {
    const credentials = req.body;
    
    if(isValid(credentials)) {
        const rounds = process.env.BCRYPT_ROUNDS || 8;
        
        // Hash the password
        const hash = bcryptjs.hashSync(credentials.password, rounds);
        
        credentials.password = hash;
        
        // Save the user to the database
        Users.add(credentials)
        .then(response => {
            res.status(201).json({ data: response });
        })
        .catch(error => {
            res.status(500).json({ message: error.message });
        })
        
    } else {
        res.status(400).json({ message: "Please provide username and password" });
    }
})

router.post("/login", (req, res) => {
    const { username, password } = req.body;
    
    if(isValid(req.body)) {
        Users.findBy({ username: username })
        .then(([user]) => {
            req.session.loggedIn === true;

            // Compare the password to the hash stored in the database
            if(user && bcryptjs.compareSync(password, user.password)) {
                // We can save information about the client inside the session (req.session)
                req.session.loggedIn = true;
                req.session.user = user;

                res.status(200).json({ message: "Welcome to our API" });
            } else {
                res.status(401).json({ message: "Invalid credentials!" });
            }
        })
        .catch(error => {
            res.status(500).json({ message: error.message });
        })
    } else{
        res.status(400).json({ message: "Please provide username and password" });
    }
})

router.get("/logout", (req, res) => {
    if(req.session) {
        req.session.destroy(error => {
            if(error) {
                res.status(500).json({ message: "We cannot log you out, try again later." });
            } else {
                res.status(204).end();
            }
        })
    } else {
        res.status(204).end();
    }
})


router.use(restricted);

router.get("/users", (req, res) => {
    Users.find()
    .then(users => {
        res.json(users);
    })
    .catch(error => {
        res.send(error);
    })
})

module.exports = router;