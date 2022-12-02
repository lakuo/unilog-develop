package demo.vo.user;

public class UserVo {
	
	private String uuid;  
	private String userAccount;
	private String userFirstName;
	private String userLastName;
	private String nickName;
	private String userEmail;
	private Integer groupId;
	private boolean isOnAlarm = false;
	private boolean isDelete = false;
	private String kibanaToken = "";
	private String mima = "";
	private String newmima = "";
	private java.sql.Timestamp expiredDate;
	
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

	public String getMima() {
		return mima;
	}

	public void setMima(String mima) {
		this.mima = mima;
	}

	public String getNewmima() {
		return newmima;
	}

	public void setNewmima(String newmima) {
		this.newmima = newmima;
	}
	
}
