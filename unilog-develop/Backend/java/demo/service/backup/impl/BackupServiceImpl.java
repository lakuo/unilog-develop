package demo.service.backup.impl;

import java.net.URLEncoder;

import org.apache.commons.lang3.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import demo.service.backup.BackupService;
import demo.service.serverapi.CallBackUpAPIService;
import demo.vo.api.JobVo;

@Service("backupService")
public class BackupServiceImpl implements BackupService {

	private static final Logger logger 
	  = LoggerFactory.getLogger(BackupServiceImpl.class);
	
	@Autowired
	@Qualifier("callBackUpAPIService")
	private CallBackUpAPIService callBackUpAPIService;
	
	@Override
	public String backupMain(JobVo vo) throws Exception {
		String zipName = "";
		String result = "";
		JSONObject responseJ = new JSONObject();
		
		if(vo != null) {
			zipName = vo.getZipName();
		}
		
		try {
			result = callBackUpAPIService.getBackupMain(zipName);
			
			JSONArray joblist = new JSONArray();
			JSONObject resultJ = null;
			JSONObject json = new JSONObject(result);
			JSONArray list = json.getJSONArray("snapshots");

			for(int i = 0 ; i < list.length() ; i++) {
				resultJ = new JSONObject();
				JSONObject job = list.getJSONObject(i);
				String indexName = "";
				try {
					JSONArray index = job.getJSONArray("indices");
					indexName = index.getString(0);
				}catch(Exception e) {
					indexName = job.getString("indices");
					indexName = indexName.replaceAll("[\\[\\]\"]", "");
				}
				
				resultJ.put("zip_name", job.get("snapshot"));//備份檔名
				resultJ.put("state", job.get("state"));//狀態
				resultJ.put("start_time", job.get("start_time"));
				resultJ.put("end_time", job.get("end_time"));
				resultJ.put("index_name", indexName);//索引名稱
				joblist.put(resultJ);
			}
			
			responseJ.put("data", joblist);
		}catch(Exception e) {
			e.printStackTrace();
			throw e;
		}
		
		return responseJ.toString();
	}

	@Override
	public String restore(JobVo vo) throws Exception {
		String zipName = "";
		String zipPath = "/home/tmp_bak";//TODO 已改參數
		String zipPwd = "";
		String result  = "";
		String errorMessage = "參數錯誤";
		JSONObject responseJ = new JSONObject();
		if(vo != null) {
			zipName = vo.getZipName();
			zipPwd = vo.getZipPwd();
		}
		
		if(StringUtils.isBlank(zipName)) {
			errorMessage += ",請帶備份檔名";
		}
		
		String[] zip = zipName.split("-");
		String date = zip[zip.length-2];
		String regDateFormat = "^(\\d{4}\\.)([0-1]\\d\\.)([0-3]\\d)$";
		if(!date.matches(regDateFormat)) {
			errorMessage += ",檔名格式錯誤";
		}
		
		if(StringUtils.isBlank(zipPwd)) {
			errorMessage += ",請帶檔案密碼";
		}
		
		if(!"參數錯誤".equals(errorMessage)) {
			throw new Exception(errorMessage);
		}
		
		
		try {
			result = callBackUpAPIService.restoreStep1(zipName.substring(0, zipName.lastIndexOf("-")), zipPath, zipPwd);
			if(!(result.indexOf("job_id") > -1)) {
				throw new Exception("還原失敗");
			}
			System.out.println(":"+result);
			result = callBackUpAPIService.restoreStep2();
			if(!(result.indexOf("execution_id") > -1)) {
				throw new Exception("還原失敗");
			}
			System.out.println("::"+result);
			result = callBackUpAPIService.restoreStep3(zipName);
			if(!(result.indexOf("accepted") > -1)) {
				throw new Exception("還原失敗");
			}

			responseJ.put("result", "success");
		}catch(Exception e) {
			e.printStackTrace();
			throw e;
		}
		
		return responseJ.toString();
	}

