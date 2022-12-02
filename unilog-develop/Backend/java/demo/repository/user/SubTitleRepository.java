package demo.repository.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import demo.entity.user.SubTitle;

public interface SubTitleRepository extends JpaRepository<SubTitle, String> {
	
	@Query(value = "select sub_title_name from sub_title where sub_title_id = ?1", nativeQuery = true)
	String getTitleNameByTitleId(Integer subtitleId);
}
