package demo.repository.watch;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import demo.entity.user.UniWatchData;

@Repository
public interface UniWatchDataRepository extends JpaRepository<UniWatchData, String>{

	@Query(value = "select pid from uni_watch_data where ip = ?1", nativeQuery = true)
	List<String> findByIp(String ip);
	
	@Query(value = "select ip from uni_watch_data group by ip", nativeQuery = true)
	List<String> findWatchIpList();
	
	@Query(value = "select * from uni_watch_data where ip in (?1)", nativeQuery = true)
	List<UniWatchData> findWatchIpByGroupId(String[] ip);
}
