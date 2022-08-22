const fs = require('fs');
const { resolve } = require('path');
const child_process = require('child_process')
const schedule = require('node-schedule')


schedule.scheduleJob('/1 * * * * *', function () {
    console.log(Date.now(), '++');
    fs.writeFileSync(resolve(__dirname, './test.txt'), 'dddddd')
});

schedule.scheduleJob('10 * * * * *', function () {
    console.log(Date.now(), '--');
    const stats = fs.statSync(resolve(__dirname, './shell.js'));
    console.log(stats.size);
});