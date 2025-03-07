'use strict';

module.exports = {
    globals: {
        'ts-jest': {
            isolatedModules: true,
        },
    },
    testEnvironment: 'node',
    transform: {
        '^.+\\.ts$': require.resolve('ts-jest/dist'),
    },
    moduleFileExtensions: ['ts', 'js'],
    collectCoverageFrom: ['src/**/*.ts', '!src/**/*.(spec|test).ts'],
    testMatch: ['<rootDir>/**/*.(spec|test).ts'],
    coverageReporters: ['text-summary', 'lcov'],
};