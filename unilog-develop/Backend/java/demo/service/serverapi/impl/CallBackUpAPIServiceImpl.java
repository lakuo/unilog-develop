package demo.service.serverapi.impl;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.configurationprocessor.json.JSONArray;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.stereotype.Service;

import demo.service.serverapi.CallBackUpAPIService;
import demo.service.user.UnilogConfigService;
import demo.util.HttpUtil;
import demo.vo.api.JobVo;

@Service("callBackUpAPIService")
public class CallBackUpAPIServiceImpl implements CallBackUpAPIService {

	private final static String API_PATH = "/api/v1/jobs";
	private final static String EXE_API_PATH = "/api/v1/executions";
	private final static String BACKUP_API_PATH = "/_snapshot/backup_test/";
	
	@Autowired
	@Qualifier("UnilogService")
	private UnilogConfigService unilogConfigService;

	private HttpUtil getKibanaHttpUtil() {
		String protocol = unilogConfigService.getUnilogConfigByName("backup.ki.protocol");
		String host = unilogConfigService.getUnilogConfigByName("backup.ki.host");
		String port = unilogConfigService.getUnilogConfigByName("backup.ki.port");
//		protocol = "http";
//		host = "10.0.30.192";
//		port = "5601";
		
		HttpUtil util = new HttpUtil(protocol, host, NumberUtils.toInt(port));
		
		return util;
	}
	
	private HttpUtil getEsHttpUtil() {
		String protocol = unilogConfigService.getUnilogConfigByName("backup.es.protocol");
		String host = unilogConfigService.getUnilogConfigByName("backup.es.host");
		String port = unilogConfigService.getUnilogConfigByName("backup.es.port");
//		protocol = "https";
//		host = "10.0.30.188";
//		port = "9200";
		
		HttpUtil util = new HttpUtil(protocol, host, NumberUtils.toInt(port));
		return util;
	}
	
	private HttpUtil getSchedulerHttpUtil() {
		String protocol = unilogConfigService.getUnilogConfigByName("backup.protocol");
		String host = unilogConfigService.getUnilogConfigByName("backup.host");
		String port = unilogConfigService.getUnilogConfigByName("backup.port");
		HttpUtil util = new HttpUtil(protocol, host, NumberUtils.toInt(port));
		return util;
	}
	
	@Override
	public String getBackupMain(String zipName) throws Exception {
		HttpUtil util = getEsHttpUtil();
		String response = null;
		try {
			zipName = StringUtils.isNotBlank(zipName) ?  "/" + zipName : "/_all";
			response = util.callGetAPI(BACKUP_API_PATH + zipName, 0 , unilogConfigService.getUnilogConfigByName("http.kiandes.auth"));
		} catch (Exception e) {
			e.printStackTrace();
			throw e;
		}

		return response;
	}

	@Override
	public String restoreStep1(String zipName, String zipPath, String zipPwd) throws Exception {
		HttpUtil util = getSchedulerHttpUtil();
		JSONObject req = new JSONObject();
		JSONArray pubArgs = new JSONArray();
		JSONObject pubBody = new JSONObject();
		pubBody.put("Backup_dir", unilogConfigService.getUnilogConfigByName("backup.dst"));
		pubBody.put("File_name", zipName);
		pubBody.put("Password", zipPwd);
		pubArgs.put(pubBody);
		
		req.put("job_class_string", "simple_scheduler.jobs.backup_restore.Backup_restoreJob");
		req.put("name", "test_1");
		req.put("pub_args", pubArgs);
		req.put("month", "*");
		req.put("day_of_week", "*");
		req.put("day", "*");
		req.put("hour", "*/12");
		req.put("minute", "0");
		
		return util.callPutAPI(API_PATH + "/ab21e0e1167f4945bfa4d5eea0bc53ed", req.toString(), 0);
	}

	@Override
	public String restoreStep2() throws Exception {
		HttpUtil util = getSchedulerHttpUtil();
		return util.callPostAPI(EXE_API_PATH + "/ab21e0e1167f4945bfa4d5eea0bc53ed", "", 0);
	}

	@Override
	public String restoreStep3(String zipName) throws Exception {
		HttpUtil util = getEsHttpUtil();
		JSONObject req = new JSONObject();
//		req.put("indices", "-.opendistro_security");
//		req.put("include_global_state", false);
		return util.callPostAPI(BACKUP_API_PATH + zipName + "/_restore", req.toString(), 0, unilogConfigService.getUnilogConfigByName("http.kiandes.auth"));
	}

