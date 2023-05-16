/* eslint-disable */
const strategy_services = require("../services/strategy_services");
const commentServices = require("../services/comment_services");

module.exports = class comment_controllers {
    static async getComment(req, res, next) {
        const strategy_name = req.params.name;
        const comment_id = req.params.id;

        const regex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
        if (!regex.test(comment_id)) {
            return res.status(400).send({ error_message: 'comment id is not in UUID format' });
        }

        if (!await strategy_services.strategyExists(strategy_name)) {
            return res.status(404).send({ error_message: `strategy ${strategy_name} does not exist` });
        }

        const comment = await commentServices.getCommentById(strategy_name, comment_id);
        if (!comment) {
            return res.status(404).send({ error_message: 'this comment does not exist for this strategy' });
        }

        const replies = await commentServices.getCommentReplies(comment_id);
        if (replies.length > 0 || comment.base_comment === null) {
            return res.status(200).send({ id: comment.id, author: comment.author, date: comment.date, text: comment.text, replies });
        }

        return res.status(200).send(comment);
    }

    static async readComments(req, res) {
        try {
            const { id } = req.params
            if (!id) {
                return res.status(500).send()
            }
            const comments = await commentServices.readComments(id)
            if (comments.length < 1) {
                return res.status(200).send({ "error_message": "comment does not exist" })
            }
            return res.status(200).send({ comments })
        } catch (error) {
            console.log("🚀 ~ file: comment_controllers.js:43 ~ comment_controllers ~ readComment ~ error:", error)
            return res.status(500).send()
        }
    }

    static async readComment(req, res) {
        try {
            const { id } = req.params
            if (!id) {
                return res.status(500).send()
            }
            const comments = await commentServices.readComment(id)
            if (comments.length < 1) {
                return res.status(200).send({ "error_message": "comment does not exist" })
            }
            return res.status(200).send(comments)
        } catch (error) {
            console.log("🚀 ~ file: comment_controllers.js:43 ~ comment_controllers ~ readComment ~ error:", error)
            return res.status(500).send()
        }
    }

    static async getComments(req, res, next) {
        const strategy_name = req.params.name;

        if (!await strategy_services.strategyExists(strategy_name)) {
            return res.status(404).send({ error_message: `strategy '${strategy_name}' does not exist` });
        }

        return res.status(200).send({ comments: await commentServices.getAllStrategyComments(strategy_name) });
    }



    static async postComment(req, res) {
        try {
            const { id } = req.params;
            const commentInsert = await commentServices.commentStrategy(id, req.user_info.username, req.body.text);
            if (!commentInsert) {
                return res.status(404).send({ error_message: `strategy does not exist` });
            }
            return res.status(201).send({ message: 'success: comment inserted', comment: commentInsert });
        } catch (error) {
            return res.status(500).send()
        }
    }



    static async postReplyComment(req, res, next) {
        try {
            const { id } = req.params
            const { strategyId } = req.params
            const reply = await commentServices.replyCommentStrategy(id, strategyId, req.user_info.username, req.body.text);
            if (!reply) {
                return res.status(400).send({
                    success: false,
                    message: 'Invalid comment!'
                })
            }
            return res.status(201).send({ success: true, comment: reply });
        } catch (error) {
            console.log("🚀 ~ file: comment_controllers.js:106 ~ comment_controllers ~ postReplyComment ~ error:", error)
            return res.status(500).send({ success: false, message: 'Server Error!' });
        }
    }



    static async deleteComment(req, res, next) {
        try {
            const { id } = req.params;
            const user = req.user_info;
            const comment = await commentServices.getCommentById(id);
            if (!comment) {
                return res.status(404).send({ error_message: 'comment does not exist' });
            }
            if (user.username != comment.username) {
                return res.status(401).send({ message: 'Unauthorized!' });
            }
            await commentServices.removeComment(id)
            return res.status(200).send({ message: 'success: comment deleted' });
        } catch (error) {
            console.log("🚀 ~ file: comment_controllers.js:135 ~ comment_controllers ~ deleteComment ~ error:", error)
            return res.status(500).send({ message: 'Server Error!' });
        }
    }



    static async editComment(req, res, next) {
        try {
            const { id } = req.params;
            const user = req.user_info;
            const comment = await commentServices.getCommentById(id);
            if (user.username != comment.username) {
                return res.status(401).send({ message: 'Unauthorized!' });
            }
            const commentEdit = await commentServices.updateCommentText(id, req.body.text);
            if (!commentEdit) {
                return res.status(404).send({
                    success: false,
                    message: 'comment does not exist'
                })
            }
            return res.status(200).send({ successs: true, message: 'Comment update!' })
        } catch (error) {
            return res.status(500).send({ successs: false, message: 'Server Error!' })
        }
    }
}