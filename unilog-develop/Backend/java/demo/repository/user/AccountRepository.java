package demo.repository.user;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import demo.entity.user.Account;

public interface AccountRepository extends JpaRepository<Account, String> {

	@Query(value = "select count(*) from account where account = ?1 and mima = ?2", nativeQuery = true)
	Integer checkLoaclUser(String account, String mima);
	
	@Query(value = "select count(*) from account where account = ?1 ", nativeQuery = true)
	Integer checkLoaclAccount(String account);
	
	@Transactional
	@Modifying
	@Query(value = "INSERT INTO account(\n" + 
			" account, mima)\n" + 
			"	VALUES (?1, ?2);", nativeQuery = true)
	int createLoaclUser(String account, String mima);
	
	@Transactional
	@Modifying
	@Query(value = "update account set mima = ?1 where account = ?2 ", nativeQuery = true)
	int updateLoaclUser(String mima, String account );
	
	@Transactional
	@Modifying
	@Query(value = "update account set mima = ?1 where account = ?2 and mima = ?3", nativeQuery = true)
	int updateLoaclUserPWD(String mima, String account ,String newmima);
	
	@Transactional
	@Modifying
	@Query(value = "DELETE FROM account where account = ?1 ", nativeQuery = true)
	int deleteLoaclUser(String account);

}
