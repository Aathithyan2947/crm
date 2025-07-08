import { z } from 'zod';

export function buildSchema(formDetails) {
  const shape = {};

  formDetails.forEach((field) => {
    let schema;

    switch (field.type) {
      case 'multi-select':
        schema = z.array(z.union([z.string(), z.number()]));
        if (field.validation?.required) {
          schema = schema.min(1, `${field.label} is required`);
        } else {
          schema = schema.optional().default([]);
        }
        break;

      case 'toggle':
      case 'boolean':
        schema = z.boolean();
        if (field.validation?.required) {
          schema = schema.refine((val) => val !== undefined, {
            message: `${field.label} is required`,
          });
        }
        break;

      case 'searchable-select':
      case 'simple-select':
        schema = z.union([z.string(), z.number()]);
        if (field.validation?.required) {
          schema = schema.refine(
            (val) => val !== null && val !== undefined && val !== '',
            `${field.label} is required`
          );
        } else {
          schema = schema.optional().nullable();
        }
        break;

      case 'number':
        schema = z.union([
          z.number(),
          z.string().transform((val, ctx) => {
            const parsed = parseFloat(val);
            if (isNaN(parsed)) {
              ctx.addIssue({
                code: z.ZodIssueCode.invalid_type,
                expected: 'number',
                received: 'string',
              });
              return z.NEVER;
            }
            return parsed;
          }),
        ]);

        // Apply min/max validation if specified
        if (field.validation?.min !== undefined) {
          schema = schema.refine(
            (val) => val >= field.validation.min,
            `${field.label} must be at least ${field.validation.min}`
          );
        }
        if (field.validation?.max !== undefined) {
          schema = schema.refine(
            (val) => val <= field.validation.max,
            `${field.label} must be at most ${field.validation.max}`
          );
        }

        if (field.validation?.required) {
          schema = schema.refine(
            (val) => val !== null && val !== undefined,
            `${field.label} is required`
          );
        } else {
          schema = schema.optional().nullable();
        }
        break;

      case 'dynamic-input':
      case 'dynamic-input-group':
        if (field.fields) {
          const nestedShape = {};
          field.fields.forEach((nestedField) => {
            let fieldSchema;

            // Handle different field types within the dynamic group
            switch (nestedField.type) {
              case 'simple-select':
                fieldSchema = z.union([z.string(), z.number()]);
                break;
              case 'toggle':
                fieldSchema = z.boolean();
                break;
              case 'number':
                fieldSchema = z.union([
                  z.number(),
                  z.string().transform((val, ctx) => {
                    const parsed = parseFloat(val);
                    if (isNaN(parsed)) {
                      ctx.addIssue({
                        code: z.ZodIssueCode.invalid_type,
                        expected: 'number',
                        received: 'string',
                      });
                      return z.NEVER;
                    }
                    return parsed;
                  }),
                ]);
                break;
              default: // text, text-area, etc.
                fieldSchema = z.string();
            }

            // Apply validation if required
            if (nestedField.validation?.required) {
              if (nestedField.type === 'toggle') {
                fieldSchema = fieldSchema.refine(
                  (val) => val !== undefined,
                  `${nestedField.label} is required`
                );
              } else {
                fieldSchema = fieldSchema.min(
                  1,
                  `${nestedField.label} is required`
                );
              }
            } else {
              fieldSchema = fieldSchema.optional();

              // Set default value for toggle if specified
              if (
                nestedField.type === 'toggle' &&
                nestedField.defaultValue !== undefined
              ) {
                fieldSchema = fieldSchema.default(nestedField.defaultValue);
              }
            }

            nestedShape[nestedField.name] = fieldSchema;
          });

          schema = z.array(z.object(nestedShape));

          if (field.validation?.required) {
            schema = schema.min(1, `At least one ${field.label} is required`);
          } else {
            schema = schema.optional().default([]);
          }
        } else {
          schema = z
            .array(
              z.object({
                value: z
                  .string()
                  .min(1, `${field.label} items cannot be empty`),
              })
            )
            .optional()
            .default([]);
        }
        break;

      case 'date':
      case 'datetime':
        schema = z
          .string()
          .refine(
            (val) => !val || !isNaN(Date.parse(val)),
            'Invalid date format'
          );
        if (field.validation?.required) {
          schema = schema.refine(
            (val) => val && val.length > 0,
            `${field.label} is required`
          );
        } else {
          schema = schema.optional();
        }
        break;

      case 'email':
        schema = z.string().email('Invalid email format');
        if (field.validation?.required) {
          schema = schema.min(1, `${field.label} is required`);
        } else {
          schema = schema.optional();
        }
        break;

      default: // text, text-area, etc.
        schema = z.string();
        if (field.validation?.required) {
          schema = schema.min(1, `${field.label} is required`);
        } else {
          schema = schema.optional();
        }
    }

    if (field.showIf) {
      shape[field.name] = z
        .union([schema, z.undefined()])
        .superRefine((val, ctx) => {
          const formValues = ctx.parent;
          if (field.showIf(formValues) && !schema.safeParse(val).success) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `${
                field.label
              } is required when ${field.showIf.toString()} condition is met`,
            });
          }
        });
    } else {
      shape[field.name] = schema;
    }
  });

  return z.object(shape).superRefine((values, ctx) => {
    formDetails.forEach((field) => {
      if (field.dependsOn) {
        const dependentValue = values[field.dependsOn];
        if (dependentValue && !values[field.name]) {
          ctx.addIssue({
            path: [field.name],
            code: z.ZodIssueCode.custom,
            message: `${field.label} is required when ${field.dependsOn} is set`,
          });
        }
      }

      if (field.customValidation) {
        const result = field.customValidation(values);
        if (typeof result === 'string') {
          ctx.addIssue({
            path: [field.name],
            code: z.ZodIssueCode.custom,
            message: result,
          });
        }
      }
    });
  });
}
