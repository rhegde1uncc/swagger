// example express server created for classwork not part of assignment 08
const express = require('express');
const app = express();
const port = 3000;

const axios = require('axios');

var cors = require('cors');
app.use(cors());

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { request } = require('express');

const options = {
    swaggerDefinition: {
        info: {
            title: 'test API',
            version: '1.0.0',
            description: 'test api is created for system integration class'
        },
        host: 'localhost:3000',
        basePath: '/',
    },
    apis: ['server.js'],
};

const specs = swaggerJsdoc(options);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

const prices = {
    food: [
        {
            title: 'Apple',
            price: '1'
        },
        {
            title: 'Orange',
            price: '2'
        },
        {
            title: 'Banana',
            price: '3'
        }
    ]
}


/**
* @swagger
* /prices:
*   get:
*     tags:
*       - Prices
*     summary: This should send all the prices
*     security:
*       - bearerAuth: []
*     consumes:
*       - application/json
*     produces:
*       - application/json
*     responses:
*       200:
*         description: List of all prices
*       401:
*         description: No auth token
*       404:
*         description: Not found
*/
app.get('/prices', (req, res) => {
    res.json(prices);
})

app.get('/say', async (req, res) => {
    var keyword = req.query.keyword;
    var url = 'https://q5x4rs1yai.execute-api.us-east-2.amazonaws.com/prod/test?keyword='
    //console.log(url + `${keyword}`);
     await axios.get(url + `${keyword}`)
        .then(function (response) {
            //console.log(response.data);
            res.status(200).json(response.data);
        })
        .catch(function (error) {
            res.status(500).send('Error from Lambda ');
        })
    
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})