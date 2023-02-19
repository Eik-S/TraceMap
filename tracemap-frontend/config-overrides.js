// Overrides create-react-app webpack configs without ejecting
// https://github.com/timarney/react-app-rewired

const { override, addBabelPreset } = require('customize-cra')
module.exports = override(addBabelPreset('@emotion/babel-preset-css-prop'))
