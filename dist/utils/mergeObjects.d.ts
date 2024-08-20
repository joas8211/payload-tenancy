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
export declare const mergeObjects: <Obj extends object>(destination: Obj, ...sources: Obj[]) => Obj;
