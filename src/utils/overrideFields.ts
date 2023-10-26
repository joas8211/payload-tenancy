import { Field } from "payload/types";

export const overrideFields = (
  original: Field[],
  frontOverrides: Field[],
  backOverrides: Field[],
): Field[] => [
  ...frontOverrides.filter(
    (field) =>
      !original.find(
        (otherField) =>
          "name" in field &&
          "name" in otherField &&
          otherField.name === field.name,
      ),
  ),
  ...original.map(
    (field) =>
      [...frontOverrides, ...backOverrides].find(
        (otherField) =>
          "name" in field &&
          "name" in otherField &&
          otherField.name === field.name,
      ) || field,
  ),
  ...backOverrides.filter(
    (field) =>
      !original.find(
        (otherField) =>
          "name" in field &&
          "name" in otherField &&
          otherField.name === field.name,
      ),
  ),
];
