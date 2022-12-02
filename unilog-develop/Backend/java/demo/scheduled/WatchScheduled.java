package demo.scheduled;

import java.util.ArrayList;
import java.util.List;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.Scheduled;

import demo.entity.user.UniWatchData;
import demo.repository.watch.UniWatchDataRepository;
import demo.service.serverapi.CallWatchAPIService;

@EnableAsync
@Configuration
public class WatchScheduled {
	
	@Autowired
	@Qualifier("callWatchAPIService")
	private CallWatchAPIService callWatchAPIService;
	
	@Autowired
	UniWatchDataRepository uniWatchDataRepository;
	
	@Async
	@Scheduled(cron="${watch.cron}")
	public void watch() throws Exception {
		try {
			List<String> ipList = uniWatchDataRepository.findWatchIpList();

			for (String ip : ipList) {
				List<String> pids = uniWatchDataRepository.findByIp(ip);

				String result = callWatchAPIService.getWatchData(ip);
				JSONObject object = new JSONObject(result);
				List<UniWatchData> watchList = new ArrayList<UniWatchData>();
				List<UniWatchData> delList = new ArrayList<UniWatchData>();
				UniWatchData watch = null;
				UniWatchData del = null;
				for (String pid : pids) {
					if (!object.isNull(pid)) {
						JSONObject wj = object.getJSONObject(pid);
						watch = new UniWatchData();
						watch.setPid(pid);
						watch.setIp(ip);
						watch.setHashMethod(wj.getString("hash"));
						watch.setStates(wj.getString("status"));
						watch.setWatchPath(wj.getString("paths"));
						watchList.add(watch);
					} else {
						del = new UniWatchData();
						del.setPid(pid);
						delList.add(del);
					}
				}
				if (watchList.size() > 0) {
					uniWatchDataRepository.saveAll(watchList);
				}
				if (delList.size() > 0) {
					uniWatchDataRepository.deleteAll(delList);
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}
