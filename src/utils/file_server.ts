// eslint-disable-next-line @typescript-eslint/no-var-requires
const { readdirSync } = require('fs');
import fsPlus from 'fs-extra';
import { exec, exit } from 'shelljs';

interface FileListType {
  type: number;
  name: string;
}

export default class FileServer {
  /**
   * 获取指定文件夹夹下的路径
   * @param parentPath
   * @returns
   */
  static getFileChildren(parentPath: string): Array<FileListType> {
    const dirList = readdirSync(parentPath, { withFileTypes: true });

    console.log(dirList);

    // type : 1 文件 2 文件夹
    // name 文件或者文件夹名称
    return dirList.map((f) => ({
      type: f[Object.getOwnPropertySymbols(f)[0]],
      name: f.name,
    }));
  }

  /**
   * 新建文件
   * @param parentPath
   * @param fileName
   * @returns
   */
  static newFile(parentPath: string, fileName: string): boolean {
    try {
      fsPlus.createFileSync(`${parentPath}/${fileName}`);
      return true;
    } catch (_) {
      console.log(_);
      return false;
    }
  }

  /**
   * 新建文件夹
   * @param parentPath
   * @param floderName
   * @returns
   */
  static newFloder(parentPath: string, floderName: string): boolean {
    try {
      fsPlus.mkdirSync(`${parentPath}/${floderName}`);
      return true;
    } catch (_) {
      console.log(_);
      return false;
    }
  }

  /**
   * 删除 文件或文件夹
   * @param filePath
   * @returns
   */
  static deleteFile(filePath: string): boolean {
    try {
      fsPlus.rmdirSync(filePath);
      return true;
    } catch (_) {
      console.log(_);
      return false;
    }
  }

  /**
   * 重命名 文件或文件夹
   * @param filePath
   * @param newName
   * @returns
   */
  static renameFile(filePath: string, newName: string): boolean {
    try {
      fsPlus.renameSync(filePath, newName);
      return true;
    } catch (_) {
      console.log(_);
      return false;
    }
  }

  /**
   * 移动 文件或者文件夹
   * @param filePath
   * @param newPath
   * @returns
   */
  static moveFile(filePath: string, newPath: string) {
    try {
      fsPlus.moveSync(filePath, newPath);
      return true;
    } catch (_) {
      console.log(_);
      return false;
    }
  }

  /**
   * 获取 电脑盘符列表
   */
  static getRootDiskList(): Array<FileListType> | boolean {
    // 查看磁盘列表
    const depict = exec('wmic logicaldisk get caption');

    // 脚本执行失败
    if (depict.code !== 0) {
      return false;
    }

    // 处理成数组
    return depict.split(':').reduce(
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
  }
}
