module.exports = {
    reactStrictMode: true,
    crossOrigin: 'anonymous',
    distDir: '.next',
    pageExtensions: ['jsx', 'js', 'tsx', 'ts'],
    poweredByHeader: false,
    trailingSlash: false,
    env: {},
    typescript: {
        ignoreBuildErrors: false
    },
    experimental: {
        turbo: {
            resolveExtensions: [
                '.tsx',
                '.ts',
                '.jsx',
                '.js',
                '.json'
            ],
        },
        turbotrace: {
            logLevel: 'error',
            logDetail: false,
            logAll: false,
            memoryLimit: 512
        }
    }
};
