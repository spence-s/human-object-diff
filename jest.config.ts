export default {
  transform: {
    '^.+\\.tsx?$': 'esbuild-jest',
  },
  testEnvironment: 'node',
}
