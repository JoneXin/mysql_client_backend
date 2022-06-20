// eslint-disable-next-line @typescript-eslint/no-var-requires
var shell = require('shelljs');

var child = shell.exec(
    'mysqldump --host=127.0.0.1  -uroot -pLeaper@123 -P3306  --databases test --tables a  >./a.sql',
    {
        async: true,
    });
child.stdout.on('data', function (data) {
    console.log(data, '---');
});