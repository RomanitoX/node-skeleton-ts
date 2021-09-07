import {Request, Response} from "express";
import {logger} from "../../config/winston";
import {getModelForClass} from "@typegoose/typegoose";
import {Comment} from "./comments.model";
import * as VoteService from "../vote/vote.service"
import _ from "lodash";

const CommentModel = getModelForClass(Comment);

//Create a Comment
export function create(req: Request, res: Response) {

    logger.info('Calling CommentService method create')

    if (!req.body.articleId || !req.body.userId || !req.body.content) {
        return res.status(400).send({
            message: "Required field can not be empty",
            obj: req.body
        });
    }

    const article = new CommentModel({
        content: req.body.content,
        userId: req.body.userId,
        articleId: req.body.articleId,
        note: req.body.note
    });

    article.save()
        .then((data) => {
            res.send(data);
            logger.info('Comment ' + data.id + ' created')
        })
        .catch((err) => {
            logger.error(err.message)
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Comment.",
            });
        });
}

//Find all Comments
export function findAll(req: Request, res: Response) {
    logger.info('Calling CommentService method findAll')
    CommentModel.find()
        .sort({name: -1})
        .then((data) => {
            res.status(200).send(data);
        })
        .catch((err) => {
            logger.error(err.message)
            res.status(500).send({
                message: err.message || "Error Occured",
            });
        });
}

//Find all Comments by :articleId
export function findAllByArticleId(req: Request, res: Response) {
    logger.info('Calling CommentService method findAllByArticleId')
    CommentModel.find({articleId: req.params.articleId})
        .sort('-note')
        .then((data) => {
            if (!data) {
                logger.error('No comments found on article :' + req.params.articleId)
                return res.status(200).json({
                    error: 'No comment on this article'
                });
            } else {
                return res.status(200).send(data);
            }
        })
}

//Find a Comment by :id
export function findOne(req: Request, res: Response) {
    logger.info('Calling CommentService method findOne')
    CommentModel.findById(req.params.id)
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    message: "Comment not found with id " + req.params.id,
                });
            }
            res.status(200).send(data);
        })
        .catch((err) => {
            logger.error(err.message)
            return res.status(500).send({
                message: "Error retrieving Comment with id " + req.params.id,
            });
        });
}

//Remove a Comment by :id
export function remove(req: Request, res: Response) {
    logger.info('Calling CommentService method remove')
    CommentModel.findByIdAndDelete(req.params.id)
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    message: "Comment not found ",
                });
            }
            VoteService.removeAllByCommentId(req.params.id);
            res.status(200).send({message: 'Comment ' + req.params.id + ' deleted'});
            logger.info('Comment ' + req.params.id + ' deleted')
        })
        .catch((err) => {
            logger.error(err.message)
            return res.status(500).send({
                message: "Could not delete Comment",
            });
        });
}

//Remove all the Comments before deleting an Article
export function removeAllByArticleId(articleId: string) {
    logger.info('Calling CommentService method removeAllByArticleId')

    //Find all the votes for all the existing comments
    CommentModel.find({articleId})

        .then((data) => {
            if (data) {
                _.forEach((data), (comment) => {
                    VoteService.removeAllByCommentId(comment._id);
                })
            }
        });

    //Then we delete all the comments
    CommentModel.deleteMany({articleId})
        .then((data) => {
            if (data.n > 0) {
                logger.info('Comments of articleId ' + articleId + ' deleted')
            } else {
                logger.info('No Comments for ' + articleId)
            }
        })
        .catch((err) => {
            logger.error(err.message)
        });
}

//Update a Comment by :id
export function update(req: Request, res: Response) {
    logger.info('Calling CommentService method update')
    if (!req.body.articleId || !req.body.userId || !req.body.content) {
        res.status(400).send({
            message: "required fields cannot be empty",
        });
    }
    CommentModel.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})

        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    message: "no Comment found",
                });
            }
            logger.info('Comment ' + req.params.id + ' updated')
            res.status(200).send(data);
        })
        .catch((err) => {
            logger.error(err.message)
            return res.status(404).send({
                message: "error while updating the Comment",
            });
        });
}
