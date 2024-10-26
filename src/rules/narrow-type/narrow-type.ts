import { ESLintUtils } from '@typescript-eslint/utils';

const createRule = ESLintUtils.RuleCreator(
  name => `https://example.com/rule/${name}`,
);

// Type: RuleModule<"uppercase", ...>
export const rule = createRule({
  create(context) {
    return {
      FunctionDeclaration(node) {
        const services = ESLintUtils.getParserServices(context);
        const type = services.getTypeAtLocation(node);
        console.log(type);
        if (node.id != null) {
          if (/^[a-z]/.test(node.id.name)) {
            context.report({
              messageId: 'uppercase',
              node: node.id,
            });
          }
        }
      },
    };
  },
  name: 'uppercase-first-declarations',
  meta: {
    docs: {
      description:
        'Function declaration names should start with an upper-case letter.',
    },
    messages: {
      uppercase: 'Start this name with an upper-case letter.',
    },
    type: 'suggestion',
    schema: [],
  },
  defaultOptions: [],
});
