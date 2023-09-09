import { Field } from "payload/types";
import {
  fieldHasSubFields,
  fieldIsBlockType,
} from "payload/dist/fields/config/types";

export const transformGlobalCollectionField = (field: Field): Field => {
  field = Object.assign({}, field);
  delete field["unique"];
  delete field["saveToJWT"];
  delete field["hooks"];
  delete field["admin"];
  delete field["access"];
  if (fieldHasSubFields(field)) {
    field.fields = field.fields.map(transformGlobalCollectionField);
  }
  if (fieldIsBlockType(field)) {
    field.blocks = field.blocks.map((block) => ({
      ...block,
      fields: block.fields.map(transformGlobalCollectionField),
    }));
  }
  return field;
};
