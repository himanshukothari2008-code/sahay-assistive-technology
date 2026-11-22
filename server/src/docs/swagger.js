const express = require('express');

const router = express.Router();

const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Sahay REST API',
    version: '1.0.0',
    description: 'WCAG 2.2 AA Compliant Educational & Assistive Technology Platform API. College Capstone Specification.',
    contact: {
      name: 'Sahay Engineering Team'
    }
  },
  servers: [
    {
      url: 'http://localhost:5000/api/v1',
      description: 'Local Development Server'
    }
  ],
  paths: {
    '/auth/register': {
      post: {
        summary: 'Register new user account',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string', example: 'Aarav Patel' },
                  email: { type: 'string', example: 'aarav@example.com' },
                  password: { type: 'string', minLength: 6, example: 'SecurePassword123' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Account created successfully' },
          409: { description: 'Email already exists' }
        }
      }
    },
    '/auth/login': {
      post: {
        summary: 'Login and establish session via httpOnly cookie',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'admin@accessiaid.org' },
                  password: { type: 'string', example: 'AdminPass123!' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Login successful' },
          401: { description: 'Invalid credentials' }
        }
      }
    },
    '/auth/logout': {
      post: {
        summary: 'Clear authentication cookie session',
        tags: ['Authentication'],
        responses: {
          200: { description: 'Logged out successfully' }
        }
      }
    },
    '/auth/me': {
      get: {
        summary: 'Get current authenticated user profile',
        tags: ['Authentication'],
        responses: {
          200: { description: 'User profile retrieved' },
          401: { description: 'Unauthenticated' }
        }
      }
    },
    '/categories': {
      get: {
        summary: 'List all disability categories with counts',
        tags: ['Public Data'],
        responses: {
          200: { description: 'Array of categories with block/quiz counts' }
        }
      }
    },
    '/categories/{slug}': {
      get: {
        summary: 'Get complete category details including all 8 sections and media',
        tags: ['Public Data'],
        parameters: [
          { name: 'slug', in: 'path', required: true, schema: { type: 'string' }, example: 'visual-impairment' }
        ],
        responses: {
          200: { description: 'Full category details' },
          404: { description: 'Category not found' }
        }
      }
    },
    '/quiz/{categoryId}/submit': {
      post: {
        summary: 'Submit answers for evaluation and record score',
        tags: ['Quizzes'],
        parameters: [
          { name: 'categoryId', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  answers: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        question_id: { type: 'string' },
                        selected_index: { type: 'integer' }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Evaluation score and detailed breakdown' }
        }
      }
    },
    '/search': {
      get: {
        summary: 'Search categories and assistive content',
        tags: ['Public Data'],
        parameters: [
          { name: 'q', in: 'query', required: true, schema: { type: 'string' }, example: 'screen reader' }
        ],
        responses: {
          200: { description: 'Matched results' }
        }
      }
    },
    '/me/preferences': {
      get: {
        summary: 'Get user accessibility settings',
        tags: ['User Account'],
        responses: { 200: { description: 'User preferences' } }
      },
      put: {
        summary: 'Update accessibility settings',
        tags: ['User Account'],
        responses: { 200: { description: 'Preferences updated' } }
      }
    },
    '/admin/stats': {
      get: {
        summary: 'Administrative metrics (users, attempts, averages)',
        tags: ['Admin Panel'],
        responses: {
          200: { description: 'System statistics' },
          403: { description: 'Admin privileges required' }
        }
      }
    }
  }
};

// Raw JSON spec
router.get('/swagger.json', (req, res) => {
  res.json(openApiSpec);
});

// Interactive Swagger UI HTML
router.get('/', (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>AccessiAid API Documentation (Swagger)</title>
      <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" />
      <style>
        body { margin: 0; background: #fafafa; font-family: sans-serif; }
        .topbar { display: none; }
      </style>
    </head>
    <body>
      <div id="swagger-ui"></div>
      <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js"></script>
      <script>
        window.onload = function() {
          SwaggerUIBundle({
            url: "/api/docs/swagger.json",
            dom_id: '#swagger-ui',
            deepLinking: true,
            presets: [
              SwaggerUIBundle.presets.apis,
              SwaggerUIBundle.SwaggerUIStandalonePreset
            ]
          });
        };
      </script>
    </body>
    </html>
  `;
  res.send(html);
});

module.exports = router;
