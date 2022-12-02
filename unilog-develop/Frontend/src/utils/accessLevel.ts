import { useState } from 'react';
import { UniLogAccessLevelInfo } from './api/unilog/model';

export enum MainAccessType {
  UserMenu = 1,
  UniLOG = 2,
  UniNOC = 3,
  UniWatch = 4
}

export enum SubAccessType {
  User = '1,1',
  Authority = '1,2',
  Discover = '2,3',
  Dashboard_1 = '2,4',
  Dashboard_2 = '2,5',
  Dashboard_3 = '2,6',
  PortalStatistics_1 = '2,7',
  PortalStatistics_2 = '2,8',
  PortalStatistics_3 = '2,9',
  LogReport = '2,10',
  LogBackup = '2,11',
  BackupList = '2,12',
  BackupPolicy = '2,13',
  LogAlert = '2,14',
  WatchLog = '2,15',
  UniNOC = '3,16',
  UniWatch = '4,17',
  HostGroup = '4,18'
}

export function useAccessLevel(hasBackend: boolean) {
  const [accessLevels, setAccessLevels] = useState<UniLogAccessLevelInfo[]>([]);

  /** 主標題(使用者選單、左側選單)是否可讀 */
  const isMainTitleReadable = () => true;

  /** 取得副標題的權限 */
  const getAccessLevel = (type: SubAccessType) => {
    if (!hasBackend) return { read: true, write: true };
    if (accessLevels.length === 0) return { read: false, write: false };

    const idGroup = type.split(',').map(item => Number(item));
    if (!idGroup) return { read: false, write: false };

    const accessLevel = accessLevels.find(
      item => item.mainTitleId === idGroup[0] && item.subTitleId === idGroup[1]
    );
    if (!accessLevel) return { read: false, write: false };

    return { read: accessLevel.isRead, write: accessLevel.isWrite };
  };

  return { accessLevels, setAccessLevels, getAccessLevel, isMainTitleReadable };
}
