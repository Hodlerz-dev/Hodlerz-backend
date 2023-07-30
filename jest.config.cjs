// jest.config.cjs
module.exports = {
  testMatch: ["**/__test__/**/*.test.js"],
  testPathIgnorePatterns: ["/node_modules/"],
  transform: {
    "^.+\\.js$": "babel-jest",
  },
};
