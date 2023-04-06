// @ts-check

/**
 * @type { import('f2e-middle-esbuild').BuildOptions[] }
 */
 let config = [{
    sourcemap: 'external',
    entryPoints: {
        index: 'test/index.ts',
    },
    outdir: 'static',
    target: 'chrome70',
    bundle: true,
    format: 'iife',
    loader: {
        '.tsx': 'tsx',
        '.ts': 'ts',
    },
    tsconfig: './tsconfig.json',
}];

module.exports = config;
