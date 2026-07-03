import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Courier Management API",
    version: "1.0.0",
    description: "API documentation for the Courier Management system",
  },
  servers: [
    {
      url: "http://localhost:" + (process.env.PORT || 5000),
      description: "Development server",
    },
  ],

  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },

  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./routes/*.js"], // Path to the API routes for documentation
};

export const swaggerSpec = swaggerJSDoc(options);
