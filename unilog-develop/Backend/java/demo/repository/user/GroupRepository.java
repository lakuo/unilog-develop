package demo.repository.user;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import demo.entity.user.GroupInfo;

public interface GroupRepository extends JpaRepository<GroupInfo, String> {
	
	List<GroupInfo> findAll();
	
	public GroupInfo findByGroupId(String groupId);

	@Query(value = "select groupcnname from group_info where group_id = ?1", nativeQuery = true)
	String findGroupCNNameByGroupId(Integer group_id);
}