	@Override
	public String newPolicy(JobVo vo) throws Exception {
		HttpUtil util = getKibanaHttpUtil();
		String result = null;
		
		String minIndexAge = "";
		switch (vo.getTimeType()) {
		case "0":
			minIndexAge = "30d";
			break;
		case "1":
			minIndexAge = "90d";
			break;
		case "2":
			minIndexAge = "180d";
			break;
		case "3":
			minIndexAge = "365d";
			break;
		}
		
		JSONObject reqJson = new JSONObject();
		JSONObject policy = new JSONObject();
		
		JSONArray states = new JSONArray();
		JSONObject states1 = new JSONObject();
		JSONObject states2 = new JSONObject();
		JSONArray actions = new JSONArray();
		JSONArray transitions = new JSONArray();
		
		JSONObject tData = new JSONObject();
		
		tData.put("state_name", "cold");
		transitions.put(tData);
		states1.put("name", "hot");
		states1.put("actions", new JSONArray().put(new JSONObject().put("rollover", new JSONObject().put("min_index_age", minIndexAge))));
		states1.put("transitions", transitions);
		
		JSONObject aData = new JSONObject();
		aData.put("repository", unilogConfigService.getUnilogConfigByName("create.policy.action.repository"));
		aData.put("snapshot", unilogConfigService.getUnilogConfigByName("create.policy.action.snapshot"));
		actions.put(new JSONObject().put("snapshot", aData));
		states2.put("name", "cold");
		states2.put("actions", actions);
		states2.put("transitions", new JSONArray());
		
		states.put(states1);
		states.put(states2);
		policy.put("description", vo.getPolicyDesc());
		policy.put("default_state", "hot");
		policy.put("states", states);
		
		reqJson.put("policy", policy);
				
		try {
			if(JobVo.SAVE.equals(vo.getType())) {
				result = util.callPutAPI("/api/ism/policies/" + vo.getPolicyName() , reqJson.toString(), 0, unilogConfigService.getUnilogConfigByName("http.kiandes.auth"));
			}

			if(JobVo.UPDATE.equals(vo.getType())){
				String param = "primaryTerm=%s&seqNo=%s";	
				result = util.callPutAPI("/api/ism/policies/" + vo.getPolicyName() + "?" + String.format(param, vo.getPrimaryTerm(), vo.getSeqNo()), reqJson.toString(), 0, unilogConfigService.getUnilogConfigByName("http.kiandes.auth"));
			}
			
		} catch (Exception e) {
			throw e;
		}

		return result;
	}

	
	@Override
	public String delPolicy(String policyName) throws Exception {
		HttpUtil util = getKibanaHttpUtil();		
		return util.callDeleteAPI("/api/ism/policies/"+policyName, 0, unilogConfigService.getUnilogConfigByName("http.kiandes.auth"));
	}

	@Override
	public String getPolicyList(String form, String policyName) throws Exception {
		HttpUtil util = getKibanaHttpUtil();
		String response = null;
		JSONObject resultJ = new JSONObject();
		JSONObject data = null;
		JSONArray datList = new JSONArray();
		
		String param = "from=%s&search=%s&size=20&sortDirection=desc&sortField=id";
		response = util.callGetAPI("/api/ism/policies" + "?" + String.format(param, form, policyName), 0 ,unilogConfigService.getUnilogConfigByName("http.kiandes.auth"));
		JSONObject json = new JSONObject(response);

		JSONObject responseJ = json.getJSONObject("response");
		JSONArray policies = responseJ.getJSONArray("policies");
		for(int i = 0 ; i < policies.length() ; i++) {
			JSONObject object  = policies.getJSONObject(i);
			data = new JSONObject();
			data.put("seq_no", object.get("seqNo"));
			data.put("primary_term", object.get("primaryTerm"));
			data.put("policy_name", object.getJSONObject("policy").getJSONObject("policy").get("policy_id"));//policy_name
			data.put("desc", object.getJSONObject("policy").getJSONObject("policy").get("description"));//說明
			data.put("last_updated_time", dataTran(object.getJSONObject("policy").getJSONObject("policy").get("last_updated_time").toString()));//最後更新時間
			datList.put(data);
		}
		
		resultJ.put("data", datList);
		
		return resultJ.toString();
	}
	
