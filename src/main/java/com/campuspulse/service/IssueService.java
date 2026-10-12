
package com.campuspulse.service;

import com.campuspulse.entity.Issue;
import com.campuspulse.entity.User;
import com.campuspulse.repository.IssueRepository;
import com.campuspulse.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IssueService {

    private final IssueRepository issueRepository;
    private final UserRepository userRepository;

    public IssueService(
            IssueRepository issueRepository,
            UserRepository userRepository) {
        this.issueRepository = issueRepository;
        this.userRepository = userRepository;
    }

    // Get the database ID of the authenticated user
    public Long getUserIdByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Authenticated user not found"));

        return user.getId();
    }

    // Submit a new campus issue
    public Issue createIssue(Issue issue) {
        issue.setId(null);
        issue.setStatus("PENDING");
        return issueRepository.save(issue);
    }

    // Get all campus issues
    public List<Issue> getAllIssues() {
        return issueRepository.findAll();
    }

    // Get an issue by its ID
    public Issue getIssueById(Long id) {
        return issueRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Issue not found with ID: " + id));
    }

    // Update issue details
    public Issue updateIssue(Long id, Issue updatedIssue) {
        Issue existingIssue = getIssueById(id);

        existingIssue.setTitle(updatedIssue.getTitle());
        existingIssue.setDescription(updatedIssue.getDescription());
        existingIssue.setCategory(updatedIssue.getCategory());
        existingIssue.setLocation(updatedIssue.getLocation());
        existingIssue.setImageUrl(updatedIssue.getImageUrl());

        return issueRepository.save(existingIssue);
    }

    // Update issue status
    public Issue updateStatus(Long id, String status) {
        Issue issue = getIssueById(id);

        if (status == null ||
                !List.of("PENDING", "IN_PROGRESS", "RESOLVED")
                        .contains(status)) {
            throw new IllegalArgumentException(
                    "Invalid issue status");
        }

        issue.setStatus(status);
        return issueRepository.save(issue);
    }

    // Get issues belonging to a specific user
    public List<Issue> getIssuesByUserId(Long userId) {
        return issueRepository.findByUserId(userId);
    }

    // Delete an issue
    public void deleteIssue(Long id) {
        Issue issue = getIssueById(id);
        issueRepository.delete(issue);
    }
}
