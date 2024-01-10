// Overrides create-react-app webpack configs without ejecting
// https://github.com/timarney/react-app-rewired

const { override, addBabelPreset, addWebpackResolve } = require('customize-cra')
const customResolve = {
  fallback: {
    crypto: false,
  },
}

module.exports = override(
  addBabelPreset('@emotion/babel-preset-css-prop'),
  addWebpackResolve(customResolve),
)
