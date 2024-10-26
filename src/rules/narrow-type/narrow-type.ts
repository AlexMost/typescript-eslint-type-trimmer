import { ESLintUtils } from '@typescript-eslint/utils';

function hasJSExtension(filePath: string) {
  return /\.(js|jsx|mjs|cjs)$/.test(filePath);
}

const createRule = ESLintUtils.RuleCreator(
  () => 'https://github.com/pipopotamasu/eslint-plugin-no-implicit-any'
);

export const rule = createRule({
  name: 'narrow-type',
  defaultOptions: [],
  meta: {
    docs: {
      description: 'Narrowing type',
    },
    type: 'problem',
    messages: { typeIsToBroad: 'Type is too broad.' },
    fixable: 'code',
    schema: [],
  },
  create: function (context) {
    if (hasJSExtension(context.getFilename())) return {};

    return {
      FunctionDeclaration(node) {
        console.log(node);
      },
    };
  },
});