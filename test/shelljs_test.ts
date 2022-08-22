import { exec, exit } from 'shelljs';

const depict = exec('wmic logicaldisk get caption');

if (depict.code !== 0) {
  // 返回错误
  // 错误提示
  exit(1);
}

depict.split(':').reduce(
  (pre, cur, i, disk) => {
    if (i == disk.length - 1 || i == 0) {
      return pre;
    }
    return [
      ...pre,
      {
        name: `${cur.trim()}:/`,
        type: 2,
      },
    ];
  },
  [
    {
      name: 'C:/',
      type: 2,
    },
  ],
);
