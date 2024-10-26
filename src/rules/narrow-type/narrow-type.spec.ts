import { RuleTester } from "@typescript-eslint/rule-tester";
import { rule } from './narrow-type';

export const ruleTester = new RuleTester({
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
  },
});

ruleTester.run("function-args", rule, {
  valid: [
    {
      code: `
        type User = {
          id: number;
          name: string;
        }
        
        function test(user: User) {
          console.log(user.id, user.name);
        }
      `,
    },
  ],
  invalid: [
    // FunctionDeclaration or FunctionExpression
  ],
});
