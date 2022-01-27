const mockerApiDelay = require('mocker-api/lib/delay');
const exampleProxy = require('./_example.ts');

const proxy = {
  ...exampleProxy,
};

module.exports = mockerApiDelay(proxy, 1500);