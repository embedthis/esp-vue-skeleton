module.exports = {
    productionSourceMap: false,
    css: {
        loaderOptions: {
            sass: {
                data: `@import "~@/main.scss"`,
            },
            /*
            postcss: {
                options: {}
            } */
        }
    },
    chainWebpack: config => {
        ["vue-modules", "vue", "normal-modules", "normal"].forEach((match) => {
            config.module.rule('scss').oneOf(match).use('sass-loader')
            .tap(opt => Object.assign(opt, { data: `@import '~@/main.scss';` }))
        })
    },
    configureWebpack: {
        resolve: {
            modules: ['node_modules', 'paks']
        },
        performance: {
            hints: false,
            maxEntrypointSize: 512000,
            maxAssetSize: 512000
        },
    }
}

if (process.env.NODE_ENV !== 'production') {
    module.exports.configureWebpack.devtool = '#eval-source-map'
}
