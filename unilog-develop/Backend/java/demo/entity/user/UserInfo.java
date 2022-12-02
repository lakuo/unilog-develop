package demo.entity.user;

import javax.persistence.Column;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import org.hibernate.annotations.GenericGenerator;

import demo.config.Constant; 

@Entity
public class UserInfo {
	
	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid")
	@Column(name = "uuid", length = Constant.ID_LENGTH)
	private String uuid;  
	
	@Column(name = "userAccount", length = 64, nullable = false, unique = true)
	private String userAccount;
	
	@Column(name = "userFirstName" , length = 20)
	private String userFirstName;
	
	@Column(name = "userLastName" , length = 20)
	private String userLastName;
	
	@Column(name = "nickName" , length = 10)
	private String nickName;
	
	@Column(name = "userEmail" , length = 64)
	private String userEmail;
	
	@Column(name = "groupId")
	private Integer groupId;
	
	@Column(name = "isOnAlarm" , nullable = false)
	private boolean isOnAlarm = false;
	
	@Column(name = "isDelete" , nullable = false)
	private boolean isDelete = false;
	
	@Column(name = "kibanaToken" , length = 255)
	private String kibanaToken;
	
	
	
	@Column(name = "expired_date", columnDefinition = "timestamp without time zone ")
	private java.sql.Timestamp expiredDate;
	
	// 建立與更新時間
	@Column(name = "create_date", nullable = false, insertable = false, updatable = false, columnDefinition = "timestamp without time zone DEFAULT CURRENT_TIMESTAMP")
	private java.sql.Timestamp createDate;

	@Column(name = "update_date", columnDefinition = "timestamp without time zone ")
	private java.sql.Timestamp updateDate;

	public String getUuid() {
		return uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public String getUserAccount() {
		return userAccount;
	}

	public void setUserAccount(String userAccount) {
		this.userAccount = userAccount;
	}

	public String getUserFirstName() {
		return userFirstName;
	}

	public void setUserFirstName(String userFirstName) {
		this.userFirstName = userFirstName;
	}

	public String getUserLastName() {
		return userLastName;
	}

	public void setUserLastName(String userLastName) {
		this.userLastName = userLastName;
	}

	public String getNickName() {
		return nickName;
	}

	public void setNickName(String nickName) {
		this.nickName = nickName;
	}

	public String getUserEmail() {
		return userEmail;
	}

	public void setUserEmail(String userEmail) {
		this.userEmail = userEmail;
	}

	public Integer getGroupId() {
		return groupId;
	}

	public void setGroupId(Integer groupId) {
		this.groupId = groupId;
	}

	public boolean isOnAlarm() {
		return isOnAlarm;
	}

	public void setOnAlarm(boolean isOnAlarm) {
		this.isOnAlarm = isOnAlarm;
	}

	public boolean isDelete() {
		return isDelete;
	}

	public void setDelete(boolean isDelete) {
		this.isDelete = isDelete;
	}

	public String getKibanaToken() {
		return kibanaToken;
	}

	public void setKibanaToken(String kibanaToken) {
		this.kibanaToken = kibanaToken;
	}

	public java.sql.Timestamp getExpiredDate() {
		return expiredDate;
	}

	public void setExpiredDate(java.sql.Timestamp expiredDate) {
		this.expiredDate = expiredDate;
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
