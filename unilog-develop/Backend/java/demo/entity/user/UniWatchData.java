package demo.entity.user;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class UniWatchData {
	
	@Id
	@Column(name = "pid" , nullable = false, length = 16)
	private String pid;
	
	@Column(name = "ip" , nullable = false, length = 16)
	private String ip;
	
	@Column(name = "watch_path" , nullable = false, length = 100)
	private String watchPath;
	
	@Column(name = "hash_method" , nullable = false, length = 48)
	private String hashMethod;
	
	@Column(name = "states" , nullable = false, length = 10)
	private String states;

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getIp() {
		return ip;
	}

	public void setIp(String ip) {
		this.ip = ip;
	}

	public String getWatchPath() {
		return watchPath;
	}

	public void setWatchPath(String watchPath) {
		this.watchPath = watchPath;
	}

	public String getHashMethod() {
		return hashMethod;
	}

	public void setHashMethod(String hashMethod) {
		this.hashMethod = hashMethod;
	}

	public String getStates() {
		return states;
	}

	public void setStates(String states) {
		this.states = states;
	}
	
	
}
