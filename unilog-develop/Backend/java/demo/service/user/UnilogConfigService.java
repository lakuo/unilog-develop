package demo.service.user;


public interface UnilogConfigService {

	public String getUnilogConfigByName(String name);
	
	public void refreshCacheConfig();
	
}
