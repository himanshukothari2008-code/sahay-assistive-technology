const { z } = require('zod');

// Middleware to validate request body, query, or params using Zod schemas
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    try {
      const parsed = schema.parse(req[source]);
      req[source] = parsed;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message
          }))
        });
      }
      next(error);
    }
  };
};

// Zod Schemas
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

const preferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'high-contrast', 'hc-yellow']).optional(),
  fontSize: z.string().or(z.number()).optional(),
  fontFamily: z.string().optional(),
  reduceMotion: z.boolean().optional(),
  easyRead: z.boolean().optional()
});

const quizSubmitSchema = z.object({
  answers: z.array(
    z.object({
      question_id: z.string(),
      selected_index: z.number().int().min(0)
    })
  ).min(1, 'Must answer at least one question')
});

const categorySchema = z.object({
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  title: z.string().min(2),
  icon: z.string().min(1),
  summary: z.string().min(5),
  color: z.string().default('blue'),
  display_order: z.number().int().optional().default(0)
});

const contentBlockSchema = z.object({
  category_id: z.string().min(1),
  type: z.enum(['overview', 'challenge', 'simulation', 'solution', 'tool', 'resource', 'myth_fact']),
  title: z.string().min(2),
  body_markdown: z.string().min(5),
  easy_read_body: z.string().optional(),
  language: z.string().default('en'),
  display_order: z.number().int().default(0),
  sources_json: z.string().or(z.array(z.any())).optional().default('[]')
});

const mediaSchema = z.object({
  category_id: z.string().min(1),
  type: z.enum(['video', 'image', 'audio']),
  url: z.string().url('Must be a valid URL'),
  title: z.string().min(2),
  alt_text: z.string().min(2, 'Alt text is required for accessibility'),
  caption: z.string().optional(),
  transcript: z.string().optional(),
  source_credit: z.string().optional()
});

const quizQuestionSchema = z.object({
  category_id: z.string().min(1),
  question: z.string().min(5),
  options: z.array(z.string()).min(2, 'At least 2 options required'),
  correct_index: z.number().int().min(0),
  explanation: z.string().min(5)
});

const aacItemSchema = z.object({
  label: z.string().min(1),
  symbol_icon: z.string().min(1),
  audio_phrase: z.string().min(1),
  category_group: z.string().min(1),
  display_order: z.number().int().optional().default(0)
});

const emergencyCardSchema = z.object({
  data_json: z.string().or(z.record(z.any()))
});

const feedbackSchema = z.object({
  message: z.string().min(3, 'Message must be at least 3 characters'),
  rating: z.number().int().min(1).max(5).optional().default(5)
});

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  preferencesSchema,
  quizSubmitSchema,
  categorySchema,
  contentBlockSchema,
  mediaSchema,
  quizQuestionSchema,
  aacItemSchema,
  emergencyCardSchema,
  feedbackSchema
};
