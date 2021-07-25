module.exports = {
  extends: ['../../.eslintrc.js'],
  overrides: [
    {
      files: [
        'esbuild/**/*.js',
        'scripts/**/*.js',
        'jest/**/*.js',
        'src/**/*.test.ts',
        'src/setupTests.ts',
      ],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    {
      files: ['src/**/*.stories.tsx'],
      rules: {
        'import/no-anonymous-default-export': 'off',
      },
    },
    {
      files: [
        'src/lib/ipfs.ts',
        'src/lib/db/orbit.ts',
        'src/state/p2p/p2pSlice.ts',
        'src/state/store.ts',
        'src/lib/db/access-controllers.ts',
      ],
      rules: {
        '@typescript-eslint/ban-ts-comment': 'off',
      },
    },
    {
      files: ['src/create-shared-db.js'],
      rules: {
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
};
