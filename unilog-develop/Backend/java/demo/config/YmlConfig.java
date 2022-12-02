package demo.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class YmlConfig {
	
	@Value("${tokenExpiredTime.user}")
	private int expiredTimeUser;
	
	@Value("${log_path}")
	public String log_path;
	
	public int getExpiredTimeUser() {
		return expiredTimeUser;
	}

	public void setExpiredTimeUser(int expiredTimeUser) {
		this.expiredTimeUser = expiredTimeUser;
	}

	public String getLog_path() {
		return log_path;
	}

	public void setLog_path(String log_path) {
		this.log_path = log_path;
	}
	
}
