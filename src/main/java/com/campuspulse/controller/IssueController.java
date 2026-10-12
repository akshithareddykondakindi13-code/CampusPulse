
package com.campuspulse.controller;

import com.campuspulse.entity.Issue;
import com.campuspulse.service.IssueService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/issues")
@CrossOrigin(origins = "http://localhost:5173")
public class IssueController {

    private final IssueService issueService;

    public IssueController(IssueService issueService) {
        this.issueService = issueService;
    }

    // Submit a complaint using the authenticated user's ID
    @PostMapping
    public ResponseEntity<Issue> createIssue(
            @RequestBody Issue issue,
            Authentication authentication) {

        if (authentication == null
                || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Long authenticatedUserId =
                issueService.getUserIdByEmail(authentication.getName());

        issue.setId(null);
        issue.setUserId(authenticatedUserId);

        Issue savedIssue = issueService.createIssue(issue);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedIssue);
    }

    // View all complaints - admin only
    @GetMapping
    public List<Issue> getAllIssues() {
        return issueService.getAllIssues();
    }

    // View an individual complaint - admin only
    @GetMapping("/{id}")
    public Issue getIssueById(@PathVariable Long id) {
        return issueService.getIssueById(id);
    }

    // Update complaint details - admin only
    @PutMapping("/{id}")
    public Issue updateIssue(
            @PathVariable Long id,
            @RequestBody Issue issue) {
        return issueService.updateIssue(id, issue);
    }

    // Update complaint status - admin only
    @PatchMapping("/{id}/status")
    public Issue updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        return issueService.updateStatus(id, request.get("status"));
    }

    // Delete a complaint - admin only
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIssue(@PathVariable Long id) {
        issueService.deleteIssue(id);
        return ResponseEntity.noContent().build();
    }

    // Students can view only their own complaints.
    // Admins can view complaints for any user.
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Issue>> getIssuesByUserId(
            @PathVariable Long userId,
            Authentication authentication) {

        if (authentication == null
                || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(authority ->
                        authority.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin) {
            Long authenticatedUserId =
                    issueService.getUserIdByEmail(authentication.getName());

            if (!authenticatedUserId.equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        }

        return ResponseEntity.ok(
                issueService.getIssuesByUserId(userId));
    }
}
