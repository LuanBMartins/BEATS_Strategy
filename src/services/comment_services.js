/* eslint-disable */
const db_client = require('../dbconfig').db_client;
const commentRepository = require('../infra/repositories/comment-repository')

module.exports = class comment_services{
    static async readComments(strategyId){
        if(!strategyId){
            return []
        }

        const comments = await commentRepository.findByStrategy(strategyId)
        return comments
    }

    static async readComment(commentId){
        if(!commentId){
            return []
        }

        const comments = await commentRepository.findByComment(commentId)
        return comments
    }

    static async getCommentById(commentId){
        if(!commentId){
            return false
        }

        const comments = await commentRepository.getComment(commentId)
        return comments
    }

    static async removeComment(commentId){
        if(!commentId){
            return false
        }

        return await commentRepository.delete(commentId)
    }

    static async getAllStrategyComments(strategy_name){
        try{
            const text = "SELECT b.id AS base_id, b.username AS base_user,\
            b.data_comentario AS base_date, b.texto AS base_text,\
            r.id AS reply_id, r.username AS reply_user,\
            r.data_comentario AS reply_date, r.texto AS reply_text\
            FROM comentario b\
            LEFT JOIN comentario r ON b.id = r.comentario_base\
            WHERE b.estrategia = $1 AND b.comentario_base IS NULL\
			ORDER BY base_date, reply_date";

            const values = [strategy_name];
            const db_comments = await db_client.query(text, values);

            let comments = {};

            db_comments.rows.forEach(comment => {
                if(comments[comment.base_id] === undefined){
                    comments[comment.base_id] = {
                        id: comment.base_id, 
                        author: comment.base_user, 
                        date: comment.base_date,
                        text: comment.base_text,
                        replies: []
                    };

                    if(comment.reply_id != null){
                        comments[comment.base_id].replies = [{
                            id: comment.reply_id, 
                            author: comment.reply_user, 
                            date: comment.reply_date,
                            text: comment.reply_text
                        }]
                    }
                } 
                else{
                    comments[comment.base_id].replies.push({
                        id: comment.reply_id, 
                        author: comment.reply_user, 
                        date: comment.reply_date,
                        text: comment.reply_text
                    });
                }
            });

            return Object.values(comments);

        }
        catch(err){
            console.log(err);
        }
    }

    static async getCommentReplies(id){
        try{
            const text = "SELECT c.id, c.username AS author, c.data_comentario AS date, c.texto AS text\
            FROM comentario c\
            WHERE c.comentario_base = $1\
            ORDER BY date";
            
            const values = [id];

            const db_replies = await db_client.query(text, values);

            return db_replies.rows;
        }
        catch(err){
            console.log(err);
        }
    }



    static async commentStrategy(strategyId, author, commentText){
        try{
            const comment = await commentRepository.insert({
                strategy_id: strategyId,
                username: author,
                text: commentText
            })

            return comment
        }
        catch(err){
            console.log(err);
            return false
        }
    }



    static async replyCommentStrategy(id, strategyId, author, replyText){
        try{
            const reply = await commentRepository.insert({
                strategy_id: strategyId,
                username: author,
                text: replyText,
                base_comment: id
            })
            return reply
        }
        catch(err){
            console.log(err);
        }
    }


    static async updateCommentText(id, textEdit){
        const commentEdit = await commentRepository.update(id, {
            text: textEdit
        })

        return !!commentEdit[0]
    }
}