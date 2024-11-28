import db from '../db.js'; 
const connectDB = await db();
async function getCommentByIdModel(comment_id) {
    const sql = `
        SELECT c.user_id
        FROM comments c
        WHERE c.comment_id = ?
    `;
    try {
        const [rows] = await connectDB.query(sql, [comment_id]); 
        if (rows.length === 0) {
            throw new Error('Comment not found');
        }
        return rows[0];
    } catch (error) {
        console.error('Error fetching comment:', error);
        throw error;
    }
}
async function addCommentModel(post_id, newComment) {
    const sql = `INSERT INTO comments (post_id, user_id, contents, created_at) VALUES (?, ?, ?, NOW())`;
    const params = [post_id, newComment.user_id, newComment.content];
    const [result] = await connectDB.query(sql, params);
    const updateSql = `UPDATE posts SET comment_cnt = comment_cnt + 1 WHERE post_id = ?`;
    await connectDB.query(updateSql, [post_id]);
    return result; 
}
async function editCommentModel(comment_id, content){
    const sql = `UPDATE comments SET contents = ?, updated_at = NOW() WHERE comment_id = ?`;
    const params = [content, comment_id];
    const [result] = await connectDB.query(sql, params);
    return result.changedRows; 
}
async function deleteCommentModel(post_id, comment_id){
    const sql = `UPDATE comments SET is_deleted = TRUE, updated_at = Now() WHERE comment_id = ?`;
    const params = [comment_id];
    const [result] = await connectDB.query(sql, params);
    if (result.affectedRows > 0) {
        const updateSql = `UPDATE posts SET comment_cnt = comment_cnt - 1 WHERE post_id = ?`;
        await connectDB.query(updateSql, [post_id]);
        return 1;
    }
    return 0;
}


export {
    getCommentByIdModel,
    addCommentModel,
    editCommentModel,
    deleteCommentModel
};