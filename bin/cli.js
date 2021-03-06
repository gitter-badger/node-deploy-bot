#!/usr/bin/env node

var Shell = require('../lib/shell'),
    pkg = require('../package'),
    program = require('commander'),
    Q = require('q');

Q.longStackSupport = true;
require('../examples');

function list(val) {
  return val.split(',');
}
program
    .version(pkg.version)
    .usage('[options] <hosts>', 'A list of server config')
    .option('-r, --run <tasks>', 'A list of tasks to run', list)
    .parse(process.argv);



function run (host, tasks) {
    // TODO exit with higthest exit code
    var shell = new Shell();
    shell.connect(host).then(function () {
        if (!Array.isArray(tasks)) {
            tasks = [tasks];
        }
        return shell.run.apply(shell, tasks);
    }).finally(function () {
        shell.disconnect();
    }).fail(function (error) {
        console.error(error.stack || error);
    });
}

if (!program.args.length) {
    console.error('Nothing to do...');
    process.exit(1);
}
for (var i in program.args) {
    run (program.args[i], program.run || 'uptime');
}
