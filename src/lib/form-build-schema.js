import { z } from 'zod';

export function buildSchema(formDetails) {
  const shape = {};

  formDetails.forEach((field) => {
    let schema;

    if (field.type === 'multi-select') {
      // Create base array schema
      schema = z.array(
        z.union([z.string(), z.number()]) // Accept both string and number values
      );

      // Only add validation if explicitly required
      if (field.validation?.required) {
        schema = schema.min(1, `${field.label} is required`);
      } else {
        // Make the array optional (can be empty or undefined)
        schema = schema.optional().default([]);
      }
    } else if (field.type === 'toggle') {
      schema = z.boolean();
      if (field.validation?.required) {
        schema = schema.refine(
          (val) => typeof val === 'boolean',
          `${field.label} is required`
        );
      }
    } else if (field.type === 'searchable-select') {
      // Accept both string and number values for select fields
      schema = z.union([z.string(), z.number()]);

      if (field.validation?.required) {
        schema = schema.refine(
          (val) => val !== null && val !== undefined && val !== '',
          `${field.label} is required`
        );
      } else {
        schema = schema.optional().nullable();
      }
    } else {
      schema = z.string();
      if (field.validation?.required) {
        schema = schema.nonempty(`${field.label} is required`);
      } else {
        schema = schema.optional();
      }
    }

    shape[field.name] = schema;
  });

  return z.object(shape);
}
