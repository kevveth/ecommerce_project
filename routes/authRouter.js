const asyncErrorHandler = require("../utils/AsyncErrorHandler");

const router = require("express").Router();

router.get('/status', (req, res) => {
    console.log("Inside /auth/status endpoint");
    console.log(req.user)
    console.log(req.session)
    console.log(`session_id: ${req.session.id}`)

    return req.user ? res.send(req.user) : res.sendStatus(401);
})

module.exports = router;