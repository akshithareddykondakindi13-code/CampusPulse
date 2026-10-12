
package com.campuspulse.repository;
import java.util.List;
import com.campuspulse.entity.Issue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;




@Repository
public interface IssueRepository extends JpaRepository<Issue, Long> {
	List<Issue> findByUserId(Long userId);
}
