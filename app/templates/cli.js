#!/usr/bin/env node

'use strict';
var argv = require('minimist')(process.argv.slice(2)); <%
var path = './lib'
if (props.taskRunner === 'simple.js') {
  path = './'
} %>
var <%= safeSlugname %> = require('<%= path %>');

console.log(argv);
