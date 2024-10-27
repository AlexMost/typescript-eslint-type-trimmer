import * as ts from "typescript";

export function getTypeSetFromParam(
  checker: ts.TypeChecker,
  paramName: string,
  type: ts.Type,
): Set<string> {
  const result: Set<string> = new Set();
  const typeProperties = type.getProperties();
  for (const property of typeProperties) {
    const propertyName = property.getName();
    const propertyType = checker.getTypeOfSymbol(property);
    if (propertyType.getFlags() & ts.TypeFlags.Object) {
      const objectSet = getTypeSetFromParam(
        checker,
        `${paramName}.${propertyName}`,
        propertyType,
      );
      objectSet.forEach((key) => result.add(key));
    } else {
      result.add(`${paramName}.${propertyName}`);
    }
  }
  return result;
}
