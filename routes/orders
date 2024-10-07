const router = require('express').Router();
const db = require('../db');

router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM orders');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching users.')
    }
})

module.exports = router;