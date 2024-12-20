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
  valid: [],
  invalid: [
    {
      code: `
        type User = {
              id: number;
              email: string;
              company: {
                 id: number;
                 name: string;
              }
            }
            
            function fn1(user: { id: number }): void {
               console.log(user.id)
            }
            
            function fn2(user: { email: string }): void {
               console.log(user.id)
            }
            
            function test(user: User) {
               fn1(user);
               fn2(user);
            }
      `,
      options: [{ type: "User" }],
      errors: [
        {
          message:
            "Unused fields from user:User\n" +
            "user.company.id\n" +
            "user.company.name",
        },
      ],
    },
  ],
});
