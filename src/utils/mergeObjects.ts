/**
 * Mutates the destination object to have values from source objects. If
 * property is primitive or missing it's overridden, if it's an array source
 * value is pushed to destination array, if it's an object they are merged the
 * same method.
 *
 * @param destination Object into which to merge the other objects.
 * @param sources Objects that override properties and append values to arrays
 *   of the first object.
 * @returns Destination object.
 */
export const mergeObjects = <Obj extends object>(
  destination: Obj,
  ...sources: (Obj | undefined)[]
): Obj => {
  for (const source of sources) {
    if (!source) {
      continue;
    }

    for (const key in source) {
      const sourceValue = source[key];
      const destinationValue = destination[key];
      if (
        // Source value is primitive.
        sourceValue === null ||
        typeof sourceValue !== "object" ||
        // Property does not exist in destination.
        !(key in destination) ||
        // Destination value is primitive.
        destinationValue === null ||
        typeof destinationValue !== "object" ||
        // Source value XOR destination value is array.
        sourceValue instanceof Array !== destinationValue instanceof Array
      ) {
        destination[key] = sourceValue;
      } else if (
        // Source value AND destination value are arrays.
        sourceValue instanceof Array &&
        destinationValue instanceof Array
      ) {
        destinationValue.push(...sourceValue);
      } else {
        mergeObjects(destinationValue, sourceValue);
      }
    }
  }
  return destination;
};