	@Override
	public String newPolicy(JobVo vo) throws Exception {
		String result = "";
		String errorMessage = "參數錯誤";
		
		if(vo != null) {
			if(StringUtils.isBlank(vo.getPolicyName())) {
				errorMessage +=  ",policy_name為空";
			}
			
			if(StringUtils.isBlank(vo.getPolicyDesc())) {
				errorMessage +=  ",規則說明為空";
			}
		
			if(StringUtils.isBlank(vo.getType())) {
				errorMessage +=  ",type為空";
			}

			if(JobVo.UPDATE.equals(vo.getType())) {
				if(StringUtils.isBlank(vo.getPrimaryTerm())) {
					errorMessage +=  ",primaryTerm為空";
				}

				if(StringUtils.isBlank(vo.getSeqNo())) {
					errorMessage +=  ",seqNo為空";
				}
			}
			
			if(vo.getPolicyDesc().length() > 200) {
				throw new Exception("規則說明長度過長");
			}
			
			if(StringUtils.isBlank(vo.getTimeType())) {
				errorMessage +=  ",週期為空";
			}
			
			if(!"參數錯誤".equals(errorMessage)) {
				throw new Exception(errorMessage);
			}
			
		}else {
			throw new Exception(errorMessage);
		}

		try {
			result = callBackUpAPIService.newPolicy(vo);
			logger.info("newPolicy result: "+result);
		}catch(Exception e) {
			e.printStackTrace();
			throw e;
		}
		JSONObject resultJ = new JSONObject(result);
		JSONObject responseJ = new JSONObject();
		responseJ.put("policy_name", resultJ.getJSONObject("response").get("_id"));
		responseJ.put("seq_no", resultJ.getJSONObject("response").get("_seq_no").toString());
		responseJ.put("primary_term", resultJ.getJSONObject("response").get("_primary_term").toString());
		return responseJ.toString();
	}

	@Override
	public String delPolicy(JobVo vo) throws Exception {
		String result = "";
		String errorMessage = "參數錯誤";
		
		if(vo != null) {
			if(StringUtils.isBlank(vo.getPolicyName())) {
				errorMessage +=  ",policy_name為空";
			}
			
			if(!"參數錯誤".equals(errorMessage)) {
				throw new Exception(errorMessage);
			}
		}else {
			throw new Exception(errorMessage);
		}
		result = callBackUpAPIService.delPolicy(vo.getPolicyName());
		JSONObject object = new JSONObject(result);
		System.out.println(object);
		if(!object.getBoolean("ok")) {
			throw new Exception("刪除失敗");
		}
		
		return new JSONObject().put("policy_name", vo.getPolicyName()).toString();
	}

	@Override
	public String policyList(JobVo vo) throws Exception {
		String from = "0";
		String policyName = "";
		String result  = "";
		
		if(vo != null) {
			from = StringUtils.isNotBlank(vo.getFrom()) ? vo.getFrom() : from;
			policyName = vo.getPolicyName();
		}
	
		try {
			result = callBackUpAPIService.getPolicyList(from,URLEncoder.encode(policyName.replace("-", " "),"utf-8"));
		}catch(Exception e) {
			e.printStackTrace();
			throw e;
		}

		return result;
	}

	@Override
	public String indexList(JobVo vo) throws Exception {
		String result  = "";
		String from = "0";
		String indexName = "";
		
		if(vo == null) {
			throw new Exception("參數錯誤");
		}
		
		from = StringUtils.isNotBlank(vo.getFrom()) ? vo.getFrom() : from;
		indexName = StringUtils.isNotBlank(vo.getIndexName()) ? vo.getIndexName() : indexName;
		
		try {
			result = callBackUpAPIService.getIndexList(from, URLEncoder.encode(indexName.replace("-", " "),"utf-8"));
		}catch(Exception e) {
			e.printStackTrace();
			throw e;
		}
		
		JSONObject json = new JSONObject(result);
		
		if(!json.getBoolean("ok")) {
			throw new Exception("資料異常");
		}
		JSONObject response = json.getJSONObject("response");
		JSONArray indices = response.getJSONArray("managedIndices");
		JSONArray dataList = new JSONArray();
		for(int i = 0 ; i < indices.length() ; i++) {
			JSONObject data = new JSONObject();
			data.put("index_name", indices.getJSONObject(i).get("index"));
			data.put("policy_name", indices.getJSONObject(i).get("policyId"));
			if(!indices.getJSONObject(i).isNull("managedIndexMetaData") && !indices.getJSONObject(i).getJSONObject("managedIndexMetaData").isNull("action")) {
				data.put("action", indices.getJSONObject(i).getJSONObject("managedIndexMetaData").getJSONObject("action").get("name"));
				data.put("status", indices.getJSONObject(i).getJSONObject("managedIndexMetaData").getJSONObject("action").getBoolean("failed") ? "Failed":"Finished");
				data.put("info", indices.getJSONObject(i).getJSONObject("managedIndexMetaData").getJSONObject("info").get("message"));
			}else {
				data.put("action", "");
				data.put("status", "");
				data.put("info", "");
			}
			dataList.put(data);
		}
		
		return new JSONObject().put("data", dataList).toString();
	}

