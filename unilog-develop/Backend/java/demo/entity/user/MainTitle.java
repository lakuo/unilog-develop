package demo.entity.user;

import javax.persistence.Column;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class MainTitle {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name = "mainTitleId" , nullable = false)
	private Integer mainTitleId;
	
	@Column(name = "mainTitleName" , length = 50)
	private String mainTitleName;
	
	@Column(name = "create_date", nullable = false, insertable = false, updatable = false, columnDefinition = "timestamp without time zone DEFAULT CURRENT_TIMESTAMP")
	private java.sql.Timestamp createDate;

	@Column(name = "update_date", columnDefinition = "timestamp without time zone ")
	private java.sql.Timestamp updateDate;

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
