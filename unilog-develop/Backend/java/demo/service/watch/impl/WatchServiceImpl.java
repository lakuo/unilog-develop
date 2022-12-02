package demo.service.watch.impl;

import java.util.List;
import java.util.Random;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import demo.entity.user.UniWatchData;
import demo.entity.user.UniWatchGroup;
import demo.repository.watch.UniWatchDataRepository;
import demo.repository.watch.UniWatchGroupRepository;
import demo.service.serverapi.CallWatchAPIService;
import demo.service.user.UnilogConfigService;
import demo.service.watch.WatchService;
import demo.vo.api.WatchVo;

@Service("watchService")
public class WatchServiceImpl implements WatchService {

	private static final Logger logger 
	  = LoggerFactory.getLogger(WatchServiceImpl.class);
	
	@Autowired
	UniWatchDataRepository uniWatchDataRepository;
	
	@Autowired
	UniWatchGroupRepository uniWatchGroupRepository;

	@Autowired
	@Qualifier("callWatchAPIService")
	private CallWatchAPIService callWatchAPIService;
	
	@Autowired
	@Qualifier("UnilogService")
	private UnilogConfigService unilogConfigService;
	
	@Override
	public String findWatchData(WatchVo vo) throws Exception{
		List<UniWatchData> list = null;
		
		if(StringUtils.isNotBlank(vo.getGroupId())) {
			UniWatchGroup group = uniWatchGroupRepository.findByGroupId(vo.getGroupId());
			list = uniWatchDataRepository.findWatchIpByGroupId(group.getIp().split(","));
		}else {
			list = uniWatchDataRepository.findAll();
		}
		JSONArray result = new JSONArray();
		for(UniWatchData watch  : list) {
			JSONObject wj = new JSONObject();
			wj.put("pid", watch.getPid());
			wj.put("ip", watch.getIp());
			wj.put("states", watch.getStates());
			wj.put("watch_path", watch.getWatchPath());
			wj.put("hash", watch.getHashMethod());
			result.put(wj);
		}
			
		return new JSONObject().put("data", result).toString();
	}

	@Override
	public String findGroupList(WatchVo vo) throws Exception{
		List<Object[]> list =  uniWatchGroupRepository.findGroupList();
		JSONArray result = new JSONArray();
		for(Object[] object  : list) {
			JSONObject gj = new JSONObject();
			gj.put("group_id", object[0]);
			gj.put("group_name", object[1]);
			result.put(gj);
		}
			
		return new JSONObject().put("data", result).toString();
	}

	@Override
	public String findGroupData(WatchVo vo) throws Exception{
		List<UniWatchGroup> list =  uniWatchGroupRepository.findAll();
		JSONArray result = new JSONArray();

		for(UniWatchGroup group : list) {
			JSONObject gj = new JSONObject();
			gj.put("ip", group.getIp());
			gj.put("group_id", group.getGroupId());
			gj.put("group_name", group.getGroupName());
			gj.put("note", group.getNote());
			result.put(gj);
		}
		
		return new JSONObject().put("data", result).toString();
	}

	@Override
	public String delWatchById(WatchVo vo) throws Exception{
		String errorMessage = "參數錯誤";
		if(StringUtils.isBlank(vo.getPid())) {
			errorMessage += ",pid為空值";
		}
		if(StringUtils.isBlank(vo.getPid())) {
			errorMessage += ",ip為空值";
		}
		if(!"參數錯誤".equals(errorMessage)) {
			throw new Exception(errorMessage);
		}
		callWatchAPIService.delWatch(vo.getPid(), vo.getIp());
		uniWatchDataRepository.deleteById(vo.getPid());
		return new JSONObject().put("pid", vo.getPid()).toString();
	}

	@Override
	public String delGroup(WatchVo vo) throws Exception{
		if(StringUtils.isBlank(vo.getGroupId())) {
			throw new Exception("參數錯誤,groupId為空值");
		}
		UniWatchGroup group = new UniWatchGroup();
		group.setGroupId(vo.getGroupId());
		uniWatchGroupRepository.delete(group);
		return new JSONObject().put("group_id", vo.getGroupId()).toString();
	}

