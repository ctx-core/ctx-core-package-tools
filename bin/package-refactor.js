#!/usr/bin/env node
require = require('esm')(module);
const { package_refactor } = require('../dist');
package_refactor().then();
