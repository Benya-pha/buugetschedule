# REG BUU integration notes

## Verified public entry points

- Public home: https://reg.buu.ac.th/registrar/home.asp
- Login page: https://reg.buu.ac.th/registrar/login.asp
- Student timetable page: https://reg.buu.ac.th/registrar/learn_time.asp

The public login page identifies student ID and password fields. It also links current students to BUU's MyID service for password recovery and password testing.

## Important implementation boundary

The public page inspection does not expose the actual form field names, hidden form values, POST target, authentication response, session cookie behavior, or the authenticated timetable response structure. These must be inspected from the live browser session before implementing authentication or parsing schedule data.

Do not guess:
- Form field names or POST parameters.
- Hidden ASP form values or anti-CSRF values.
- Authentication success/failure markers.
- Cookie names or session lifetime.
- Timetable query parameters or response schema.
- Course unique identifiers.

Do not store REG BUU credentials. Do not log credentials, request bodies, session cookies, or full upstream responses containing student information.

## Screenshot-confirmed page behavior

A user-provided screenshot confirms that the public login page visually presents a student ID field, a password field, and a button labeled “ตรวจสอบ”. A second user-provided screenshot confirms that, after login, the REG BUU student page displays student/course-program information, a weekly timetable grid, and a separate exam timetable section. These screenshots confirm the visible flow only; they do not reveal form field names, submission parameters, cookies, or machine-readable timetable markup.

## Safe form-inspection endpoint

`GET /api/reg-buu/inspect-login` fetches the public login page and returns only form action, method, and input name/id/type/autocomplete metadata. It deliberately omits input values, cookies, and the upstream HTML body. This endpoint is for integration inspection; it does not submit credentials or authenticate a student.

## Availability endpoint

`GET /api/reg-buu/status` performs a server-side, unauthenticated GET of the public REG BUU home page. It checks reachability only. It does not authenticate a student or retrieve timetable data.

## Required next inspection

Inspect the actual login form submission and an authenticated student's timetable response using a student-controlled browser session. Record only sanitized technical details and sample field names/structure; never share passwords, cookies, student ID, names, or actual timetable records publicly.

After this inspection, implement and test the server-side session flow and response validator against the observed REG BUU behavior.
