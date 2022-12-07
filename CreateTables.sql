-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema CourseWright
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema CourseWright
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `CourseWright` DEFAULT CHARACTER SET utf8 ;
-- -----------------------------------------------------
-- Schema coursewright
-- -----------------------------------------------------
USE `CourseWright` ;

DROP TABLE IF EXISTS CourseWright.active_user;

CREATE TABLE IF NOT EXISTS CourseWright.active_user (
    userId varchar(36) PRIMARY KEY,
    refreshToken varchar(500)
);

-- -----------------------------------------------------
-- Table `CourseWright`.`file`
-- -----------------------------------------------------

DROP TABLE IF EXISTS `CourseWright`.`file` ;

CREATE TABLE IF NOT EXISTS `CourseWright`.`file` (
  `id` VARCHAR(36) NOT NULL,
  `path` VARCHAR(36) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `extension` VARCHAR(35) NOT NULL,
  `type` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `path_UNIQUE` (`path` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `CourseWright`.`course`
-- -----------------------------------------------------
DROP TABLE IF EXISTS CourseWright.course ;

CREATE TABLE IF NOT EXISTS CourseWright.course (
  `id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(150) NULL,
  `course_code` VARCHAR(12) NOT NULL,
  `affiliation` VARCHAR(36) NULL,
  `active` BOOLEAN NOT NULL DEFAULT FALSE,
  `subject` VARCHAR(50) NOT NULL,
  `license` VARCHAR(75) NULL,
  `visibility` VARCHAR(10) NOT NULL DEFAULT 'private',
  `date_created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `last_modified` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (affiliation) REFERENCES organization (id),
  UNIQUE INDEX `course_id_UNIQUE` (`id` ASC) VISIBLE)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `CourseWright`.`course`
-- -----------------------------------------------------
DROP TABLE IF EXISTS CourseWright.course ;

CREATE TABLE IF NOT EXISTS CourseWright.course (
    creator VARCHAR(36) NOT NULL,
    published BOOLEAN NOT NULL DEFAULT FALSE,
  `id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(150) NULL,
  `course_code` VARCHAR(12) NOT NULL,
  `affiliation` VARCHAR(36) NULL,
  `active` BOOLEAN NOT NULL DEFAULT FALSE,
  `subject` VARCHAR(50) NOT NULL,
  `license` VARCHAR(75) NULL,
  `visibility` VARCHAR(10) NOT NULL DEFAULT 'private',
  `date_created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `last_modified` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (creator) REFERENCES account (id),
  FOREIGN KEY (affiliation) REFERENCES organization (id),
  UNIQUE INDEX `course_id_UNIQUE` (`id` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `CourseWright`.`directory`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `CourseWright`.`directory` ;

CREATE TABLE IF NOT EXISTS `CourseWright`.`directory` (
  `id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(75) NOT NULL,
  `course_id` VARCHAR(36) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  CONSTRAINT `course_id`
    FOREIGN KEY (`course_id`)
    REFERENCES `CourseWright`.`course` (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `CourseWright`.`page`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `CourseWright`.`page` ;

CREATE TABLE IF NOT EXISTS `CourseWright`.`page` (
  `id` VARCHAR(36) NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  `directory_id` VARCHAR(36) NOT NULL,
  PRIMARY KEY (`id`, `directory_id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `directory_idx` (`directory_id` ASC) VISIBLE,
  CONSTRAINT `directory`
    FOREIGN KEY (`directory_id`)
    REFERENCES `CourseWright`.`directory` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `CourseWright`.`account`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `CourseWright`.account ;

CREATE TABLE IF NOT EXISTS `CourseWright`.account (
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(200) DEFAULT NULL,
  `date_created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `id` VARCHAR(36) NOT NULL,
  `type` VARCHAR(45) NOT NULL,
  `first_name` VARCHAR(75) NOT NULL,
  `last_name` VARCHAR(75) NOT NULL,
  `title` VARCHAR(30) DEFAULT NULL,
  `home_page_id` VARCHAR(36),
  `photo_id` VARCHAR(36),
  temp_account BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (`id`, `email`),
  UNIQUE INDEX `account_id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
  INDEX `photo_idx` (`photo_id` ASC) VISIBLE,
  INDEX `homepage_idx` (`home_page_id` ASC) VISIBLE,
  CONSTRAINT `account_has_photo`
    FOREIGN KEY (`photo_id`)
    REFERENCES `CourseWright`.`file` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `account_has_homepage`
    FOREIGN KEY (`home_page_id`)
    REFERENCES `CourseWright`.`page` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `CourseWright`.`organization`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `CourseWright`.`organization` ;

CREATE TABLE IF NOT EXISTS `CourseWright`.`organization` (
  `id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `username` VARCHAR(75) NOT NULL,
  `mission_statement` TEXT NULL,
  `verified` TINYINT NOT NULL,
  `organizationcol` VARCHAR(45) NULL,
  `date_created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `page_id` VARCHAR(36) NOT NULL,
  PRIMARY KEY (`id`, `username`, `page_id`),
  UNIQUE INDEX `organization_id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE,
  INDEX `organization_has_page_idx` (`page_id` ASC) VISIBLE,
  CONSTRAINT `organization_has_page`
    FOREIGN KEY (`page_id`)
    REFERENCES `CourseWright`.`page` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `CourseWright`.`cell`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `CourseWright`.`cell` ;

CREATE TABLE IF NOT EXISTS `CourseWright`.`cell` (
  `index` INT NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  `id` VARCHAR(36) NOT NULL,
  `page_id` VARCHAR(36) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  CONSTRAINT `cell_has_page`
    FOREIGN KEY (`page_id`)
    REFERENCES `CourseWright`.`page` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `CourseWright`.`private_course`
-- -----------------------------------------------------
DROP TABLE IF EXISTS CourseWright.private_course ;

CREATE TABLE IF NOT EXISTS CourseWright.private_course (
  `id` VARCHAR(36) NOT NULL,
  `color` VARCHAR(45) NULL,
  `course_id` VARCHAR(36) NOT NULL,
  `active` BOOLEAN NOT NULL DEFAULT FALSE,
  enroll_using_link BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (`id`, `course_id`),
  INDEX `borrows_course_idx` (`course_id` ASC) VISIBLE,
  CONSTRAINT `borrows_course`
    FOREIGN KEY (`course_id`)
    REFERENCES `CourseWright`.`course` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `CourseWright`.`annotation`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `CourseWright`.`annotation` ;

CREATE TABLE IF NOT EXISTS `CourseWright`.`annotation` (
  `id` VARCHAR(36) NOT NULL,
  `private_course_id` VARCHAR(36) NOT NULL,
  `color` VARCHAR(20) NULL,
  `VARCHAR(36)` VARCHAR(45) NULL,
  `account_id` VARCHAR(36) NOT NULL,
  `cell_id` VARCHAR(36) NOT NULL,
  PRIMARY KEY (`id`, `account_id`, `cell_id`, `private_course_id`),
  INDEX `using_account_idx` (`account_id` ASC) VISIBLE,
  INDEX `has_private_course_idx` (`private_course_id` ASC) VISIBLE,
  INDEX `on_cell_idx` (`cell_id` ASC) VISIBLE,
  CONSTRAINT `using_account`
    FOREIGN KEY (`account_id`)
    REFERENCES `CourseWright`.`account` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `on_cell`
    FOREIGN KEY (`cell_id`)
    REFERENCES `CourseWright`.`cell` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `has_private_course`
    FOREIGN KEY (`private_course_id`)
    REFERENCES `CourseWright`.`private_course` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `CourseWright`.`assignment`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `CourseWright`.`assignment` ;

CREATE TABLE IF NOT EXISTS `CourseWright`.`assignment` (
  `id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(75) NOT NULL,
  `description` TEXT NULL,
  `page_id` VARCHAR(36) NOT NULL,
  `ansker_key_id` VARCHAR(36) NOT NULL,
  `print_out_id` VARCHAR(36) NOT NULL,
  PRIMARY KEY (`id`, `page_id`, `ansker_key_id`, `print_out_id`),
  INDEX `answer_key_id_idx` (`ansker_key_id` ASC) VISIBLE,
  INDEX `print_out_id_idx` (`print_out_id` ASC) VISIBLE,
  CONSTRAINT `assignment_has_page`
    FOREIGN KEY (`page_id`)
    REFERENCES `CourseWright`.`page` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `assignment_has_answer_key`
    FOREIGN KEY (`ansker_key_id`)
    REFERENCES `CourseWright`.`file` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `assignment_has_printout`
    FOREIGN KEY (`print_out_id`)
    REFERENCES `CourseWright`.`file` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `CourseWright`.`grade`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `CourseWright`.`grade` ;

CREATE TABLE IF NOT EXISTS `CourseWright`.`grade` (
  `assignment_id` VARCHAR(36) NOT NULL,
  `private_course_id` VARCHAR(36) NOT NULL,
  `id` VARCHAR(36) NOT NULL,
  `account_id` VARCHAR(36) NOT NULL,
  PRIMARY KEY (`id`, `assignment_id`, `private_course_id`, `account_id`),
  UNIQUE INDEX `grade_id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `assignment_id_idx` (`assignment_id` ASC) VISIBLE,
  INDEX `private_course_id_idx` (`private_course_id` ASC) VISIBLE,
  UNIQUE INDEX `account_id_UNIQUE` (`account_id` ASC) VISIBLE,
  CONSTRAINT `assignment_id`
    FOREIGN KEY (`assignment_id`)
    REFERENCES `CourseWright`.`assignment` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `account_id`
    FOREIGN KEY (`account_id`)
    REFERENCES `CourseWright`.`account` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `private_course_id`
    FOREIGN KEY (`private_course_id`)
    REFERENCES `CourseWright`.`private_course` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `CourseWright`.`membership`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `CourseWright`.`membership` ;

CREATE TABLE IF NOT EXISTS `CourseWright`.`membership` (
  `account_id` VARCHAR(36) NOT NULL,
  `organization_id` VARCHAR(36) NOT NULL,
  `role` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`account_id`, `organization_id`),
  INDEX `fk_account_has_organization_organization1_idx` (`organization_id` ASC) VISIBLE,
  INDEX `fk_account_has_organization_account_idx` (`account_id` ASC) VISIBLE,
  CONSTRAINT `organization_has_account`
    FOREIGN KEY (`account_id`)
    REFERENCES `CourseWright`.`account` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `account_in_organization`
    FOREIGN KEY (`organization_id`)
    REFERENCES `CourseWright`.`organization` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `CourseWright`.`endorsement`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `CourseWright`.`endorsement` ;

CREATE TABLE IF NOT EXISTS `CourseWright`.`endorsement` (
  `course_id` VARCHAR(36) NOT NULL,
  `organization_id` VARCHAR(36) NOT NULL,
  PRIMARY KEY (`organization_id`, `course_id`),
  INDEX `fk_course_has_organization_organization1_idx` (`organization_id` ASC) VISIBLE,
  INDEX `fk_course_has_organization_course1_idx` (`course_id` ASC) VISIBLE,
  CONSTRAINT `fk_course_has_organization_course1`
    FOREIGN KEY (`course_id`)
    REFERENCES `CourseWright`.`course` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_course_has_organization_organization1`
    FOREIGN KEY (`organization_id`)
    REFERENCES `CourseWright`.`organization` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `CourseWright`.`resource`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `CourseWright`.`resource` ;

CREATE TABLE IF NOT EXISTS `CourseWright`.`resource` (
  `preview` TINYINT NOT NULL DEFAULT 0,
  `cell_id` VARCHAR(36) NOT NULL,
  `file_id` VARCHAR(36) NOT NULL,
  PRIMARY KEY (`cell_id`, `file_id`),
  INDEX `file_id_idx` (`file_id` ASC) VISIBLE,
  CONSTRAINT `cell_id`
    FOREIGN KEY (`cell_id`)
    REFERENCES `CourseWright`.`cell` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `file_id`
    FOREIGN KEY (`file_id`)
    REFERENCES `CourseWright`.`file` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `CourseWright`.`text`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `CourseWright`.`text` ;

CREATE TABLE IF NOT EXISTS `CourseWright`.`text` (
  `text_type` VARCHAR(50) NOT NULL,
  `text` TEXT NOT NULL,
  `cell_id` VARCHAR(36) NOT NULL,
  PRIMARY KEY (`cell_id`),
  CONSTRAINT `text_has_cell`
    FOREIGN KEY (`cell_id`)
    REFERENCES `CourseWright`.`cell` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `CourseWright`.`video`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `CourseWright`.`video` ;

CREATE TABLE IF NOT EXISTS `CourseWright`.`video` (
  `title` VARCHAR(200) NULL,
  `description` TEXT NULL,
  `src` VARCHAR(200) NOT NULL,
  `video_type` VARCHAR(45) NOT NULL,
  `cell_id` VARCHAR(36) NOT NULL,
  PRIMARY KEY (`cell_id`),
  CONSTRAINT `video_has_cell`
    FOREIGN KEY (`cell_id`)
    REFERENCES `CourseWright`.`cell` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `CourseWright`.`affiliation_request`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `CourseWright`.`affiliation_request` ;

CREATE TABLE IF NOT EXISTS `CourseWright`.`affiliation_request` (
  `status` VARCHAR(50) NOT NULL,
  `id` VARCHAR(36) NOT NULL,
  `date_created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `affiliation_requestcol` VARCHAR(45) NULL,
  `course_id` VARCHAR(36) NOT NULL,
  `account_id` VARCHAR(36) NOT NULL,
  `organization_id` VARCHAR(36) NOT NULL,
  PRIMARY KEY (`id`, `course_id`, `organization_id`, `account_id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `course_id_idx` (`course_id` ASC) VISIBLE,
  INDEX `account_id_idx` (`account_id` ASC) VISIBLE,
  INDEX `organization_id_idx` (`organization_id` ASC) VISIBLE,
  CONSTRAINT `affiliate_with_course`
    FOREIGN KEY (`course_id`)
    REFERENCES `CourseWright`.`course` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `account_requests_affiliation`
    FOREIGN KEY (`account_id`)
    REFERENCES `CourseWright`.`account` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `affiliation_with_organization`
    FOREIGN KEY (`organization_id`)
    REFERENCES `CourseWright`.`organization` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `CourseWright`.`contribution`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `CourseWright`.`contribution` ;

CREATE TABLE IF NOT EXISTS `CourseWright`.`contribution` (
  `account_id` VARCHAR(36) NOT NULL,
  `course_id` VARCHAR(36) NOT NULL,
  `contribution` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`account_id`, `course_id`),
  INDEX `fk_account_has_course_course1_idx` (`course_id` ASC) VISIBLE,
  INDEX `fk_account_has_course_account1_idx` (`account_id` ASC) VISIBLE,
  CONSTRAINT `fk_account_has_course_account1`
    FOREIGN KEY (`account_id`)
    REFERENCES `CourseWright`.`account` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_account_has_course_course1`
    FOREIGN KEY (`course_id`)
    REFERENCES `CourseWright`.`course` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `CourseWright`.`enrollment`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `CourseWright`.`enrollment` ;

CREATE TABLE IF NOT EXISTS `CourseWright`.`enrollment` (
  `account_id` VARCHAR(36) NOT NULL,
  `private_course_id` VARCHAR(36) NOT NULL,
  `role` INT NOT NULL,
  `status` VARCHAR(36) NOT NULL,
  PRIMARY KEY (`account_id`, `private_course_id`),
  INDEX `account_in_course` (`private_course_id` ASC) VISIBLE,
  INDEX `course_has_account` (`account_id` ASC) VISIBLE,
  CONSTRAINT `fk_account_has_private_course_account1`
    FOREIGN KEY (`account_id`)
    REFERENCES `CourseWright`.`account` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_account_has_private_course_private_course1`
    FOREIGN KEY (`private_course_id`)
    REFERENCES `CourseWright`.`private_course` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `CourseWright`.`course_tag`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `CourseWright`.`course_tag` ;

CREATE TABLE IF NOT EXISTS `CourseWright`.`course_tag` (
  `course_id` VARCHAR(36) NOT NULL,
  `tag_name` VARCHAR(75) NOT NULL,
  CONSTRAINT `tag_in_course`
    FOREIGN KEY (`course_id`)
    REFERENCES `CourseWright`.`course` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

DROP TABLE IF EXISTS CourseWright.course_editor;

CREATE TABLE IF NOT EXISTS CourseWright.course_editor (
    course_id VARCHAR(36) NOT NULL,
    account_id VARCHAR(36) NOT NULL,
    `role` INT NOT NULL,
    FOREIGN KEY (course_id) REFERENCES course (id),
    FOREIGN KEY (account_id) REFERENCES account (id)
) ENGINE = InnoDB;

DROP TABLE IF EXISTS CourseWright.temporary_account_claim;

CREATE TABLE IF NOT EXISTS CourseWright.course_editor (
    temporary_account_id VARCHAR(36) NOT NULL,
    `status` VARCHAR(36) NOT NULL DEFAULT 'unclaimed',
    claimed_account_id VARCHAR(36) NOT NULL,
    verification_account_id VARCHAR(36) DEFAULT NULL,
    FOREIGN KEY (temporary_account_id) REFERENCES account (id),
    FOREIGN KEY (claimed_account_id) REFERENCES account (id),
    FOREIGN KEY (verification_account_id) REFERENCES account (id)
) ENGINE = InnoDB;

