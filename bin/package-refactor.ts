#!/usr/bin/env node
require = require('esm')(module)
const { package_refactor } = require('../src')
package_refactor().then()
