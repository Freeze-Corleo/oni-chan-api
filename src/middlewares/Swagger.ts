/**
 * Implement swagger middleware for API documentation
 *
 * @author Léo DELPON <leo.delpon@viacesi.fr>
 */

import { Application } from 'express';
import swaggerAutogen from 'swagger-autogen';
import swaggerUi from 'swagger-ui-express';

class Swagger {
    public swaggerUi = swaggerUi;
    public swaggerFile = require('../../src/swagger_output_file.json');
    public swaggerAutogen = swaggerAutogen;
    private doc = {
        info: {
            version: '1.0.0',
            title: 'My API',
            description:
                'Documentation automatically generated by the <b>swagger-autogen</b> module.'
        },
        host: 'localhost:3000',
        basePath: '/',
        schemes: ['http', 'https'],
        consumes: ['application/json'],
        produces: ['application/json'],
        tags: [
            {
                name: 'User',
                description: 'Endpoints'
            }
        ],
        securityDefinitions: {
            apiKeyAuth: {
                type: 'apiKey',
                in: 'header', // can be "header", "query" or "cookie"
                name: 'X-API-KEY', // name of the header, query parameter or cookie
                description: 'any description...'
            }
        },
        definitions: {
            Parents: {
                father: 'Simon Doe',
                mother: 'Marie Doe'
            },
            User: {
                name: 'Jhon Doe',
                age: 29,
                parents: {
                    $ref: '#/definitions/Parents'
                },
                diplomas: [
                    {
                        school: 'XYZ University',
                        year: 2020,
                        completed: true,
                        internship: {
                            hours: 290,
                            location: 'XYZ Company'
                        }
                    }
                ]
            },
            AddUser: {
                $name: 'Jhon Doe',
                $age: 29,
                about: ''
            }
        }
    };

    /**
     * Will auto generate swagger json
     * @constructor
     */
    constructor() {
        const filePath = '../../src/swagger_output_file.json';
        const endpointsFiles = ['../src/routes/Api.ts'];

        this.swaggerAutogen()(filePath, endpointsFiles, this.doc).then(async () => {
            await import('../index');
        });
    }

    /**
     * It mounts swagger middleware in _express and will be
     * displayed in /doc api endpoint
     * @param {Application} _express represent the express object
     * @returns {Application}
     */
    public mount(_express: Application): Application {
        _express.use(
            '/doc',
            this.swaggerUi.serve,
            this.swaggerUi.setup(this.swaggerFile)
        );
        return _express;
    }
}

export default new Swagger();
