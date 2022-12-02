import { getKibanaDataTemplate } from '../unilog';
import { axiosKibana } from './instance';
import { WatchLogHitsSrc } from './model';

interface keyCountData {
  key: string;
  doc_count: number;
}

export async function loadOutTotalLinks(startTime: string, endTime: string) {
  const data = await getKibanaData('OutTotalLinks', {
    startTime,
    endTime
  });
  return axiosKibana({
    url: '/internal/search/es',
    data
  }).then(res => {
    return res.data.rawResponse.hits.total;
  });
}

export async function loadOutLinksByTime(startTime: string, endTime: string) {
  const data = await getKibanaData('OutLinksByTime', {
    startTime,
    endTime
  });
  return axiosKibana({
    url: '/api/timelion/run',
    data
  }).then(res => {
    return res.data.sheet[0].list[0].data.map((data: number[]) => {
      return {
        time: data[0],
        value: data[1]
      };
    });
  });
}

export async function loadOutLinksByService(
  startTime: string,
  endTime: string
) {
  const data = await getKibanaData('OutLinksByService', {
    startTime,
    endTime
  });
  return axiosKibana({
    url: '/internal/search/es',
    data
  }).then(res => {
    return res.data.rawResponse.aggregations['2'].buckets.map(
      (data: { key: string; doc_count: number }) => {
        return {
          name: data.key,
          value: data.doc_count
        };
      }
    );
  });
}

export async function loadOutLinksByIp(startTime: string, endTime: string) {
  const data = await getKibanaData('OutLinksByIp', {
    startTime,
    endTime
  });
  return axiosKibana({
    url: '/internal/search/es',
    data
  }).then(res => {
    return res.data.rawResponse.aggregations['2'].buckets.map(
      (data: keyCountData) => {
        return {
          name: data.key,
          value: data.doc_count
        };
      }
    );
  });
}

export async function loadInTotalLinks(startTime: string, endTime: string) {
  const data = await getKibanaData('InTotalLinks', {
    startTime,
    endTime
  });
  return axiosKibana({
    url: '/internal/search/es',
    data
  }).then(res => {
    return res.data.rawResponse.hits.total;
  });
}

export async function loadInLinksByTime(startTime: string, endTime: string) {
  const data = await getKibanaData('InLinksByTime', {
    startTime,
    endTime
  });
  return axiosKibana({
    url: '/api/timelion/run',
    data
  }).then(res => {
    return res.data.sheet[0].list[0].data.map((data: number[]) => {
      return {
        time: data[0],
        value: data[1]
      };
    });
  });
}

export async function loadInLinksByService(startTime: string, endTime: string) {
  const data = await getKibanaData('InLinksByService', {
    startTime,
    endTime
  });
  return axiosKibana({
    url: '/internal/search/es',
    data
  }).then(res => {
    return res.data.rawResponse.aggregations['2'].buckets.map(
      (data: keyCountData) => {
        return {
          name: data.key,
          value: data.doc_count
        };
      }
    );
  });
}

export async function loadInLinksByIp(startTime: string, endTime: string) {
  const data = await getKibanaData('InLinksByIp', {
    startTime,
    endTime
  });
  return axiosKibana({
    url: '/internal/search/es',
    data
  }).then(res => {
    return res.data.rawResponse.aggregations['2'].buckets.map(
      (data: keyCountData) => {
        return {
          name: data.key,
          value: data.doc_count
        };
      }
    );
  });
}

export async function loadTotalBlocks(startTime: string, endTime: string) {
  const data = await getKibanaData('TotalBlocks', {
    startTime,
    endTime
  });
  return axiosKibana({
    url: '/internal/search/es',
    data
  }).then(res => {
    return res.data.rawResponse.hits.total;
  });
}

export async function loadBlocksByTime(startTime: string, endTime: string) {
  const data = await getKibanaData('BlocksByTime', {
    startTime,
    endTime
  });
  return axiosKibana({
    url: '/api/timelion/run',
    data
  }).then(res => {
    return res.data.sheet[0].list[0].data.map((data: number[]) => {
      return {
        time: data[0],
        value: data[1]
      };
    });
  });
}

