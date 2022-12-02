package demo.entity.user;

import javax.persistence.Column;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class SubTitle {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name = "subTitleId" , nullable = false)
	private Integer subTitleId;
	
	@Column(name = "subTitleName" , length = 100)
	private String subTitleName;
	
	@Column(name = "create_date", nullable = false, insertable = false, updatable = false, columnDefinition = "timestamp without time zone DEFAULT CURRENT_TIMESTAMP")
	private java.sql.Timestamp createDate;

	@Column(name = "update_date", columnDefinition = "timestamp without time zone ")
	private java.sql.Timestamp updateDate;

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
