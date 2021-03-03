const express = require('express');
const app = express();
const port = 3000;

var cors = require('cors');
app.use(cors());

const { check, validationResult } = require('express-validator');

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const mariadb = require('mariadb');
const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'sample',
    port: 3306,
    connectionLimit: 5
});

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
    next();
});


const options = {
    swaggerDefinition: {
        info: {
            title: 'test API',
            version: '1.0.0',
            description: 'test api is created for system integration class'
        },
        host: '178.128.158.144:3000',
        basePath: '/',
    },
    apis: ['server.js'],
};

const specs = swaggerJsdoc(options);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

app.get('/', (req, res) => {
    res.send('Hello');
});


/**
* @swagger
* /api/v1/foods:
*   get:
*     tags:
*       - Food
*     summary: This should send all the foods
*     consumes:
*       - application/json
*     produces:
*       - application/json
*     responses:
*       200:
*         description: List of all foods
*       500:
*         description: Internal server error
*/
app.get('/api/v1/foods', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query('SELECT * FROM foods');
        res.status(200).json(rows);

    } catch (err) {
        res.status(500).send('Error while fetching foods');
        throw err;
    } finally {
        if (conn) return conn.end();
    }
})

/**
* @swagger
* /api/v1/customer:
*   get:
*     tags:
*       - Customer
*     summary: This should get all the customers
*     consumes:
*       - application/json
*     produces:
*       - application/json
*     responses:
*       200:
*         description: List of all customers
*       500:
*         description: Internal server error
*/
app.get('/api/v1/customer', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query('SELECT * FROM customer');
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).send('Error while fetching customers');
        throw err;
    } finally {
        if (conn) return conn.end();
    }
})

/**
* @swagger
* /api/v1/company:
*   get:
*     tags:
*       - Company
*     summary: This should get all the companies
*     consumes:
*       - application/json
*     produces:
*       - application/json
*     responses:
*       200:
*         description: List of all companies
*       500:
*         description: Internal server error
*/
app.get('/api/v1/company', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query('SELECT * FROM company');
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).send('Error while fetching companies');
        throw err;
    } finally {
        if (conn) return conn.end();
    }
})

/**
* @swagger
* /api/v1/company/{id}:
*   get:
*     tags:
*       - Company
*     summary: It will return particular company with ID
*     consumes:
*       - application/json
*     produces:
*       - application/json
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: int
*         required:
*           - ID
*     responses:
*       200:
*         description: Company with particular ID
*       400:
*         description: Input validation Failed
*       500:
*         description: Internal server error
*/
app.get('/api/v1/company/:id', [
    check('id').isNumeric().not().isEmpty(),
], async (req, res) => {
    let id = req.params.id;
    let conn;
    try {
        validationResult(req).throw();
        try {
            conn = await pool.getConnection();
            const rows = await conn.query('SELECT * FROM company where COMPANY_ID = ?', [id]);
            //console.log(rows);
            res.status(200).json(rows);
        } catch (e) {
            res.status(500).send('Error while fetching company with given Id');
            throw err;
        }
    } catch (err) {
        res.status(400).send('Input validation failed');
    } finally {
        if (conn) return conn.end();
    }
})


/**
 * @swagger
 * /api/v1/company:
 *   post:
 *     tags:
 *       - Company
 *     summary: It will add company with given ID into system
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: company
 *         description: company to create
 *         schema:
 *           type: object
 *           required:
 *             - id
 *             - name
 *             - city
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *             city:
 *               type: string
 *     responses:
 *        '200':
 *          description: OK
 *        '201':
 *          description: Created
 *        '400':
 *          description: Input validation Failed
 *        '500':
 *          description: Internal server error  
 */
app.post('/api/v1/company', [
    check('id').isNumeric().not().isEmpty(),
    check('name').isLength({ min: 3 }).not().isEmpty().trim(),
    check('city').isLength({ min: 3 }).not().isEmpty().trim().escape()
], async (req, res) => {
    const { id, name, city } = req.body;
    let conn;
    try {
        validationResult(req).throw();
        try {
            conn = await pool.getConnection();
            const rows = await conn.query('INSERT INTO company SET COMPANY_ID = ?, COMPANY_NAME = ?, COMPANY_CITY = ?', [id, name, city]);
            //console.log(rows);
            res.status(201).json(rows);
        } catch (e) {
            res.status(500).send('Error while adding company with given details');
            throw err;
        }
    } catch (err) {
        res.status(400).send('Input validation failed');
    } finally {
        if (conn) return conn.end();
    }
})


/**
 * @swagger
 * /api/v1/company:
 *   put:
 *     tags:
 *       - Company
 *     summary: It will update/create company with given ID into system
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: company
 *         description: company to update/create
 *         schema:
 *           type: object
 *           required:
 *             - id
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *             city:
 *               type: string
 *     responses:
 *        '200':
 *          description: OK
 *        '201':
 *          description: Created
 *        '400':
 *          description: Input validation Failed
 *        '500':
 *          description: Internal server error  
 */
