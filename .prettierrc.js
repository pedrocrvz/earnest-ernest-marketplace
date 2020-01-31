module.exports = {
    semi: false,
    trailingComma: 'all',
    singleQuote: true,
    printWidth: 120,
    tabWidth: 2,
    overrides: [
      {
        files: '*.sol',
        options: {
          printWidth: 80,
          tabWidth: 4,
          useTabs: false,
          singleQuote: false,
          bracketSpacing: false,
          explicitTypes: 'always',
        },
      },
    ],
  }
  