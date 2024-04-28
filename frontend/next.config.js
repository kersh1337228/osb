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
    // async headers() {
    //     return [{
    //         source: '/about',
    //         headers: [{
    //             key: 'x-custom-header',
    //             value: 'my custom header value',
    //         }, {
    //             key: 'x-another-custom-header',
    //             value: 'my other custom header value',
    //         }],
    //     }]
    // },
    // async redirects() {
    //     return [
    //         {
    //             source: '/about',
    //             destination: '/',
    //             permanent: true,
    //         },
    //     ]
    // },
    // async rewrites() {
    //     return [
    //         {
    //             source: '/about',
    //             destination: '/',
    //         },
    //     ]
    // },
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
            // contextDirectory: '/',
            // processCwd: '/',
            memoryLimit: 6000
        }
    }
};
