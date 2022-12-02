package demo.repository.watch;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import demo.entity.user.UniWatchGroup;

@Repository
public interface UniWatchGroupRepository extends JpaRepository<UniWatchGroup, String>{

	@Query(value = "select * from uni_watch_group where group_id = ?1 ", nativeQuery = true)
	public UniWatchGroup findByGroupId(String groupId);
	
	@Query(value = "select group_id, group_name, note from uni_watch_group group by group_id order by group_id", nativeQuery = true)
	public List<Object[]> findGroupList();
}
