package demo.entity.user;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class UnilogConfig {
	
	@Id
	@Column(name = "configName" , nullable = false)
	private String configName;
	
	@Column(name = "config" , length = 256)
	private String config;
	
	@Column(name = "create_date", nullable = false, insertable = false, updatable = false, columnDefinition = "timestamp without time zone DEFAULT CURRENT_TIMESTAMP")
	private java.sql.Timestamp createDate;

	@Column(name = "update_date", columnDefinition = "timestamp without time zone ")
	private java.sql.Timestamp updateDate;

	public String getConfigName() {
		return configName;
	}

	public void setConfigName(String configName) {
		this.configName = configName;
	}

	public String getConfig() {
		return config;
	}

	public void setConfig(String config) {
		this.config = config;
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