app.put('/api/v1/company', [
    check('id').isNumeric().not().isEmpty(),
    check('name').isLength({ min: 3 }).not().isEmpty().trim(),
    check('city').isLength({ min: 3 }).not().isEmpty().trim().escape()
], async (req, res) => {
    const { id, name, city } = req.body;
    let conn;
    try {
        validationResult(req).throw();
        try {
            conn = await pool.getConnection();
            const rows = await conn.query('SELECT * FROM company where COMPANY_ID = ?', [id]);
            if (rows.length) {
                const updaterows = await conn.query('UPDATE company SET COMPANY_NAME = ?, COMPANY_CITY = ? where COMPANY_ID = ?', [name, city, id]);
                //res.json(updaterows);
                res.send('Record updated/created successfully');
            }
            else {
                const insertrows = await conn.query('INSERT INTO company SET COMPANY_ID = ?, COMPANY_NAME = ?, COMPANY_CITY = ?', [id, name, city]);
                //res.json(insertrows);
                res.status(500).send('Record inserted successfully!');
            }
        } catch (e) {
            res.status(500).send('Error from put');
            throw e;
        }
    } catch (err) {
        res.status(400).send('Input validation failed');
    } finally {
        if (conn) return conn.end();
    }
})

/**
 * @swagger
 * /api/v1/company:
 *   patch:
 *     tags:
 *       - Company
 *     summary: It will update company with only if given company ID exists.
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: company
 *         description: company to update
 *         schema:
 *           type: object
 *           required:
 *             - id
 *             - name
 *             - city
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *             city:
 *               type: string
 *     responses:
 *        '200':
 *          description: OK
 *        '400':
 *          description:  Input Validation Failed
 *        '500':
 *          description: Internal server error 
 */
app.patch('/api/v1/company', [
    check('id').isNumeric().not().isEmpty(),
    check('name').isLength({ min: 3 }).not().isEmpty().trim(),
    check('city').isLength({ min: 3 }).not().isEmpty().trim().escape()
], async (req, res) => {
    const { id, name, city } = req.body;
    let conn;
    try {
        validationResult(req).throw();
        try {
            conn = await pool.getConnection();
            const rows = await conn.query('SELECT * FROM company where COMPANY_ID = ?', [id]);
            if (rows.length) {
                //console.log('entered update');
                const updaterows = await conn.query('UPDATE company SET COMPANY_NAME = ?, COMPANY_CITY = ? where COMPANY_ID = ?', [name, city, id]);
                //res.json(updaterows);
                res.status(200).send('success! record updated!');
            }
            else {
                res.status(500).send('Error from database operations');
            }
        } catch (e) {
            res.status(500).send('Error from database operations');
            throw err;
        }
    } catch (err) {
        res.status(400).send('Input validation failed');

    } finally {
        if (conn) return conn.end();
    }
})

/**
* @swagger
* /api/v1/company/{id}:
*   delete:
*     tags:
*       - Company
*     summary: It will delete particular company with ID
*     consumes:
*       - application/json
*     produces:
*       - application/json
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: int
*         required:
*           - ID
*     responses:
*       200:
*         description: Success message
*       400:
*         description: Input validation Failed
*       500:
*         description: Internal server error
*/
app.delete('/api/v1/company/:id', [
    check('id').isNumeric().not().isEmpty(),
], async (req, res) => {
    let id = req.params.id;
    let conn;
    try {
        validationResult(req).throw();
        try {
            conn = await pool.getConnection();
            const rows = await conn.query('DELETE FROM company where COMPANY_ID = ?', [id]);
            //console.log(rows);
            res.status(200).send('success! record deleted!');
        } catch (e) {
            res.status(500).send('Error while fetching company with given Id');
            throw err;
        }
    } catch (err) {
        res.status(400).send('Input validation failed');

    } finally {
        if (conn) return conn.end();
    }
})

/**
* @swagger
* /api/v1/agents:
*   get:
*     tags:
*       - Agents
*     summary: It will return all agents with particular commission rate
*     consumes:
*       - application/json
*     produces:
*       - application/json
*     parameters:
*       - in: query
*         name: commission
*         schema:
*           type: float
*         description: commission rate of agents
*     responses:
*       200:
*         description: Agents with particular commission rate
*       400:
*         description: Input validation Failed
*       500:
*         description: Internal server error
*/
app.get('/api/v1/agents', [
    check('commission').isNumeric().not().isEmpty(),
], async (req, res) => {
    //console.log(req.query.commission);
    let conn;
    try {
        validationResult(req).throw();
        try {
            conn = await pool.getConnection();
            const rows = await conn.query('SELECT * FROM agents where COMMISSION = ?', [req.query.commission]);
            //console.log(rows);
            res.status(200).json(rows);
        } catch (e) {

            res.status(500).send('Error while fetching agents with given commission');
            throw err;
        }
    } catch (err) {
        res.status(400).send('Input validation failed');
    } finally {
        if (conn) return conn.end();
    }
})
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})