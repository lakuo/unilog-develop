package demo.repository.user;

import java.util.Date;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import demo.entity.user.UserInfo;

@Repository
public interface UserInfoRepository extends JpaRepository<UserInfo, String> {

	UserInfo findByUuid(String uuid);

	UserInfo findByUserAccount(String userAccount);

	List<UserInfo> findAll();

	@Query(value = "select group_id from user_info where uuid = ?1", nativeQuery = true)
	Integer findGroupIdByUuid(String uuid);

	@Query(value = "select expired_Date from user_info where uuid = ?1", nativeQuery = true)
	String getExpiredDateByUuid(String uuid);

	@Transactional
	@Modifying
	@Query(value = "select a.uuid,a.user_account,a.user_first_name,a.user_last_name,a.nick_name,a.user_email,a.group_id,b.groupCNName,a.is_on_alarm,a.is_delete,a.kibana_token,a.expired_date from user_info a left join group_info b on a.group_id = b.group_id where a.is_delete = false order by a.create_date desc", nativeQuery = true)
	List<Object[]> getAllAccount();

	@Transactional
	@Modifying
	@Query(value = "select a.uuid,a.user_account,a.user_first_name,a.user_last_name,a.nick_name,a.user_email,a.group_id,b.groupCNName,a.is_on_alarm,a.is_delete,a.kibana_token,a.expired_date from user_info a left join group_info b on a.group_id = b.group_id where a.uuid = ?1", nativeQuery = true)
	List<Object[]> getAccountByUuid(String uuid);

	@Transactional
	@Modifying
	@Query(value = "INSERT INTO user_info(\n"
			+ " uuid, user_account,group_id,user_first_name, user_last_name, user_email, is_delete, is_on_alarm, update_date)\n"
			+ "	VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9);", nativeQuery = true)
	int save(String uuid, String userAccount, Integer groupId, String user_first_name, String user_last_name,
			String user_email, boolean is_delete, boolean is_on_alarm, Date update_date);

	@Transactional
	@Modifying
	@Query(value = "update user_info set expired_Date = ?1 where uuid = ?2", nativeQuery = true)
	void updateExpiredDateByUuid(Date expiredDate, String uuid);

	@Transactional
	@Modifying
	@Query(value = "update user_info set group_id = ?1,user_first_name = ?2, user_last_name =?3, user_email =?4, is_delete =?5, is_on_alarm = ?6, update_date =?7 where uuid = ?8", nativeQuery = true)
	int updateAccountByUuid(Integer groupId, String user_first_name, String user_last_name, String user_email,
			boolean is_delete, boolean is_on_alarm, Date update_date, String uuid);

	@Transactional
	@Modifying
	@Query(value = "update user_info set user_first_name = ?1, user_last_name =?2, user_email =?3 where uuid = ?4", nativeQuery = true)
	int updatePersonalInfoByUuid(String user_first_name, String user_last_name, String user_email, String uuid);

	@Transactional
	@Modifying
	@Query(value = "update user_info set kibana_token = ?1 where uuid = ?2", nativeQuery = true)
	void updateKibanaTokenByUuid(String kibanaToken, String uuid);

	@Transactional
	@Modifying
	@Query(value = "DELETE FROM user_info where user_account = ?1 ", nativeQuery = true)
	int deleteUserInfo(String account);
}
