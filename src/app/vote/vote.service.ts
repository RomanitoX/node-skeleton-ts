import {Request, Response} from "express";
import {logger} from "../../config/winston";
import {getModelForClass} from "@typegoose/typegoose";
import {Vote, VoteType} from "./vote.model";
import * as _ from 'lodash';

const VoteModel = getModelForClass(Vote);

//Create a Vote if doesn't exist OR Update existing one if VoteType is different
export function createOrUpdate(req: Request, res: Response) {

    logger.info('Calling VoteService method createOrUpdate')
    if (!req.body.commentId || !req.body.userId || !req.body.voteType) {
        return res.status(400).send({
            message: "Required field can not be empty",
            obj: req.body
        });
    }
    VoteModel.findOne({commentId: req.body.commentId, userId: req.body.userId})
        .then((data) => {
            if (data && _.isEqual(req.body.voteType, data.voteType)) {
                logger.error('Cannot vote two times for the same Comment')
                return res.status(400).send({
                    message: "Cannot vote two times for the same Comment",
                    obj: req.body
                });
            } else if (data && !_.isEqual(req.body.voteType, data.voteType)) {
                VoteModel.findOneAndUpdate({_id: data.id}, {voteType: req.body.voteType}, {new: true})
                    .then((updated) => {
                        res.status(200).send(updated);
                        logger.info('Vote ' + data.id + ' updated')
                    })

            } else {
                console.log('je else')
                const vote = new VoteModel({
                    commentId: req.body.commentId,
                    userId: req.body.userId,
                    voteType: req.body.voteType
                });


                vote.save()
                    .then((data) => {
                        res.status(200).send(data);
                        logger.info('Vote ' + data.id + ' created')
                    })
                    .catch((err) => {
                        logger.error(err.message)
                        res.status(500).send({
                            message: err.message || "Some error occurred while creating the Vote.",
                        });
                    });
            }
        }).catch((err) => {
        logger.error(err.message)
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Vote.",
        });
    })
}

//Find all the Votes
export function findAll(req: Request, res: Response) {
    logger.info('Calling VoteService method findAll')
    VoteModel.find()
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

//Find all Votes by :userId
export function findAllByUserId(req: Request, res: Response) {
    logger.info('Calling VoteService method findAllByUserId')
    VoteModel.find({userId: req.params.userId})
        .then((data) => {
            if (!data) {
                logger.error('No Votes found for user :' + req.params.userId)
                return res.status(200).json({
                    error: 'No Vote on this vote'
                });
            } else {
                return res.status(200).send(data);
            }
        })
}

//Find all by :commentId
export function findAllByCommentId(req: Request, res: Response) {
    logger.info('Calling VoteService method findAllByCommentId')
    VoteModel.find({commentId: req.params.commentId})
        .then((data) => {
            if (!data) {
                logger.error('No Votes found on comment :' + req.params.commentId)
                return res.status(200).json({
                    error: 'No Vote on this vote'
                });
            } else {
                return res.status(200).send(data);
            }
        })
}

//Find all the votes on one Comment and return the total note of it by :commentId
export function findNoteByCommentId(req: Request, res: Response) {
    logger.info('Calling VoteService method findNoteByCommentId')
    VoteModel.find({commentId: req.params.commentId})
        .then((data) => {
            if (!data) {
                logger.error('No Votes found for Comment :' + req.params.commentId)
                return res.status(200).json({
                    error: 'No Vote on this vote'
                });
            } else {
                let note: number =
                    -Math.abs(_.filter(data, {voteType: VoteType.VOTETYPE_DOWN}).length)
                    + _.filter(data, {voteType: VoteType.VOTETYPE_UP}).length
                return res.status(200).send({note});
            }
        })
}

//Find a Vote by :userId AND :commentId
export function findOneByUserIdAndCommentId(req: Request, res: Response) {
    logger.info('Calling VoteService method findOneByUserIdAndCommentId')
    VoteModel.findOne({userId: req.params.userId, commentId: req.params.commentId})
        .then((data) => {
            if (!data) {
                return res.status(200).send({
                    message: "Vote not found for userId " + req.params.userId
                        + " and commentId " + req.params.commentId,
                });
            }
            res.status(200).send(data);
        })
        .catch((err) => {
            logger.error(err.message)
            return res.status(500).send({
                message: "Error retrieving Vote with id " + req.params.id,
            });
        });
}

//Find a Vote by :id
export function findOne(req: Request, res: Response) {
    logger.info('Calling VoteService method findOne')
    VoteModel.findById(req.params.id)
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    message: "Vote not found with id " + req.params.id,
                });
            }
            res.status(200).send(data);
        })
        .catch((err) => {
            logger.error(err.message)
            return res.status(500).send({
                message: "Error retrieving Vote with id " + req.params.id,
            });
        });
}

//Delete one Vote by :id
export function remove(req: Request, res: Response) {
    logger.info('Calling VoteService method remove')
    VoteModel.findByIdAndDelete(req.params.id)
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    message: "Vote not found ",
                });
            }
            res.status(200).send({message: 'Vote ' + req.params.id + ' deleted'});
            logger.info('Vote ' + req.params.id + ' deleted')
        })
        .catch((err) => {
            logger.error(err.message)
            return res.status(500).send({
                message: "Could not delete Vote",
            });
        });
}

//Delete all the Votes by :commentId
export function removeAllByCommentId(commentId: string) {
    logger.info('Calling VoteService method removeAllByCommentId')
    VoteModel.deleteMany({commentId})
        .then((data) => {
            if (data.n > 0) {
                logger.info('Votes of commentId ' + commentId + ' deleted')
            } else {
                logger.info('No votes existing for ' + commentId)
            }
        })
        .catch((err) => {
            logger.error(err.message)
        });
}

//Update one Vote by :id
export function update(req: Request, res: Response) {
    logger.info('Calling VoteService method update')
    if (!req.body.commentId || !req.body.userId || !req.body.voteType) {
        return res.status(400).send({
            message: "required fields cannot be empty",
        });
    }
    VoteModel.findByIdAndUpdate(req.params.id, req.body, {new: true})
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    message: "no Vote found",
                });
            }
            logger.info('Vote ' + req.params.id + ' updated')
            res.status(200).send(data);
        })
        .catch((err) => {
            logger.error(err.message)
            return res.status(404).send({
                message: "error while updating the Vote",
            });
        });
}
