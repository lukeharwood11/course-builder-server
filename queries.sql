-- Course
# id` VARCHAR(36) NOT NULL,
#   `name` VARCHAR(150) NULL,
#   `course_code` VARCHAR(12) NOT NULL,
#   `affiliation` VARCHAR(36) NOT NULL,
#   `active` BOOLEAN NOT NULL DEFAULT FALSE,
#   `subject` VARCHAR(50) NOT NULL,
#   `license` VARCHAR(75) NULL,
#   `visibility` VARCHAR(10) NOT NULL DEFAULT 'private',

-- create a new course
INSERT INTO course (id, creator, `name`, `course_code`, `subject`)
VALUES (?, ?, ?, ?, ?);

INSERT INTO course_editor (course_id, account_id, `role`)
VALUES (?, ?, 1010);

INSERT INTO private_course (id, color, course_id)
VALUES (?, NULL, ?);

INSERT INTO enrollment (account_id, private_course_id, `role`)
VALUES (?, ?, 1010);

INSERT INTO course_tag (course_id, tag_name)
VALUES (?, ?);


# roles:
#     'creator': 1010,
#     'teacher': 2020,
#     'observer': 3030,
#     'student': 4040

-- update a course

-- first check to see if they have permissions to update a course
SELECT
    *
FROM
    course_editor ce,
    course c,
    `account` a
WHERE
    a.id = ? and
    c.id = ? and
    a.id = ce.account_id and
    c.id = ce.course_id and
    ce.role = 1010 or ce.role = 1011;



UPDATE course
SET name = ?, course_code = ?, subject = ?
WHERE id = ?;

-- add/remove a tag
# first delete all tags and add the new ones
DELETE FROM course_tag
WHERE course_id = ?;

INSERT INTO course_tag (course_id, tag_name)
VALUES (?, ?);


-- get all private courses you're enrolled in
SELECT
    'pc' as type,
    e.status                   as status,
    e.role                     as role,
    c.id                       as id,
    pc.id                      as pcId,
    c.visibility               as visibility,
    c.published                as published,
    pc.active                  as active,
    c.affiliation              as affiliation,
    c.subject                  as subject,
    c.course_code              as code,
    c.license                  as license,
    c.name                     as name,
    c.date_created             as dateCreated,
    c.last_modified            as lastModified,
    JSON_ARRAYAGG(ct.tag_name) as tags,
    enrolled.accounts          as accounts
 FROM account a
          INNER JOIN enrollment e on a.id = e.account_id
          INNER JOIN private_course pc on e.private_course_id = pc.id
          INNER JOIN course c on pc.course_id = c.id
          LEFT JOIN course_tag ct on c.id = ct.course_id
          INNER JOIN (
              SELECT
                  JSON_ARRAYAGG(JSON_OBJECT(
                      'firstName', a.first_name,
                      'lastName', a.last_name,
                      'email', a.email,
                      'role', e.role
                      )) as accounts,
            pc.id as id
        FROM
            private_course pc,
            enrollment e,
            `account` a
        WHERE
            pc.id = e.private_course_id and
            a.id = e.account_id
        GROUP BY pc.id
         ) as enrolled on enrolled.id = pc.id
 WHERE a.id = ?
 GROUP BY pc.id;

select * from private_course INNER JOIN course c on private_course.course_id = c.id;

-- get all accounts enrolled in a private course
SELECT
    a.first_name as firstName,
    a.last_name as lastName,
    a.email as email,
    a.id as accountId,
    e.role as role
FROM
    private_course pc,
    enrollment e,
    `account` a
WHERE
    pc.id = ? and
    pc.id = e.private_course_id and
    a.id = e.account_id;

-- delete a course permanently
DELETE FROM enrollment WHERE private_course_id = ?;

