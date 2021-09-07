import {Request, Response} from "express";
import * as argon2 from "argon2";
import * as jwt from 'jsonwebtoken';
import {getModelForClass} from "@typegoose/typegoose";
import {User} from "../users/user.model";
import {logger} from "../../config/winston";

export function generateToken(req: Request, res: Response) {
    logger.info('Calling AuthService method generateToken')
    const UserModel = getModelForClass(User);

    UserModel.findOne({email: req.body.email}).select(['password', 'userType']).then
    ((user) => {
            if (!user) {
                logger.error('User not found!')
                return res.status(401).json({
                    error: 'Invalid Request'
                });
            }
            try {
                console.log(user);
                argon2.verify(user.password, req.body.password).then(match => {
                    if (match) {
                        const token = jwt.sign(
                            {
                                userId: user._id,
                                userType: user.userType
                            },
                            process.env.JWT_SECRET,
                            {expiresIn: process.env.JWT_TIMEOUT});

                        res.status(200).json({
                            userId: user._id,
                            token: token
                        });
                    } else {
                        res.status(401).send({error: "Invalid Request"});
                    }
                });
            } catch (err) {
                res.status(401).send({"error :": err});
            }
        }
    ).catch(
        (error) => {
            res.status(500).json({
                error: error
            });
        }
    );
}

export function pingAuth(req: Request, res: Response) {
    logger.info('Calling AuthService method ping')
    res.status(200).send({
        message: 'Your token is OK!'
    });
}
