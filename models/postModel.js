import db from '../db.js';
const connectDB = await db();
async function getAllPostsModel() {
    const sql = `
        SELECT p.*, u.nickname, u.email, u.image_url 
        FROM posts p
        JOIN users u ON p.user_id = u.user_id
        WHERE p.is_deleted = FALSE AND u.is_deleted = FALSE
        ORDER BY p.created_at DESC
    `;
    const [rows] = await connectDB.query(sql);
    return rows;
}

async function createPostModel(newPost) {
    const { title, content, postImage, user_id } = newPost;
    const sql = `
        INSERT INTO posts (title, contents, photo_url, user_id, created_at) 
        VALUES (?, ?, ?, ?, NOW())
    `;
    await connectDB.query(sql, [title, content, postImage, user_id]);
}
async function getPostAuth(postId){
    const sql = `SELECT user_id FROM posts WHERE post_id = ?`;
    const [post] = await connectDB.query(sql, [postId]);
    return post[0];
}
async function getPostByIdModel(postId) {
    const sql = `
        SELECT p.*, u.nickname AS author_nickname, u.image_url AS author_image_url
        FROM posts p
        JOIN users u ON p.user_id = u.user_id
        WHERE p.post_id = ? AND p.is_deleted = FALSE
    `;
    const [post] = await connectDB.query(sql, [postId]);
    if (post.length === 0) {
        return null;
    }
    const commentSql = `
        SELECT c.user_id, c.comment_id, c.contents, c.created_at, cu.nickname AS commenter_nickname, cu.image_url AS commenter_image_url
        FROM comments c
        JOIN users cu ON c.user_id = cu.user_id
        WHERE c.post_id = ? AND c.is_deleted = FALSE AND cu.is_deleted = FALSE
    `;
    const [commentRows] = await connectDB.query(commentSql, [postId]);
    return {
        post_id: post[0].post_id,
        title: post[0].title,
        postImage: post[0].photo_url,
        content: post[0].contents,
        like_cnt: post[0].like_cnt,
        comment_cnt: post[0].comment_cnt,
        view_cnt: post[0].view_cnt,
        author: {
            user_id: post[0].user_id,
            nickname: post[0].author_nickname,
            profileImage: post[0].author_image_url
        },
        created_at: post[0].created_at,
        comments: commentRows.map(comment => ({
            comment_id: comment.comment_id,
            content: comment.contents,
            author: {
                user_id: comment.user_id,
                nickname: comment.commenter_nickname,
                profileImage: comment.commenter_image_url
            },
            created_at: comment.created_at
        }))
    };
}
async function viewCountModel(postId) {
    const updateSql = `
    UPDATE posts 
    SET view_cnt = view_cnt + 1
    WHERE post_id = ? AND is_deleted = FALSE
    `;
    await connectDB.query(updateSql, [postId]);
}
async function updatePostModel(postId, title, content, postImage, imageFlag) {
    let sql = 'UPDATE posts SET title = ?, contents = ?, updated_at = Now()';
    const values = [title, content];
    if (imageFlag == 1) {
        sql += ', photo_url = ?';
        values.push(postImage);
    }
    sql += ' WHERE post_id = ?';
    values.push(postId);
    const [result] = await connectDB.query(sql, values);
    return result.affectedRows > 0;
}

async function likePostModel(postId, userId) {
    const connection = await db();

    // 1. 사용자의 좋아요 상태 확인
    const checkSql = `
        SELECT 1 
        FROM post_likes 
        WHERE post_id = ? AND user_id = ?
    `;
    const [rows] = await connection.query(checkSql, [postId, userId]);

    if (rows.length > 0) {
        // 이미 좋아요 상태 -> 좋아요 취소
        const deleteLikeSql = `
            DELETE FROM post_likes 
            WHERE post_id = ? AND user_id = ?
        `;
        await connection.query(deleteLikeSql, [postId, userId]);
        const decrementLikeCntSql = `
            UPDATE posts 
            SET like_cnt = like_cnt - 1 
            WHERE post_id = ?
        `;
        await connection.query(decrementLikeCntSql, [postId]);
        return { message: "like_removed" };
    } else {
        // 좋아요 상태가 아님 -> 좋아요 추가
        const insertLikeSql = `
            INSERT INTO post_likes (post_id, user_id) 
            VALUES (?, ?)
        `;
        await connection.query(insertLikeSql, [postId, userId]);
        const incrementLikeCntSql = `
            UPDATE posts 
            SET like_cnt = like_cnt + 1 
            WHERE post_id = ?
        `;
        await connection.query(incrementLikeCntSql, [postId]);
        return { message: "like_added" };
    }
}

async function deletePostModel(postId) {
    const sql = 'UPDATE posts SET is_deleted = TRUE, updated_at = Now() WHERE post_id = ?';
    const [result] = await connectDB.query(sql, [postId]);
    return result.affectedRows > 0;
}
async function checkUserLikeStatus(postId, userId) {
    const connection = await db();
    const sql = `
        SELECT 1 
        FROM post_likes 
        WHERE post_id = ? AND user_id = ?
    `;
    const [rows] = await connection.query(sql, [postId, userId]);
    return rows.length > 0; // 좋아요가 존재하면 true
}
export {
    getPostAuth,
    getAllPostsModel,
    createPostModel,
    getPostByIdModel,
    updatePostModel,
    deletePostModel,
    likePostModel,
    viewCountModel,
    checkUserLikeStatus
};