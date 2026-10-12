# CampusPulse — Frontend (React + Vite)

Standalone React frontend for the CampusPulse Campus Complaint Management System.
It talks only to your existing **Spring Boot + MySQL** backend. No Lovable, Supabase,
Firebase or other hosted service is used at runtime.

## Requirements
- Node.js 18+ and npm
- Java 21 + your Spring Boot backend
- MySQL 8 with the `campuspulse` database

## 1. Start the backend
1. Start MySQL and make sure the `campuspulse` database exists.
2. Open the Spring Boot project and run it (`mvn spring-boot:run` or the IDE Run button).
3. It must be reachable at `http://localhost:8080/api`.

## 2. Start the frontend
```bash
cd campuspulse-frontend
npm install
npm run dev
```
Open http://localhost:5173

## Changing the backend URL
Default is `http://localhost:8080/api` (in `src/services/api.js`).
To change it, copy `.env.example` to `.env` and edit `VITE_API_BASE_URL`, then restart `npm run dev`.

## How it works
| Screen | API call |
|---|---|
| Register | `POST /users/register` with `{ fullName, email, password }` |
| Login | `POST /users/login` with `{ email, password }` → stores returned `{ id, fullName, email, role }` |
| Student dashboard / My complaints | `GET /issues/user/{id}` using the logged-in user's real `id` |
| Report issue | `POST /issues` with `{ title, description, category, location, imageUrl, userId }` |
| Admin dashboard | `GET /issues` |
| Change status | `PATCH /issues/{id}/status` with `{ "status": "IN_PROGRESS" }` |
| Delete | `DELETE /issues/{id}` |

Users with `role: "ADMIN"` see the admin dashboard; everyone else sees the student screens.
The logged-in user is kept in sessionStorage so a page refresh doesn't log you out.

## Project structure
```
index.html
vite.config.js
src/main.jsx
src/App.jsx              – logged-in state + page switching
src/App.css              – all styles
src/services/api.js      – Axios instance, API functions, error handling
src/components/          – Login, Register, Navbar, StudentDashboard,
                           ReportIssue, MyComplaints, AdminDashboard, StatusBadge
```

## CORS (backend)
The backend must allow `http://localhost:5173`. If you don't already have it, add e.g.:
```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
  @Override public void addCorsMappings(CorsRegistry r) {
    r.addMapping("/api/**").allowedOrigins("http://localhost:5173")
     .allowedMethods("GET","POST","PUT","PATCH","DELETE","OPTIONS");
  }
}
```
Use only one CORS setup (don't mix this with `@CrossOrigin` that conflicts).

## Security note — remaining backend work
The admin screen is hidden from students in the frontend only. **That is not real security.**
Anyone can call `PATCH /issues/{id}/status` or `DELETE /issues/{id}` directly.
The login API returns no token, so the backend currently cannot know who is calling.
To secure it:
1. Return a token (e.g. JWT via Spring Security) from `/users/login`.
2. Require the token on every `/issues` request (the frontend would add an `Authorization` header in `src/services/api.js`).
3. Restrict `PATCH /issues/{id}/status` and `DELETE /issues/{id}` to `ADMIN` (e.g. `@PreAuthorize("hasRole('ADMIN')")`).
4. In `GET /issues/user/{userId}` and `POST /issues`, use the logged-in user from the token instead of trusting the `userId` sent by the browser.
5. Store passwords hashed (BCrypt) if not already.

## Assumptions to check against your backend
- Register body field names: `fullName`, `email`, `password`.
- The complaint date field is read from `createdAt` (also tries `submittedAt`, `createdDate`).
- There is no endpoint to create an admin; set `role = 'ADMIN'` for a user directly in MySQL.
