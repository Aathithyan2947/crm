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
        schema = z.boolean();
        if (field.validation?.required) {
          schema = schema.refine(
            (val) => val !== undefined,
            `${field.label} is required`
          );
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

      case 'dynamic-input':
        schema = z.array(
          z.object({
            value: z.string().min(1, `${field.label} items cannot be empty`),
          })
        );
        if (field.validation?.required) {
          schema = schema
            .min(1, `At least one ${field.label} is required`)
            .refine(
              (arr) => arr.every((item) => item.value.trim().length > 0),
              `All ${field.label} items must contain values`
            );
        } else {
          schema = schema.optional().default([{ value: '' }]);
        }
        break;

      case 'date':
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

      default: // text, text-area, etc.
        schema = z.string();
        if (field.validation?.required) {
          schema = schema.min(1, `${field.label} is required`);
        } else {
          schema = schema.optional();
        }
    }

    shape[field.name] = schema;
  });

  return z.object(shape);
}
