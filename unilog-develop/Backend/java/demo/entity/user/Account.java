package demo.entity.user;

import javax.persistence.Column;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class Account {
	
	@Id
	@Column(name = "account" , nullable = false, length = 256)
	private String account;
	
	@Column(name = "mima" , nullable = false, length = 256)
	private String mima;
	
	@Column(name = "create_date", nullable = false, insertable = false, updatable = false, columnDefinition = "timestamp without time zone DEFAULT CURRENT_TIMESTAMP")
	private java.sql.Timestamp createDate;

	@Column(name = "update_date", columnDefinition = "timestamp without time zone ")
	private java.sql.Timestamp updateDate;

}