	@Override
	public String saveOrUpdateWatch(WatchVo vo) throws Exception{
		String errorMessage = "參數錯誤";
		String result = "";
		if(StringUtils.isBlank(vo.getType())) {
			errorMessage += ",type為空值";
		}
		
		if(StringUtils.isBlank(vo.getIp())) {
			errorMessage += ",ip為空值";
		}
		
		if("1".equals(vo.getType())) {
			if(StringUtils.isBlank(vo.getHash())) {
				errorMessage += ",hash為空值";
			}
			
			if(StringUtils.isBlank(vo.getWatchPath())) {
				errorMessage += ",watchPath為空值";
			}	
		}
		
		if(!"參數錯誤".equals(errorMessage)) {
			throw new Exception(errorMessage);
		}
		
		if("0".equals(vo.getType())) {
			JSONObject rj = new JSONObject();
			try {
				result = callWatchAPIService.testWatch(vo.getIp());
				rj = new JSONObject(result);
				logger.info("pid :" + result);
			}catch(Exception e) {
				e.printStackTrace();
				logger.error("測試失敗 :"+vo.getIp());
				logger.error(e.getMessage());
				throw new Exception(vo.getIp() + " :無法使用");
			}	
			return rj.toString();
		}
		
		List<String> pids = uniWatchDataRepository.findByIp(vo.getIp());
		int pathLimit = NumberUtils.toInt(unilogConfigService.getUnilogConfigByName("watch.path.limit"));
		if(pids.size() >= pathLimit) {
			throw new Exception("ip :" + vo.getIp() + ",監控目錄已達上限");
		}
		
		result = callWatchAPIService.saveWatch(vo.getIp(), vo.getHash(), vo.getWatchPath());
		JSONObject rj = new JSONObject(result);
		UniWatchData watch = new UniWatchData();
		watch.setHashMethod(vo.getHash());
		watch.setIp(vo.getIp());
		watch.setPid(rj.getString("pid"));
		watch.setWatchPath(vo.getWatchPath());
		watch.setStates(rj.getString("status"));
		uniWatchDataRepository.saveAndFlush(watch);
		
		return new JSONObject().put("pid", watch.getPid()).toString();
	}

	@Override
	public String saveOrUpdateGroup(WatchVo vo) throws Exception{
		UniWatchGroup group = null;
		String errorMessage = "參數錯誤";
		
		if(StringUtils.isBlank(vo.getGroupName())) {
			errorMessage += ",group_name為空值";
		}
		
		if(StringUtils.isBlank(vo.getIp())) {
			errorMessage += ",ip為空值";
		}
		
		if(!"參數錯誤".equals(errorMessage)) {
			throw new Exception(errorMessage);
		}
		
		switch (vo.getType()) {
			case"1":
				group = new UniWatchGroup();
				group.setGroupId(createGroupId());
				group.setGroupName(vo.getGroupName());
				group.setIp(vo.getIp());
				group.setNote(vo.getNote());				
				uniWatchGroupRepository.saveAndFlush(group);
				return new JSONObject().put("group_id", group.getGroupId()).toString();
			case"2":
				if(StringUtils.isBlank(vo.getGroupId())) {
					throw new Exception("參數錯誤,groupId為空值");
				}
				group = uniWatchGroupRepository.findByGroupId(vo.getGroupId());
				group.setGroupName(vo.getGroupName());
				group.setIp(vo.getIp());
				group.setNote(vo.getNote());
				uniWatchGroupRepository.saveAndFlush(group);
				
				return new JSONObject().put("group_id", vo.getGroupId()).toString();
			default:
				throw new Exception("參數錯誤,type請輸入1或2");
		}
		
	}

	@Override
	public String findWatchIpList(WatchVo vo) throws Exception {
		List<String> ipList = uniWatchDataRepository.findWatchIpList();
		String groupIp = "";
		if(StringUtils.isNotBlank(vo.getGroup_id())) {
			UniWatchGroup group = uniWatchGroupRepository.findByGroupId(vo.getGroup_id());
			groupIp = group.getIp();
		}
		JSONObject result = new JSONObject();
		result.put("ip", ipList);
		result.put("group_ip", groupIp);
		
		return result.toString();
	}

	private String createGroupId() {
		String groupId = "";
		String[] head = {"a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"};
		groupId = head[new Random().nextInt(head.length)] + head[new Random().nextInt(head.length)];
		
		while(groupId.length() < 14) {
			groupId +=  new Random().nextInt(10);
		}
		
		return groupId;
	}
}
