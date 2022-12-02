package demo.service.serverapi;

import demo.vo.api.JobVo;

public interface CallBackUpAPIService {
	
	/**
	 * 取得單一或所有備份資料
	 * 
	 * @return
	 */
	public String getBackupMain(String zipName) throws Exception;
	
	/**
	 * 還原步驟1
	 * @param path
	 * @return
	 */
	public String restoreStep1(String zipName, String zipPath,String zipPwd) throws Exception;
	
	/**
	 * 還原步驟2
	 * @return
	 * @throws Exception
	 */
	public String restoreStep2() throws Exception;
	
	/**
	 * 還原步驟3
	 * @param zipName
	 * @return
	 * @throws Exception
	 */
	public String restoreStep3(String zipName) throws Exception;
	
	/**
	 * 新增或編輯policy
	 * @param path
	 * @param type
	 * @param vo
	 * @return
	 */
	public String newPolicy(JobVo vo) throws Exception;
	
	/**
	 * 刪除policy
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public String delPolicy(String policyName) throws Exception;
	
	/**
	 * 取從policy清單
	 * @param jobId
	 * @return
	 * @throws Exception
	 */
	public String getPolicyList(String form, String policyName) throws Exception ;

	/**
	 * 取得index資料
	 * @param startTime
	 * @param endTime
	 * @return
	 * @throws Exception
	 */
	public String getIndexList(String from, String indexName) throws Exception;
	
	/**
	 * 刪除index
	 * @param indexName
	 * @return
	 * @throws Exception
	 */
	public String delIndex(String indexName, String policyName) throws Exception;
	
	/**
	 * 套用規則步驟1
	 * @param indexName
	 * @param policyName
	 * @param zipPwd
	 * @param timeType
	 * @return
	 * @throws Exception
	 */
	public String newIndex1(String indexName, String policyName, String zipPwd, String timeType) throws Exception;
	
	/**
	 * 套用規則步驟2
	 * @param indexName
	 * @param policyName
	 * @param zipPwd
	 * @param timeType
	 * @return
	 * @throws Exception
	 */
	public String newIndex2(String indexName, String policyName, String zipPwd, String timeType) throws Exception;
	
	/**
	 * 套用規則步驟3
	 * @param indexName
	 * @param policyName
	 * @param zipPwd
	 * @param timeType
	 * @return
	 * @throws Exception
	 */
	public String newIndex3(String indexName, String policyName, String zipPwd, String timeType) throws Exception;

}
