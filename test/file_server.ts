import FileServer from '../src/utils/file_server';

const fsr = new FileServer();

let res = fsr.getFileChildren('D:/');

console.log(res);
