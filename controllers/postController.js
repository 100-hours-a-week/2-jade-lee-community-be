import {
    getAllPostsModel,
    createPostModel,
    getPostByIdModel,
    updatePostModel,
    deletePostModel,
    likePostModel,
    viewCountModel
} from '../models/postModel.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let userHasLiked = false; // 좋아요 상태 관리
const loadPosts = async (req, res) => {
    try {
        const posts = await getAllPostsModel();
        res.status(200).json({
            message: "posts_list_success",
            data: {
                posts: posts.map(post => ({
                    post_id: post.post_id,
                    title: post.title,
                    content: post.content,
                    like_cnt: post.like_cnt,
                    comment_cnt: post.comment_cnt,
                    view_cnt: post.view_cnt,
                    author: {
                        user_id: post.user_id,
                        nickname: post.nickname,
                        image_url: post.image_url
                    },
                    created_at: post.created_at
                }))
            }
        });
    } catch (error) {
        console.error("게시글 로드 오류:", error);
        res.status(500).json({ message: "internal_server_error" });
    }
};

const createPost = async (req, res) => {
    try {
        const { title, content } = req.body;
        // 입력값 검증
        if (!title || !content) {
            return res.status(400).json({ message: "title_and_content_required" });
        }
        const postImage = req.file ? `/uploads/postImages/${req.file.filename}` : null;
        const newPost = {
            title,
            content,
            postImage,
            like_cnt: 0,
            comment_cnt: 0,
            view_cnt: 0,
            user_id: req.session.user.user_id,
        };
        await createPostModel(newPost);
        res.status(201).json({ message: "post_created_success" });
    } catch (error) {
        console.error("게시글 생성 오류:", error);
        res.status(500).json({ message: "internal_server_error" });
    }
};
const loadPostDetail = async (req, res) => {
    try {
        const postId = parseInt(req.params.post_id, 10);
        if (isNaN(postId)) {
            return res.status(400).json({ message: "invalid_post_id" });
        }
        const post = await getPostByIdModel(postId);
        if (!post) {
           return res.status(404).json({ message: "post_not_found" });
        }
        res.status(200).json({ message: "post_detail_success", data: post });
    } catch (error) {
        console.error("게시글 상세 조회 오류:", error);
        res.status(500).json({ message: "internal_server_error" });
    }
};
const updatePostDetail = async (req, res) => {
    try {
        const postId = parseInt(req.params.post_id, 10);
        const { title, content, imageFlag } = req.body;

        if (isNaN(postId) || !title || !content || typeof imageFlag !== "number") {
            return res.status(400).json({ message: "invalid_input_data" });
        }

        const postImage = req.file ? `/uploads/postImages/${req.file.filename}` : null;
        const existingPost = await getPostByIdModel(postId);
        if (!existingPost) {
            return res.status(404).json({ message: "post_not_found" });
        }

        if (imageFlag == 1 && existingPost.photo_url) {
            const previousImagePath = path.join(__dirname, '..', existingPost.image_url);
            fs.unlink(previousImagePath, (err) => {
                if (err) {
                    console.error('기존 이미지 삭제 오류:', err);
                } else {
                    console.log('기존 이미지가 삭제되었습니다:', previousImagePath);
                }
            });
        }
        const updatedPost = updatePostModel(postId, title, content, postImage, imageFlag);
        if (!updatedPost) {
            return res.status(404).json({ message: "post_not_found" });
        }
        res.status(204).json({ message: "post_updated_success", data: updatedPost });
    } catch (error) {
        console.error("게시글 수정 오류:", error);
        res.status(500).json({ message: "internal_server_error" });
    }
};
const viewcntPost = async (req, res) => {
    try{
        const postId = parseInt(req.params.post_id, 10);
        await viewCountModel(postId)
        res.status(204).json({ message: "increase_view_cnt" });
    }
    catch (error){
        console.error("게시글 좋아요 오류:", error);
        res.status(500).json({ message: "internal_server_error" });
    }
}
const likePost = async (req, res) => {
    try {
        const postId = parseInt(req.params.post_id, 10);
        const userId = req.session.user.user_id;

        // 좋아요 상태를 토글
        const result = await likePostModel(postId, userId);

        if (result.message === "like_removed") {
            return res.status(200).json({ message: "like_removed", data: result });
        } else if (result.message === "like_added") {
            return res.status(200).json({ message: "like_added", data: result });
        }
    } catch (error) {
        console.error("게시글 좋아요 오류:", error);
        res.status(500).json({ message: "internal_server_error" });
    }
};

//
const deletePost = async (req, res) => {
    try {
        const postId = parseInt(req.params.post_id, 10);
        const isDeleted = await deletePostModel(postId);
        if (!isDeleted) {
            return res.status(404).json({ message: "post_not_found" });
        }
        res.status(200).json({ message: "post_deleted_success" });
    } catch (error) {
        console.error("게시글 삭제 오류:", error);
        res.status(500).json({ message: "internal_server_error" });
    }
};
export { loadPosts, createPost, loadPostDetail, updatePostDetail, deletePost, likePost, viewcntPost };