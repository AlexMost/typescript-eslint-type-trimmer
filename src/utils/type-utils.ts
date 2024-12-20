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

function printNode(node: ts.Node) {
  const printer = ts.createPrinter();
  console.log(
    printer.printNode(
      ts.EmitHint.Unspecified,
      node,
      ts.createSourceFile("", "", ts.ScriptTarget.Latest),
    ),
  );
}

export function findTypeUsagesSet(
  checker: ts.TypeChecker,
  paramName: string,
  node: ts.Node,
): Set<string> {
  const usages: Set<string> = new Set();

  function traverseNode(innerNode: ts.Node) {
    if (ts.isCallExpression(innerNode)) {
      const signature = checker.getResolvedSignature(innerNode)
      const typeParam = checker.getTypeOfSymbol(signature.parameters[0])
      const paramTypeSet = getTypeSetFromParam(checker, paramName, typeParam);
      paramTypeSet.forEach((value) => usages.add(value));
    }
    ts.forEachChild(innerNode, traverseNode);
  }

  ts.forEachChild(node, traverseNode);
  return usages;
}

export function findUnusedFields(argumentTypeSet: Set<string>, usageTypeSet: Set<string>) {
  const unusedSet: Set<string> = new Set();
  argumentTypeSet.forEach((value) => {
    if (!usageTypeSet.has(value)) {
      unusedSet.add(value);
    }
  })
  return unusedSet;
}