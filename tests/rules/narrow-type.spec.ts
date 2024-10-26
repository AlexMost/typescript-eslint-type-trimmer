import { RuleTester } from "@typescript-eslint/rule-tester";
import { rule } from "../../src/rules/narrow-type/narrow-type";

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      projectService: {
        allowDefaultProject: ["*.ts*"],
      },
      tsconfigRootDir: __dirname,
    },
  },
});

ruleTester.run("my-rule", rule, {
  valid: [
    `
        type User = {
          id: number;
          name: string;
        }
        
        function test(user: User) {
          console.log(user.id, user.name);
        }
      `,
  ],
  invalid: [
    /* ... */
  ],
});
