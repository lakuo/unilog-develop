package demo.service.serverapi.impl;

import java.util.Random;

import org.apache.commons.lang3.math.NumberUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import demo.service.serverapi.CallWatchAPIService;
import demo.service.user.UnilogConfigService;
import demo.util.HttpUtil;

@Service("callWatchAPIService")
public class CallWatchAPIServiceImpl implements CallWatchAPIService {

	@Autowired
	@Qualifier("UnilogService")
	private UnilogConfigService unilogConfigService;
	
	private HttpUtil getHttpUtil(String ip) {
		String protocol = unilogConfigService.getUnilogConfigByName("watch.api.protocol");
		int  port  = NumberUtils.toInt(unilogConfigService.getUnilogConfigByName("watch.api.port"));
		return new HttpUtil(protocol, ip, port);
	}
	
	@Override
	public String saveWatch(String ip, String hash, String filePath) throws Exception {
		HttpUtil util = getHttpUtil(ip);
		String response = "";
		String[] hosts = unilogConfigService.getUnilogConfigByName("watch.api.host").split(",");
		Random ran  = new Random();
		String host = hosts[ran.nextInt(hosts.length)];
		try {
			response = util.callGetAPI("/exec?host=" + host + "&hash=" + hash + "&paths="+filePath, 0);
		}catch(Exception e) {
			e.printStackTrace();
			throw e;
		}
		return response;
	}

	@Override
	public String testWatch(String ip) throws Exception {
		HttpUtil util = getHttpUtil(ip);
		String response = "";
		try {
			response = util.callGetAPI("exec", 0);
		}catch(Exception e) {
			e.printStackTrace();
			throw e;
		}
		return response;
	}


	@Override
	public String delWatch(String pid, String ip) throws Exception{
		HttpUtil util = getHttpUtil(ip);
		String response = "";
		try {
			response = util.callGetAPI("/quit?process_id=" + pid, 0);
		}catch(Exception e) {
			e.printStackTrace();
			throw e;
		}
		return response;
	}

	@Override
	public String getWatchData(String ip) throws Exception{
		HttpUtil util = getHttpUtil(ip);
		String response = "";
		try {
			response = util.callGetAPI("", 0);
		}catch(Exception e) {
			e.printStackTrace();
			throw e;
		}
		return response;
	}

}
