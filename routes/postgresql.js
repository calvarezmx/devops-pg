const { Pool } = require('pg');
var express = require('express');
var router = express.Router();

const connectionString = 'postgres://enpnrefnyunpkw:ee0757121f3d7d98482daf205e5a3f1dab121dd618447a7938032bd29cfc101a@ec2-34-204-127-36.compute-1.amazonaws.com:5432/dm8k818b40fp9';

const pool = new Pool({
    connectionString: connectionString,
    ssl: {
      rejectUnauthorized: false
    },
    max: 20,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000
  });

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('in postgresql.js');
});

router.get('/usersdb', async (req, res, next) => {
    const { rows = [], fields = [], rowCount = 0, command = '' } = await pool.query('SELECT * FROM public.usersdb');
    res.status(200).json({ rows, fields, rowCount, command });
});


router.post('/usersdb', async (req, res, next) => {
    const datetime = new Date().getTime();
    const { 
        name = `Nuevo usuario ${ datetime }`, 
        email = `email@mail.com ${ datetime }`, 
        phone = `234 ${ datetime }`, 
        country = 'México'
    } = req.body || {};


    const { rows = [], fields = [], rowCount = 0, command = '' } = await pool.query('INSERT INTO public.usersdb (name, email, phone, country, id) VALUES ($1, $2, $3, $4, $5)', [name, email, phone, country, datetime]);
    
    res.status(200).json({ rows, fields, rowCount, command });
});

router.patch('/usersdb/:id', async (req, res, next) => {
    const { id = '' } = req.params || {};
    const { 
        name = '',
        email = '',
        phone = '',
        country = ''
    } = req.body || {};


    const { rows = [], fields = [], rowCount = 0, command = '' } = await pool.query('UPDATE public.usersdb SET name=$1, email=$2, phone=$3, country=$4 WHERE id=$5', [name, email, phone, country, id]);
    
    res.status(200).json({ rows, fields, rowCount, command });
});

router.get('/usersdb/:id', async (req, res, next) => {
    const { id = '' } = req.params || {};
    const { rows = [], fields = [], rowCount = 0, command = '' } = await pool.query('SELECT * FROM public.usersdb WHERE id = $1', [ id ]);
    res.status(200).json({ rows, fields, rowCount, command });
});

module.exports = router;