	private String dataTran(String time) {
		SimpleDateFormat sdf= new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		long mseconds = Long.valueOf(time);
        java.util.Date date = new Date(mseconds);
        String str = sdf.format(date);
        return str;
	}

	@Override
	public String getIndexList(String from, String indexName) throws Exception {
		HttpUtil util = getKibanaHttpUtil();
		String param = "api/ism/managedIndices?from=%s&search=%s&size=20&sortDirection=desc&sortField=index";
		return util.callGetAPI(String.format(param, from,indexName), 0,unilogConfigService.getUnilogConfigByName("http.kiandes.auth"));
	}

	@Override
	public String delIndex(String indexName, String policyName) throws Exception {
		HttpUtil util = getKibanaHttpUtil();
		HttpUtil esutil = getEsHttpUtil();
		JSONObject req = new JSONObject();
		req.put("indices", new JSONArray().put(indexName));
		String result = "";

		try {
			esutil.callDeleteAPI("_index_template/"+indexName.substring(0, indexName.lastIndexOf("-")) + policyName , 0, unilogConfigService.getUnilogConfigByName("http.kiandes.auth"));
		}catch(Exception e) {
			e.printStackTrace();
			throw e;
		}
		
		try {
			result = util.callPostAPI("api/ism/removePolicy", req.toString(), 0, unilogConfigService.getUnilogConfigByName("http.kiandes.auth"));
		}catch(Exception e) {
			e.printStackTrace();
			throw e;
		}
		
		return result;
	}

	@Override
	public String newIndex1(String indexName, String policyName, String zipPwd, String timeType) throws Exception {
		HttpUtil util = getKibanaHttpUtil();
		JSONObject req = new JSONObject();
		req.put("indices", new JSONArray().put(indexName));
		req.put("policyId", policyName);
		return util.callPostAPI("api/ism/applyPolicy", req.toString(), 0, unilogConfigService.getUnilogConfigByName("http.kiandes.auth"));
	}

	@Override
	public String newIndex2(String indexName, String policyName, String zipPwd, String timeType) throws Exception {
		HttpUtil util = getEsHttpUtil();
		JSONObject req = new JSONObject();
		JSONObject settings = new JSONObject();
		settings.put("opendistro.index_state_management.policy_id", policyName);
		settings.put("opendistro.index_state_management.rollover_alias", indexName.substring(0, indexName.lastIndexOf("-")));
		req.put("index_patterns", new JSONArray().put(indexName.substring(0, indexName.lastIndexOf("-")) + "-*"));
		req.put("template", new JSONObject().put("settings", settings));

		return util.callPutAPI("_index_template/"+indexName.substring(0, indexName.lastIndexOf("-")) + policyName , req.toString(), 0, unilogConfigService.getUnilogConfigByName("http.kiandes.auth"));
	}

	@Override
	public String newIndex3(String indexName, String policyName, String zipPwd, String timeType) throws Exception {
		HttpUtil util = getSchedulerHttpUtil();
		JSONObject req = new JSONObject();
		JSONObject pubArgs = new JSONObject();
		String month = "";
		switch (timeType) {
		case "0":
			month = "1";
			break;
		case "1":
			month = "3";
			break;
		case "2":
			month = "6";
			break;
		case "3":
			month = "12";
			break;
		}
		
		pubArgs.put("Backup_dst", unilogConfigService.getUnilogConfigByName("backup.dst"));
		pubArgs.put("Index_name", indexName.substring(0, indexName.lastIndexOf("-")));
		pubArgs.put("Password", zipPwd);
		
		req.put("job_class_string", "simple_scheduler.jobs.scheduled_bak.Scheduled_bakJob");
		req.put("name", indexName.substring(0, indexName.lastIndexOf("-")));
		req.put("pub_args", new JSONArray().put(pubArgs));
		req.put("month", "*/"+month);
//		req.put("month", "*");//TODO 測試code
		req.put("day", "*");
		req.put("week", "*");
		req.put("day_of_week", "*");
		req.put("hour", "0");
		req.put("minute", "0");
//		req.put("minute", "*/30");//測試code

		return util.callPostAPI(API_PATH, req.toString(), 0);
	}
}
