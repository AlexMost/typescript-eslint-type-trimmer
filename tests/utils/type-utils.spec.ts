import * as ts from "typescript";

import {
  getTypeSetFromParam,
  findTypeUsagesSet,
} from "../../src/utils/type-utils";

describe("getTypeSetFromParam", () => {
  test("should fetch nested types", () => {
    // Create a TypeScript program from string source code for testing
    const sourceCode = `
            type User = { id: number; name: string; company: { id: number } };
        `;
    const sourceFile = ts.createSourceFile(
      "test.ts",
      sourceCode,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TS,
    );
    const program = ts.createProgram(["test.ts"], { allowJs: true });
    const checker = program.getTypeChecker();

    const userTypeSymbol = checker.getSymbolAtLocation(
      sourceFile
        .getChildAt(0)
        .getChildren()
        .find((node) => {
          return (
            ts.isTypeAliasDeclaration(node) && node.name.getText() === "User"
          );
        }),
    );

    if (userTypeSymbol) {
      const userType = checker.getDeclaredTypeOfSymbol(userTypeSymbol);

      const result = getTypeSetFromParam(checker, "user", userType);

      // Convert the Set to an Array for easier checking
      const resultArray = Array.from(result);

      // Check if the expected properties are present
      expect(resultArray).toEqual(
        expect.arrayContaining([
          "user.id",
          "user.name",
          "user.company",
          "user.company.id",
        ]),
      );

      // Ensure the total length is correct
      expect(resultArray.length).toBe(4);
    }
  });
});

