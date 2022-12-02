package demo.entity.user;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class UniWatchGroup {

	@Id
	@Column(name = "group_id" , nullable = false, length = 16)
	private String groupId;
	
	@Column(name = "group_name" , nullable = false, length = 100)
	private String groupName;
	
	@Column(name = "note" , nullable = true, length = 200)
	private String note;

	@Column(name = "ip" , nullable = false, length = 200)
	private String ip;

	public String getGroupId() {
		return groupId;
	}

	public void setGroupId(String groupId) {
		this.groupId = groupId;
	}

	public String getGroupName() {
		return groupName;
	}

	public void setGroupName(String groupName) {
		this.groupName = groupName;
	}

	public String getNote() {
		return note;
	}

	public void setNote(String note) {
		this.note = note;
	}

	public String getIp() {
		return ip;
	}

	public void setIp(String ip) {
		this.ip = ip;
	}

}
