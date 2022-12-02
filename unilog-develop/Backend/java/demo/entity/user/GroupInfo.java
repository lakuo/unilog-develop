package demo.entity.user;

import javax.persistence.Column;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class GroupInfo {
	
	@Id
	@Column(name = "groupId" , nullable = false)
	private Integer groupId;
	
	@Column(name = "groupCNName" , length = 50)
	private String groupCNName;
	
	@Column(name = "groupENName" , length = 20)
	private String groupENName;
	
	@Column(name = "create_date", nullable = false, insertable = false, updatable = false, columnDefinition = "timestamp without time zone DEFAULT CURRENT_TIMESTAMP")
	private java.sql.Timestamp createDate;

	@Column(name = "update_date", columnDefinition = "timestamp without time zone ")
	private java.sql.Timestamp updateDate;

	public Integer getGroupId() {
		return groupId;
	}

	public void setGroupId(Integer groupId) {
		this.groupId = groupId;
	}

	public String getGroupCNName() {
		return groupCNName;
	}

	public void setGroupCNName(String groupCNName) {
		this.groupCNName = groupCNName;
	}

	public String getGroupENName() {
		return groupENName;
	}

	public void setGroupENName(String groupENName) {
		this.groupENName = groupENName;
	}

	public java.sql.Timestamp getCreateDate() {
		return createDate;
	}

	public void setCreateDate(java.sql.Timestamp createDate) {
		this.createDate = createDate;
	}

	public java.sql.Timestamp getUpdateDate() {
		return updateDate;
	}

	public void setUpdateDate(java.sql.Timestamp updateDate) {
		this.updateDate = updateDate;
	}

}
