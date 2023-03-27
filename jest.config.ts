export default {
  transform: {
    '^.+\\.tsx?$': [
      'esbuild-jest',
      {
        target: 'ES2020'
      }
    ]
  },
  testEnvironment: 'node',
}
