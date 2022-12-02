package demo.model.user;


public class AccessLevelModel {
	
	private Integer accessLevelId;
	private Integer groupId;
	private String groupcnname;
	private boolean isClose = false;
	private boolean isRead = false;
	private boolean isWrite = false;
	private Integer mainTitleId;
	private String mainTitleName;
	private Integer subTitleId;
	private String subTitleName;
	
	public Integer getAccessLevelId() {
		return accessLevelId;
	}
	public void setAccessLevelId(Integer accessLevelId) {
		this.accessLevelId = accessLevelId;
	}
	public Integer getGroupId() {
		return groupId;
	}
	public void setGroupId(Integer groupId) {
		this.groupId = groupId;
	}
	public String getGroupcnname() {
		return groupcnname;
	}
	public void setGroupcnname(String groupcnname) {
		this.groupcnname = groupcnname;
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
	public Integer getMainTitleId() {
		return mainTitleId;
	}
	public void setMainTitleId(Integer mainTitleId) {
		this.mainTitleId = mainTitleId;
	}
	public String getMainTitleName() {
		return mainTitleName;
	}
	public void setMainTitleName(String mainTitleName) {
		this.mainTitleName = mainTitleName;
	}
	public Integer getSubTitleId() {
		return subTitleId;
	}
	public void setSubTitleId(Integer subTitleId) {
		this.subTitleId = subTitleId;
	}
	public String getSubTitleName() {
		return subTitleName;
	}
	public void setSubTitleName(String subTitleName) {
		this.subTitleName = subTitleName;
	}
	
}