export async function loadBlocksBySrc(startTime: string, endTime: string) {
  const data = await getKibanaData('BlocksBySrc', {
    startTime,
    endTime
  });
  return axiosKibana({
    url: '/internal/search/es',
    data
  }).then(res => {
    return res.data.rawResponse.aggregations['2'].buckets.map(
      (data: keyCountData) => {
        return {
          name: data.key,
          value: data.doc_count
        };
      }
    );
  });
}

export async function loadBlocksByDst(startTime: string, endTime: string) {
  const data = await getKibanaData('BlocksByDst', {
    startTime,
    endTime
  });
  return axiosKibana({
    url: '/internal/search/es',
    data
  }).then(res => {
    return res.data.rawResponse.aggregations['2'].buckets.map(
      (data: keyCountData) => {
        return {
          name: data.key,
          value: data.doc_count
        };
      }
    );
  });
}

export interface DiscoverParams {
  startTime: string;
  endTime: string;
  deviceName?: string;
  keyword?: string;
}

export async function loadDiscoverHitsByTime(params: DiscoverParams) {
  const data = await getKibanaData('DiscoverHitsByTime', params);
  return axiosKibana({
    url: '/api/timelion/run',
    data
  }).then(res => {
    return res.data.sheet[0].list[0].data.map((data: number[]) => {
      return {
        time: data[0],
        value: data[1]
      };
    });
  });
}

interface TableDataSchema {
  _source: object;
  fields: {
    '@timestamp': string[];
  };
}

export async function loadDiscoverTableDataList(params: DiscoverParams) {
  const data = await getKibanaData('DiscoverTableDataList', params);
  return axiosKibana({
    url: '/internal/search/es',
    data
  }).then(res => {
    return res.data.rawResponse.hits.hits.map((data: TableDataSchema) => {
      return {
        time: data.fields['@timestamp'][0],
        _source: JSON.stringify(data._source)
      };
    });
  });
}

export async function loadPortalLoginsTotal(
  startTime: string,
  endTime: string
) {
  const data = await getKibanaData('PortalLoginsTotal', {
    startTime,
    endTime
  });
  return axiosKibana({
    url: '/internal/search/es',
    data
  }).then(res => {
    return res.data.rawResponse.hits.total;
  });
}

export async function loadPortalLoginsByTime(
  startTime: string,
  endTime: string
) {
  const data = await getKibanaData('PortalLoginsByTime', {
    startTime,
    endTime
  });
  return axiosKibana({
    url: '/api/timelion/run',
    data
  }).then(res => {
    return res.data.sheet[0].list[0].data.map((data: number[]) => {
      return {
        time: data[0],
        value: data[1]
      };
    });
  });
}

export async function loadPortalLoginsByIp(startTime: string, endTime: string) {
  const data = await getKibanaData('PortalLoginsByIp', {
    startTime,
    endTime
  });
  return axiosKibana({
    url: '/internal/search/es',
    data
  }).then(res => {
    return res.data.rawResponse.aggregations['2'].buckets.map(
      (data: { key: string; doc_count: number }) => {
        return {
          name: data.key,
          value: data.doc_count
        };
      }
    );
  });
}

export async function loadPortalLoginsByUser(
  startTime: string,
  endTime: string
) {
  const data = await getKibanaData('PortalLoginsByUser', {
    startTime,
    endTime
  });
  return axiosKibana({
    url: '/internal/search/es',
    data
  }).then(res => {
    return res.data.rawResponse.aggregations['2'].buckets.map(
      (data: keyCountData) => {
        return {
          name: data.key,
          value: data.doc_count
        };
      }
    );
  });
}

export async function loadPortalLoginBlocksTotal(
  startTime: string,
  endTime: string
) {
  const data = await getKibanaData('PortalLoginBlocksTotal', {
    startTime,
    endTime
  });
  return axiosKibana({
    url: '/internal/search/es',
    data
  }).then(res => {
    return res.data.rawResponse.hits.total;
  });
}

