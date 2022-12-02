package demo.vo.user;

public class SignUpVo {
	
	private String userAccount;
	private String userFirstName;
	private String userLastName;
	private String nickName;
	private String userEmail;
	private Integer groupId;
	private String userToken;
	private String kibanaToken;
	private boolean isOnAlarm = false;
	
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
	public String getUserToken() {
		return userToken;
	}
	public void setUserToken(String userToken) {
		this.userToken = userToken;
	}
	public String getKibanaToken() {
		return kibanaToken;
	}
	public void setKibanaToken(String kibanaToken) {
		this.kibanaToken = kibanaToken;
	}
	public boolean isOnAlarm() {
		return isOnAlarm;
	}
	public void setOnAlarm(boolean isOnAlarm) {
		this.isOnAlarm = isOnAlarm;
	}
	 
}