	@Override
	public String delIndex(JobVo vo) throws Exception {
		String indexName = "";
		String policyName = "";
		String result = "";
		if(vo == null) {
			throw new Exception("參數錯誤");
		}
		
		indexName = vo.getIndexName();
		if(StringUtils.isBlank(indexName)) {
			throw new Exception("參數錯誤,indexName為空值");
		}
		
		policyName = vo.getPolicyName();
		if(StringUtils.isBlank(policyName)) {
			throw new Exception("參數錯誤,policyName為空值");
		}
		
		try {
			result = callBackUpAPIService.delIndex(indexName,policyName);
		}catch(Exception e) {
			e.printStackTrace();
			throw e;
		}
		if(!(result.indexOf("response") > -1)) {
			JSONObject resultj = new JSONObject(result);

			if(resultj.getJSONObject("response").getBoolean("failures")) {
				throw new Exception("執行失敗");
			}
		}

		
		return new JSONObject().put("index_name", indexName).toString();
	}

	@Override
	public String newIndex(JobVo vo) throws Exception {
		String result = "";
		String errorMessage = "參數錯誤";
		
		if(vo != null) {
			if(StringUtils.isBlank(vo.getIndexName())) {
				errorMessage +=  ",索引名稱為空";
			}
			
			if(StringUtils.isBlank(vo.getPolicyName())) {
				errorMessage +=  ",規則為空";
			}

			if(StringUtils.isBlank(vo.getZipPwd())) {
				errorMessage +=  ",密碼為空";
			}
			
			if(StringUtils.isBlank(vo.getTimeType())) {
				errorMessage +=  ",週期為空";
			}
			
			if(!"參數錯誤".equals(errorMessage)) {
				throw new Exception(errorMessage);
			}
			
		}else {
			throw new Exception(errorMessage);
		}
		try {
			result = callBackUpAPIService.newIndex1(vo.getIndexName(), vo.getPolicyName(), vo.getZipPwd(), vo.getTimeType());
			System.out.println(" :"+result);
			if(StringUtils.isBlank(result) || !(result.indexOf("response") > -1)) {
				logger.error("套用規則失敗");
				logger.error(new JSONObject().getJSONObject("failed_indices").get("index_name") + ":");
				logger.error((String) new JSONObject().getJSONObject("failed_indices").get("reason"));
				throw new Exception("套用規則失敗");
			}
			
			result = callBackUpAPIService.newIndex2(vo.getIndexName(), vo.getPolicyName(), vo.getZipPwd(), vo.getTimeType());

			if(StringUtils.isBlank(result) || !(new JSONObject(result).getBoolean("acknowledged"))) {
				logger.error("套用規則第2步失敗 :");
				logger.error(vo.getIndexName());
				throw new Exception("套用規則失敗");
			}
			
			result = callBackUpAPIService.newIndex3(vo.getIndexName(), vo.getPolicyName(), vo.getZipPwd(), vo.getTimeType());

			if(StringUtils.isBlank(result)) {
				logger.error("套用規則第3步失敗 :");
				logger.error(vo.getIndexName());
				throw new Exception("套用規則失敗");
			}
		}catch(Exception e) {
			e.printStackTrace();
			throw e;
		}
		
		
		return result;
	}
}
