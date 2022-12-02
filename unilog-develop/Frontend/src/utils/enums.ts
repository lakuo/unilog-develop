export enum RoutePath {
  Login = '/login',
  Profile = '/profile',
  ChangePW = '/changePW',
  User = '/user',
  Authority = '/authority',
  UniLOG = '/log',
  Statistics1 = '/log/statistics/1',
  Statistics2 = '/log/statistics/2',
  Statistics3 = '/log/statistics/3',
  Discover = '/log/discover',
  Dashboard1 = '/log/dashboard/1',
  Dashboard2 = '/log/dashboard/2',
  Dashboard3 = '/log/dashboard/3',
  LogBackup = '/log/backup',
  LogBackupPolicy = '/log/backup/policy',
  LogBackupList = '/log/backup/list',
  LogReport = '/log/report',
  WatchLog = '/log/watchLog',
  UniNOC = '/noc',
  UniWatch = '/watch',
  HostGroup = '/watch/hostGroup'
}

export enum UniLogMainAccess {
  UserMenu = 1,
  SysAuditLog = 2,
  Dashboard = 3,
  LogReport = 4,
  LogAlert = 5
}

export enum UniLogSubAccess {
  UserManagement,
  AuthorityManagement,
  Entry,
  PortalStatistics_1,
  PortalStatistics_2,
  PortalStatistics_3,
  Dashboard_1,
  Dashboard_2,
  Dashboard_3,
  Discover,
  LogReport,
  LogAlert
}
