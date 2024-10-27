import { ESLintUtils } from "@typescript-eslint/utils";
import { getTypeSetFromParam } from "../../utils/type-utils";

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://example.com/rule/${name}`,
);

// Type: RuleModule<"uppercase", ...>
export const rule = createRule({
  create(context) {
    const services = ESLintUtils.getParserServices(context);
    const checker = services.program.getTypeChecker();

    return {
      FunctionDeclaration(node) {
        if (!node.params.length) return;
        const [param] = node.params;
        if (param.type != "Identifier") return;
        const paramType = services.getTypeAtLocation(param);
        const paramName = param.name;
        const typeName = paramType.aliasSymbol?.escapedName;
        if (!typeName) return;
        const paramTypeSet = getTypeSetFromParam(checker, paramName, paramType);
        console.log(paramTypeSet);
        console.log(`${paramName}:${typeName}. Type fields: ${paramTypeSet}`);
      },
    };
  },
  name: "narrow-type",
  meta: {
    docs: {
      description: "This rule forces type narrowing of the scpecified type.",
    },
    messages: {
      uppercase:
        "Narrow param type to have only necessary properties for this function.",
    },
    type: "suggestion",
    schema: [],
  },
  defaultOptions: [],
});
