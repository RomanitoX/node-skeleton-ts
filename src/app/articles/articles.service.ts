import {Request, Response} from "express";
import {logger} from "../../config/winston";
import {getModelForClass} from "@typegoose/typegoose";
import {Article} from "./articles.model";
import * as CommentService from "../comments/comments.service";

const articleModel = getModelForClass(Article);

//Create an article
export function create(req: Request, res: Response) {

    logger.info('Calling ArticleService method create')

    if (!req.body.title || !req.body.content || !req.body.userId) {
        return res.status(400).send({
            message: "Required field can not be empty",
            obj: req.body
        });
    }

    const article = new articleModel({
        published: req.body.published,
        title: req.body.title,
        content: req.body.content,
        userId: req.body.userId
    });

    article.save()
        .then((data) => {
            res.send(data);
            logger.info('Article ' + JSON.stringify(req.body) + ' created')
        })
        .catch((err) => {
            logger.error(err.message)
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Article.",
            });
        });
}

//Find all Article where the param Published = true
export function findAllPublished(req: Request, res: Response) {
    logger.info('Calling ArticleService method findAllPublished')
    articleModel.find({published: true})
        .sort('-updatedAt')
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

//Find all Articles
export function findAll(req: Request, res: Response) {
    logger.info('Calling ArticleService method findAll')
    articleModel.find()
        .sort('-updatedAt')
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

//Find one Article by :id
export function findOne(req: Request, res: Response) {
    logger.info('Calling ArticleService method findOne')
    articleModel.findById(req.params.id)
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    message: "Article not found with id " + req.params.id,
                });
            }
            res.status(200).send(data);
        })
        .catch((err) => {
            logger.error(err.message)
            return res.status(500).send({
                message: "Error retrieving Article with id " + req.params.id,
            });
        });
}

//Remove one Article by :id
export function remove(req: Request, res: Response) {
    logger.info('Calling ArticleService method remove')
    articleModel.findByIdAndDelete(req.params.id)
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    message: "Article not found ",
                });
            }
            CommentService.removeAllByArticleId(req.params.id);
            res.status(200).send({message: 'Article ' + req.params.id + ' deleted'});
            logger.info('Article ' + req.params.id + ' deleted')
        })
        .catch((err) => {
            logger.error(err.message)
            return res.status(500).send({
                message: "Could not delete Article",
            });
        });
}

//Update one Article by :id
export function update(req: Request, res: Response) {
    logger.info('Calling ArticleService method update')
    if (!req.body.title || !req.body.content || !req.body.userId) {
        res.status(400).send({
            message: "required fields cannot be empty",
        });
    }
    articleModel.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    message: "no Article found",
                });
            }
            logger.info('Article ' + req.params.id + ' updated')
            res.status(200).send(data);
        })
        .catch((err) => {
            logger.error(err.message)
            return res.status(404).send({
                message: "error while updating the Article",
            });
        });
}
