const express = require('express');
const app = express();
const port = 3000;

var cors = require('cors');
app.use(cors());

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

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

app.listen(port, () =>{
    console.log(`Example app listening at http://localhost:${port}`)
    })