export async function loadPortalLoginBlocksByTime(
  startTime: string,
  endTime: string
) {
  const data = await getKibanaData('PortalLoginBlocksByTime', {
    startTime,
    endTime
  });
  return axiosKibana({
    url: '/api/timelion/run',
    data
  }).then(res => {
    return res.data.sheet[0].list[0].data.map((data: number[]) => {
      return {
        time: data[0],
        value: data[1]
      };
    });
  });
}

export async function loadPortalLoginBlocksByIp(
  startTime: string,
  endTime: string
) {
  const data = await getKibanaData('PortalLoginBlocksByIp', {
    startTime,
    endTime
  });
  return axiosKibana({
    url: '/internal/search/es',
    data
  }).then(res => {
    return res.data.rawResponse.aggregations['2'].buckets.map(
      (data: { key: string; doc_count: number }) => {
        return {
          name: data.key,
          value: data.doc_count
        };
      }
    );
  });
}

export async function loadPortalLoginSuccessesTotal(
  startTime: string,
  endTime: string
) {
  const data = await getKibanaData('PortalLoginSuccessesTotal', {
    startTime,
    endTime
  });
  return axiosKibana({
    url: '/internal/search/es',
    data
  }).then(res => {
    return res.data.rawResponse.hits.total;
  });
}

export async function loadPortalLoginSuccessesByTime(
  startTime: string,
  endTime: string
) {
  const data = await getKibanaData('PortalLoginSuccessesByTime', {
    startTime,
    endTime
  });
  return axiosKibana({
    url: '/api/timelion/run',
    data
  }).then(res => {
    return res.data.sheet[0].list[0].data.map((data: number[]) => {
      return {
        time: data[0],
        value: data[1]
      };
    });
  });
}

export async function loadPortalLoginSuccessesByIp(
  startTime: string,
  endTime: string
) {
  const data = await getKibanaData('PortalLoginSuccessesByIp', {
    startTime,
    endTime
  });
  return axiosKibana({
    url: '/internal/search/es',
    data
  }).then(res => {
    return res.data.rawResponse.aggregations['2'].buckets.map(
      (data: { key: string; doc_count: number }) => {
        return {
          name: data.key,
          value: data.doc_count
        };
      }
    );
  });
}

export async function loadPortalLoginSuccessesByUser(
  startTime: string,
  endTime: string
) {
  const data = await getKibanaData('PortalLoginSuccessesByUser', {
    startTime,
    endTime
  });
  return axiosKibana({
    url: '/internal/search/es',
    data
  }).then(res => {
    return res.data.rawResponse.aggregations['2'].buckets.map(
      (data: keyCountData) => {
        return {
          name: data.key,
          value: data.doc_count
        };
      }
    );
  });
}

export async function loadWatchLog(
  startTime: string,
  endTime: string
): Promise<WatchLogHitsSrc[]> {
  const data = await getKibanaData('WatchLog', {
    startTime,
    endTime
  });
  return axiosKibana({
    url: '/internal/search/es',
    data
  }).then(res =>
    res.data.rawResponse.hits.hits.map((item: any) => item._source)
  );
}

async function getKibanaData(kibanaName: string, params: DiscoverParams) {
  const res = await getKibanaDataTemplate(kibanaName);
  let jsonString = res
    .replace(/\${START_TIME}/g, params.startTime)
    .replace(/\${END_TIME}/g, params.endTime)
    .replace(/\${CURRENT_TIME}/g, String(Date.now()));
  if (params.deviceName) {
    jsonString = jsonString.replace(/\${DEVICE_NAME}/g, params.deviceName);
  }
  if (params.keyword) {
    jsonString = jsonString.replace(/\${KEYWORD}/g, params.keyword);
  }
  try {
    return Promise.resolve(JSON.parse(jsonString));
  } catch {
    console.error(jsonString);
  }
}
