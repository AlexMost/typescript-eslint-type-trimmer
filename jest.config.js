module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '**/tests/**/*.spec.ts',
  ],
  transform: {
    '^.+.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
        isolatedModules: true,
      },
    ],
  },
}
