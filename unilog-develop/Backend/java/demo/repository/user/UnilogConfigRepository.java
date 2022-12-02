package demo.repository.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import demo.entity.user.UnilogConfig;

@Repository
public interface UnilogConfigRepository extends JpaRepository<UnilogConfig, String>{

	@Query(value = "select config from unilog_config where config_name = ?1", nativeQuery = true)
	String getConfigByName(String name);
}
