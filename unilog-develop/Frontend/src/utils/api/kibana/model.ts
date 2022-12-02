export interface WatchLogHitsSrc {
  sha1: string; //對應到檔案監控LOG畫面的”sha1”欄位
  stack_info: string;
  action: string;
  tags: string[];
  level: string;
  crc32: string; //對應到檔案監控LOG畫面的”crc32”欄位
  md5: string; //對應到檔案監控LOG畫面的”md5”欄位
  sha256: string; //對應到檔案監控LOG畫面的”sha256”欄位
  type: string;
  message: string;
  '@version': string;
  file: string; //對應到檔案監控LOG畫面的”更新目錄”欄位
  sha512: string; //對應到檔案監控LOG畫面的”更新目錄”欄位
  port: number;
  '@timestamp': string; //對應到檔案監控LOG畫面的”更新時間”欄位
  timestamp: string;
  ip: string; //對應到檔案監控LOG畫面的”主機IP”欄位
  host: string;
  logger_name: string;
  who_data: string;
  path: string;
}
