    % Facts
    % The facts include the attendance of each student for each date, as well as information about groups, courses, tardiness, and penalties for insufficient attendance.

    % Registered students
    student(id, name).

    % Attendance of each student on a specific date
    attendance( id, enrollment_id, schedule_id, date, arrival_time, departure_time).

    % Course
    course(id, name, description).

    % Schedule
    schedule( id, name, course_id,professor_id, day_of_week, start_time, schedule.end_time).

    % Career
    career( id, name, description).

    % Professor
    professor(id,name,email).

    % enrollment
    enrollment( id, student_id, course_id, enrollment_date).

    % Total school days
    total_school_days(10).

    % Groups and courses
    course(id, name, start_time, end_time).

    % Tardiness records
    absent(student_id, date).

    % Definition of the grace period for tardiness
    grace_period(15). % Tardiness occurs if the student arrives 15 minutes late or more.

    % Acceptable attendance percentage
    grace_rate_attendance(80). % A student must have at least 80% attendance.

    % Day with the most absences per student
    absent_day_student(student_id, day, count).
    % This fact can be calculated dynamically.

    % Rules

    % 1. Check if a student was present on a specific date

    % 2. Query the list of students present on a specific date

    % 3. Query the attendance of a student on all dates

    % 4. Count the number of attendances for a student

    % 5. Calculate the attendance percentage of a student

    % 6. Determine if a student meets the acceptable attendance threshold

    % 7. List students who were late on a specific date

    % 8. Determine the day with the most absences for a student