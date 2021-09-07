import "./lib/env"
import {connect} from "./database/database";
import './config/winston';
import {startExpress} from "./config/express";

connect();
startExpress();


