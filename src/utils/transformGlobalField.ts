import { Field, fieldHasSubFields, fieldIsBlockType } from "payload/types";

export const transformGlobalField = (field: Field): Field => {
  field = Object.assign({}, field);
  delete field["required"];

  if (fieldHasSubFields(field)) {
    field.fields = field.fields.map(transformGlobalField);
  }
  if (fieldIsBlockType(field)) {
    field.blocks = field.blocks.map((block) => ({
      ...block,
      fields: block.fields.map(transformGlobalField),
    }));
  }

  return field;
};
