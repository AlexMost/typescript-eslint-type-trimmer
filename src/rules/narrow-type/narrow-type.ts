import { ESLintUtils } from "@typescript-eslint/utils";
import {
  findTypeUsagesSet,
  findUnusedFields,
  getTypeSetFromParam,
} from "../../utils/type-utils";

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://example.com/rule/${name}`,
);

// Type: RuleModule<"uppercase", ...>
export const rule = createRule({
  create(context) {
    const services = ESLintUtils.getParserServices(context);
    const checker = services.program.getTypeChecker();
    const typesToCheck: Set<string> = new Set(
      context.options.map(({ type }) => type),
    );
    return {
      FunctionDeclaration(node) {
        if (!node.params.length) return;
        const [param] = node.params;
        if (param.type != "Identifier") return;
        const paramType = services.getTypeAtLocation(param);
        const paramName = param.name;
        const typeName = paramType.aliasSymbol?.escapedName;
        if (!typeName || !typesToCheck.has(typeName)) return;
        const paramTypeSet = getTypeSetFromParam(checker, paramName, paramType);
        const usages = findTypeUsagesSet(
          checker,
          paramName,
          services.esTreeNodeToTSNodeMap.get(node),
        );
        const unusedFields = findUnusedFields(paramTypeSet, usages);
        if (unusedFields.size) {
          context.report({
            node: param,
            message: `Unused fields from ${paramName}:${typeName}\n${Array.from(unusedFields).join("\n")}`,
          });
        }
      },
    };
  },
  name: "narrow-type",
  meta: {
    docs: {
      description: "This rule forces type narrowing of the scpecified type.",
    },
    type: "problem",
    schema: [],
  },
  defaultOptions: [],
});
