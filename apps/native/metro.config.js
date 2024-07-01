/* eslint-env node */

// https://github.com/byCedric/expo-monorepo-example/blob/main/apps/mobile/metro.config.js

const path = require('path');

const { getSentryExpoConfig } = require('@sentry/react-native/metro');
const { FileStore } = require('metro-cache');

// Find the project and workspace directories
const projectRoot = __dirname;
// This can be replaced with `find-yarn-workspace-root`
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getSentryExpoConfig(projectRoot);

const monorepoPackages = {
  '@cococom/supabase': path.resolve(monorepoRoot, 'packages/supabase'),
  '@cococom/eslint-config': path.resolve(monorepoRoot, 'packages/eslint-config'),
  '@cococom/prettier-config': path.resolve(monorepoRoot, 'packages/prettier-config'),
  '@cococom/typescript-config': path.resolve(monorepoRoot, 'packages/typescript-config'),
};

// 1. Watch the local app folder, and only the shared packages (limiting the scope and speeding it up)
// Note how we change this from `monorepoRoot` to `projectRoot`. This is part of the optimization!
config.watchFolders = [projectRoot, ...Object.values(monorepoPackages)];

// Add the monorepo workspaces as `extraNodeModules` to Metro.
// If your monorepo tooling creates workspace symlinks in the `node_modules` folder,
// you can either add symlink support to Metro or set the `extraNodeModules` to avoid the symlinks.
// See: https://metrobundler.dev/docs/configuration/#extranodemodules
config.resolver.extraNodeModules = monorepoPackages;
config.resolver.disableHierarchicalLookup = true;

// 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

config.resolver.unstable_enableSymlinks = true;
config.resolver.unstable_enablePackageExports = true;

// Use turborepo to restore the cache when possible
config.cacheStores = [
  new FileStore({
    root: path.join(projectRoot, 'node_modules', '.cache', 'metro'),
  }),
];

module.exports = config;
