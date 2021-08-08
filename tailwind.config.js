module.exports = {
  // https://v1.tailwindcss.com/docs/upcoming-changes
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
    defaultLineHeights: true,
    standardFontWeights: true,
  },
  purge: {
    layers: ['utilities'],
    content: [
      './public/**/*.html',
      './src/**/*.vue',
      './src/**/*.js',
    ]
  },
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        sspro: ['Source Sans Pro', 'sans-serif'],
        opensans: ['Open Sans', 'sans-serif'],
      }
    },
  },
  variants: {},
  plugins: [],
}
