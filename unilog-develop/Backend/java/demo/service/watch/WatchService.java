package demo.service.watch;

import demo.vo.api.WatchVo;

public interface WatchService {

	public String findWatchData(WatchVo vo) throws Exception;
	
	public String findGroupList(WatchVo vo) throws Exception;
	
	public String findGroupData(WatchVo vo) throws Exception;
	
	public String delWatchById(WatchVo vo) throws Exception;
	
	public String delGroup(WatchVo vo) throws Exception;
	
	public String saveOrUpdateWatch(WatchVo vo) throws Exception;
	
	public String saveOrUpdateGroup(WatchVo vo) throws Exception;
	
	public String findWatchIpList(WatchVo vo) throws Exception;
}
