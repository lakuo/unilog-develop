package demo.repository.user;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import demo.entity.user.AccessLevel;

public interface AccessLevelRepository extends JpaRepository<AccessLevel, String> {

	@Transactional
	@Modifying
	@Query(value = "select * from access_level where group_id = ?1 order by main_title_id,sub_title_id", nativeQuery = true)
	List<AccessLevel> findByGroupId(Integer groupId);

	@Transactional
	@Modifying
	@Query(value = "update access_level set is_close = ?1 ,is_read = ?2 , is_write = ?3 where access_level_id = ?4", nativeQuery = true)
	void updateAccessLevelById(boolean close, boolean read, boolean write, Integer AccessLevelId);

}
