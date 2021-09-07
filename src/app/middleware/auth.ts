import * as jwt from 'jsonwebtoken';
import {logger} from "../../config/winston";
import {UserType} from "../users/user.model";

export function auth(req, res, next) {
    logger.info('Calling auth middleware function')
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;
        const userType = decodedToken.userType;
//         console.log("Decoded Token:", decodedToken);
//         console.log("Body userId", req.body.userId);
        if ((req.body.userId && req.body.userId !== userId) || (userType == UserType.ADMIN)) {
            next();
        } else {
            logger.error('Invalid user ID')
                        return res.status(401).json({
                            error: 'Invalid Request'
                        })
        }
    } catch {
        logger.error('Trying to request without token')
        res.status(401).json({
            error: 'Invalid Request'
        });
    }
}
