package demo.service.serverapi;

public interface CallWatchAPIService {

	public String saveWatch(String ip, String hash, String filePath) throws Exception;
	
	public String testWatch(String ip) throws Exception;
	
	public String delWatch(String pid, String ip) throws Exception;
	
	public String getWatchData(String ip) throws Exception;
}
