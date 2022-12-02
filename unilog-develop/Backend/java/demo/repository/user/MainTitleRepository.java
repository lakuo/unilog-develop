package demo.repository.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import demo.entity.user.MainTitle;

public interface MainTitleRepository extends JpaRepository<MainTitle, String> {

	@Query(value = "select main_title_name from main_title where main_title_id = ?1", nativeQuery = true)
	String getTitleNameByTitleId(Integer maintitleId);
}
