const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AFROCARDS API',
      version: '1.0.0',
      description: 'Documentation de l\'API Backend pour le jeu AfroCards',
      contact: {
        name: 'Support Technique',
        email: 'happy.azondekon@soar-engr.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Serveur de développement'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  // Chemins vers les fichiers contenant les annotations
  apis: ['./src/routes/*.js'] 
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = { swaggerDocs };