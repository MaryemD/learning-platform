module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: '.',
    testRegex: '(/tests/.*|(\\.|/)(spec))\\.ts$',
    moduleFileExtensions: ['js','json','ts'],
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest'
    },
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/src/$1'
    },
    collectCoverageFrom: ['src/**/*.(t|j)s'],
    coverageDirectory: 'coverage',
};
