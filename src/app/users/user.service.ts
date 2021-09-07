import {User} from "./user.model";
import {Request, Response} from "express";
import * as argon2 from 'argon2';
import {getModelForClass} from "@typegoose/typegoose";
import {logger} from "../../config/winston";

const UserModel = getModelForClass(User);

export async function create(req: Request, res: Response) {

    logger.info('Calling UserService method create')

    if (!req.body.email || !req.body.password || !req.body.name) {
        return res.status(400).send({
            message: "Required field can not be empty",
            obj: req.body
        });
    }

    const user = new UserModel({
        email: req.body.email,
        password: await argon2.hash(req.body.password),
        name: req.body.name,
        age: req.body.age,
        gender: req.body.gender,
        isActive: req.body.isActive,
        userType: req.body.userType,
    });

    user.save()
        .then((data) => {
            res.send(data);
            logger.info('User ' + JSON.stringify(req.body) + ' created')
        })
        .catch((err) => {
            logger.error(err.message)
            res.status(500).send({
                message: err.message || "Some error occurred while creating the User.",
            });
        });
}

export function findAll(req: Request, res: Response) {
    logger.info('Calling UserService method findAll')
    UserModel.find()
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

export function findOne(req: Request, res: Response) {
    logger.info('Calling UserService method findOne')
    UserModel.findById(req.params.id)
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.id,
                });
            }
            res.status(200).send(data);
        })
        .catch((err) => {
            logger.error(err.message)
            return res.status(500).send({
                message: "Error retrieving User with id " + req.params.id,
            });
        });
}

export function remove(req: Request, res: Response) {
    logger.info('Calling UserService method remove')
    UserModel.findByIdAndDelete(req.params.id)
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    message: "User not found ",
                });
            }
            res.status(200).send({message: 'User ' + req.params.id + ' deleted'});
            logger.info('User ' + req.params.id + ' deleted')
        })
        .catch((err) => {
            logger.error(err.message)
            return res.status(500).send({
                message: "Could not delete User ",
            });
        });
}

export function update(req: Request, res: Response) {
    logger.info('Calling UserService method update')
    if (!req.body.email || !req.body.password || !req.body.name) {
        res.status(400).send({
            message: "required fields cannot be empty",
        });
    }
    UserModel.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    message: "no User found",
                });
            }
            console.log("data :",data);
            logger.info('User ' + req.params.id + ' updated')
            res.status(200).send(data);
        })
        .catch((err) => {
            logger.error(err.message)
            return res.status(404).send({
                message: "error while updating the data",
            });
        });
}
