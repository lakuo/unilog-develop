package demo.service.backup;

import demo.vo.api.JobVo;

public interface BackupService {

	/**
	 * 取得單一或所有job
	 * @return
	 */
	public String backupMain(JobVo vo) throws Exception;
	
	/**
	 * 刪除job
	 * @param path
	 * @return
	 */
	public String restore(JobVo vo) throws Exception;
	
	/**
	 * 新增或編輯job
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
	public String delPolicy(JobVo vo) throws Exception;
	
	/**
	 * 執行job
	 * @param jobId
	 * @return
	 * @throws Exception
	 */
	public String policyList(JobVo vo) throws Exception ;

	/**
	 * 取得所有執行api
	 * @param startTime
	 * @param endTime
	 * @return
	 * @throws Exception
	 */
	public String indexList(JobVo vo) throws Exception;
	
	/**
	 * 刪除index
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public String delIndex(JobVo vo) throws Exception;
	
	/**
	 * 套用索引規則
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	public String newIndex(JobVo vo) throws Exception;
}
