module.exports = {
  root: true,
  extends: [
    'react-app',
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  rules: {
    // 2重管理になるのでreact/prop-types側の警告はoff
    'react/prop-types': [0],
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
  },
  overrides: [
    {
      files: [
        'packages/app/esbuild/**/*.js',
        'packages/app/scripts/**/*.js',
        'packages/app/jest/**/*.js',
        'packages/app/src/**/*.test.ts',
        'packages/app/src/setupTests.ts',
      ],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    {
      files: ['packages/app/src/**/*.stories.tsx'],
      rules: {
        'import/no-anonymous-default-export': 'off',
      },
    },
    {
      files: [
        'packages/app/src/lib/ipfs.ts',
        'packages/app/src/lib/db/orbit.ts',
        'packages/app/src/state/p2p/p2pSlice.ts',
        'packages/app/src/state/store.ts',
        'packages/app/src/lib/db/access-controllers.ts',
      ],
      rules: {
        '@typescript-eslint/ban-ts-comment': 'off',
      },
    },
    {
      files: ['packages/app/src/create-shared-db.ts'],
      rules: {
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
};
