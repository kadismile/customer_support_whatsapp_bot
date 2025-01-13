import tsPreset from 'ts-jest/jest-preset.js';
import shelfMongoDBPreset from '@shelf/jest-mongodb/jest-preset.js';

const config = {
  ...tsPreset,
  ...shelfMongoDBPreset,
  ...{
    extensionsToTreatAsEsm: ['.ts'],
    globals: {
      'ts-jest': {
        useESM: true
      }
    }
  },
  ...{
    moduleNameMapper: {
      '^(\\.\\.?\\/.+)\\.js$': '$1',
      '^google-auth-library$': '<rootDir>/__mocks__/google-auth-library.ts'
    },
    setupFiles: ['<rootDir>/jest.setup.ts']
  }
};

export default config;
