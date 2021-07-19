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
        'src/state/p2p/p2pSlice.ts',
        'src/state/store.ts',
      ],
      rules: {
        '@typescript-eslint/ban-ts-comment': 'off',
      },
    },
  ],
};
