package demo.entity.user;

import javax.persistence.Column;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class AccessLevel {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name = "accessLevelId" , nullable = false)
	private Integer accessLevelId;
	
	@Column(name = "mainTitleId" , nullable = false)
	private Integer mainTitleId;
	
	@Column(name = "subTitleId" , nullable = false)
	private Integer subTitleId;
	
	@Column(name = "groupId" , nullable = false)
	private Integer groupId;
	
	@Column(name = "isClose" , nullable = false)
	private boolean isClose;

	@Column(name = "isRead" , nullable = false)
	private boolean isRead;
	
	@Column(name = "isWrite" , nullable = false)
	private boolean isWrite;
	
	@Column(name = "create_date", nullable = false, insertable = false, updatable = false, columnDefinition = "timestamp without time zone DEFAULT CURRENT_TIMESTAMP")
	private java.sql.Timestamp createDate;

	@Column(name = "update_date", columnDefinition = "timestamp without time zone ")
	private java.sql.Timestamp updateDate;

	public Integer getAccessLevelId() {
		return accessLevelId;
	}

	public void setAccessLevelId(Integer accessLevelId) {
		this.accessLevelId = accessLevelId;
	}

	public Integer getMainTitleId() {
		return mainTitleId;
	}

	public void setMainTitleId(Integer mainTitleId) {
		this.mainTitleId = mainTitleId;
	}

	public Integer getSubTitleId() {
		return subTitleId;
	}

	public void setSubTitleId(Integer subTitleId) {
		this.subTitleId = subTitleId;
	}

	public Integer getGroupId() {
		return groupId;
	}

	public void setGroupId(Integer groupId) {
		this.groupId = groupId;
	}

	public boolean isClose() {
		return isClose;
	}

	public void setClose(boolean isClose) {
		this.isClose = isClose;
	}

	public boolean isRead() {
		return isRead;
	}

	public void setRead(boolean isRead) {
		this.isRead = isRead;
	}

	public boolean isWrite() {
		return isWrite;
	}

	public void setWrite(boolean isWrite) {
		this.isWrite = isWrite;
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
