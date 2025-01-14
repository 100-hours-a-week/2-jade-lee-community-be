CREATE TABLE users
(
    `user_id`     INT             NOT NULL    AUTO_INCREMENT,
    `email`       VARCHAR(100)    NOT NULL,
    `password`    VARCHAR(255)    NOT NULL,
    `image_url`   TEXT            NULL,
    `nickname`    VARCHAR(100)    NOT NULL,
    `created_at`  DATETIME        NOT NULL,
    `updated_at`  DATETIME        NULL,
    `is_deleted`  BOOLEAN         NOT NULL    DEFAULT FALSE,
    PRIMARY KEY (user_id)
);

CREATE TABLE posts
(
    `post_id`      INT             NOT NULL    AUTO_INCREMENT,
    `user_id`      INT             NOT NULL,
    `title`        VARCHAR(100)    NOT NULL,
    `contents`     TEXT            NOT NULL,
    `photo_url`    TEXT            NULL,
    `view_cnt`     INT             NOT NULL    DEFAULT 0,
    `like_cnt`     INT             NOT NULL    DEFAULT 0,
    `comment_cnt`  INT             NOT NULL    DEFAULT 0,
    `created_at`   DATETIME        NOT NULL,
    `updated_at`   DATETIME        NULL,
    `is_deleted`   BOOLEAN         NOT NULL    DEFAULT FALSE,
    PRIMARY KEY (post_id)
);

CREATE TABLE comments
(
    `comment_id`  INT         NOT NULL    AUTO_INCREMENT,
    `user_id`     INT         NOT NULL,
    `post_id`     INT         NOT NULL,
    `contents`    TEXT        NOT NULL,
    `created_at`  DATETIME    NOT NULL,
    `updated_at`  DATETIME    NULL,
    `is_deleted`  BOOLEAN     NOT NULL    DEFAULT FALSE,
    PRIMARY KEY (comment_id)
);
CREATE TABLE post_likes (
                            like_id INT NOT NULL AUTO_INCREMENT COMMENT '좋아요 ID',
                            user_id INT NOT NULL COMMENT '회원 참조 키',
                            post_id INT NOT NULL COMMENT '게시글 참조 키',
                            created_at DATETIME NOT NULL DEFAULT NOW() COMMENT '좋아요 등록 시간',
                            PRIMARY KEY (like_id),
                            UNIQUE (user_id, post_id), -- 같은 사용자와 게시글의 중복 좋아요 방지
                            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
                            FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE
);
ALTER TABLE posts
    ADD CONSTRAINT  FOREIGN KEY (user_id)
        REFERENCES users (user_id) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE comments
    ADD CONSTRAINT  FOREIGN KEY (user_id)
        REFERENCES users (user_id) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE comments
    ADD CONSTRAINT  FOREIGN KEY (post_id)
        REFERENCES posts (post_id) ON DELETE CASCADE ON UPDATE CASCADE;
