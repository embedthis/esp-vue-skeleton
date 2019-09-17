module.exports = {
    presets: [
        ['@vue/app', {
            useBuiltins: false,
            targets: {
                browsers: [
                  'Chrome >= 70',
                  'Firefox >= 60'
                ],
              },
        }]
    ],
    "plugins": [
        ["@babel/plugin-proposal-decorators", { "legacy": true }],
	    ["@babel/plugin-proposal-class-properties", { "loose": true }]
    ]
}