-- get all courses you have access to
SELECT
    'c' as type,
    e.role                     as role,
    c.id                       as id,
    c.visibility               as visibility,
    c.published                as published,
    c.affiliation              as affiliation,
    c.subject                  as subject,
    c.course_code              as code,
    c.license                  as license,
    c.name                     as name,
    c.date_created             as dateCreated,
    c.last_modified            as lastModified,
    JSON_ARRAYAGG(ct.tag_name) as tags,
    editing.accounts           as creators
 FROM account a
          INNER JOIN course_editor e on a.id = e.account_id
          INNER JOIN course c on c.id = e.course_id
          LEFT JOIN course_tag ct on c.id = ct.course_id
          INNER JOIN (
              SELECT
                  JSON_ARRAYAGG(JSON_OBJECT(
                      'firstName', a.first_name,
                      'lastName', a.last_name,
                      'email', a.email,
                      'role', ce.role
                      )) as accounts,
            c.id as id
        FROM
            course c,
            course_editor ce,
            `account` a
        WHERE
            c.id = ce.course_id and
            a.id = ce.account_id
        GROUP BY c.id
         ) as editing on editing.id = c.id
 WHERE a.id = ?
 GROUP BY c.id;

-- update course to show as published (or not)
UPDATE course SET published = ? where course.id = ?;

-- find courses matching name

SELECT
    c.subject as subject,
    c.course_code as code,
    c.last_modified as lastModified,
    c.date_created as dateCreated,
    a.first_name as firstName,
    a.last_name as lastName,
    a.email as email,
    a.home_page_id as homePageId,
    c.license as license,
    c.name as name,
    c.affiliation as affiliation,
    c.id as id,
    c.license as license,
    c.visibility as visibility,
    JSON_ARRAYAGG(ct.tag_name) as tags
FROM course c, enrollment e
INNER JOIN account a on c.creator = a.id
LEFT JOIN
    course_tag ct on c.id = ct.course_id
WHERE
    (c.course_code like ? or c.name like ?) and
    c.published = true and
    (c.visibility = 'public' or a.id = ?)
GROUP BY c.id;


-- enroll a teacher in the course as a creator

-- first create a section in the course
INSERT INTO
    private_course (id, course_id, color)
VALUES
    (?, ?, 'none');

INSERT INTO enrollment
    (account_id, private_course_id, `role`, `status`)
VALUES
    (?, ?, 200, 'accepted');


-- enroll a teacher in the course, with admin access
INSERT INTO enrollment
    (account_id, private_course_id, `role`, `status`)
VALUES
    (?, ?, 201, 'pending');

-- enroll a teacher in the course
INSERT INTO enrollment
    (account_id, private_course_id, `role`, `status`)
VALUES
    (?, ?, 202, 'pending');

-- enroll a student in the course
INSERT INTO enrollment
    (account_id, private_course_id, `role`, `status`)
VALUES
    (?, ?, 202, 'pending');


-- accept a role in a section
UPDATE enrollment SET `role` = 'accepted'
WHERE account_id = ? and private_course_id = ?;


SELECT * FROM course where id = ? and published = true;

-- check to see if a user has permissions to add users to the course
SELECT * FROM enrollment where private_course_id = ? and account_id = ? and (role = 20 or role = 21);
-- link check
SELECT * FROM private_course where id = ? and enroll_using_link = true;

SELECT email, id, type, first_name as firstName, last_name as LastName FROM account where email LIKE ?;

INSERT INTO account (email, id, first_name, last_name, type, temp_account) VALUES (?, ?, ?, ?, 'student', TRUE);

-- check to see if an account is already in the course
SELECT * FROM enrollment WHERE account_id = ? and private_course_id = ?;

-- check to see if account has permissions to view
SELECT * FROM course_editor ce, course c where ce.course_id = ? and ce.course_id = c.id and ((c.published and c.visibility = 'public') or ce.account_id = ?);

-- get all cells from a given page
SELECT
    p.id as id,
    p.`index` as pageIndex,
    p.directory_id as directoryId,
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'index', c.index,
            'type', c.type,
            'pageId', c.page_id,
            'textType', t.text_type,
            'text', t.text,
            'preview', r.preview,
            'fileId', r.file_id,
            'title', v.title,
            'description', v.description,
            'videoType', v.video_type,
            'src', v.src
            )
        )
FROM page p
INNER JOIN cell c on p.id = c.page_id
LEFT JOIN text t on c.id = t.cell_id
LEFT JOIN resource r on c.id = r.cell_id
LEFT JOIN video v on c.id = v.cell_id
WHERE p.id = ?
GROUP BY p.id;
