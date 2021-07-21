module.exports = {
    root: true,
    extends: [require.resolve('vxbuildtools/config/eslint/base.eslintrc')],
    env: {
        // "browser" rowser was set to false in order to allow only certain browser
        // globals though "globals" config.
        browser: true,
        node: true,
        amd: false,
        es6: true,
    },

    globals: {
        window: true,
        console: true,
        document: true,
        __webpack_public_path__: true,
    },
    rules: {
        // Custom platform rules
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        'space-before-function-paren': 'off',
    },
    overrides: [],
};
