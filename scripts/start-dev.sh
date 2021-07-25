#!/usr/bin/env node

require("dotenv").config();

process.env.NODE_ENV = "development";
process.env.DEV_CLIENT_HOST='localhost';
process.env.DEV_CLIENT_PORT='5555';

const start = require("./start-dev.js")
start();


