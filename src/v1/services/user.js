const logger = require("../utils/logger");
const _ = require("loadsh");
const CODE = require("../Helper/httpResponseCode");
const MESSAGE = require("../Helper/httpResponseMessage");
const { UserORM } = require("../orm");
const validator = require("validator");
const { User } = require("../models");
const { trimInputData } = require("../Helper/commonFunction");
const mongoose = require("mongoose");

exports.login = async (req, res) => {
  logger.info("services::login");
  if (_.isEmpty(req.body)) {
    return res.status(CODE.NOT_FOUND).send({ message: MESSAGE.INVALID_ARGS });
  }
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(CODE.NOT_FOUND).send({ message: MESSAGE.INVALID_ARGS });
  }
  if (!validator.isEmail(email)) {
    return res.status(CODE.BAD_REQUEST).send({
      message: MESSAGE.INVALID_ARGS,
    });
  }
  const trimmedData = await trimInputData({ email, password });
  await UserORM.login(req, res, trimmedData.email, trimmedData.password);
};

exports.register = async (req, res) => {
  logger.info("services::register");
  try {
    if (_.isEmpty(req.body)) {
      return res.status(CODE.NOT_FOUND).send({ message: MESSAGE.INVALID_ARGS });
    }
    let { name, email, password } = req.body;
    if (!validator.isEmail(email)) {
      return res.status(CODE.BAD_REQUEST).send({
        message: MESSAGE.INVALID_ARGS,
      });
    }
    const isUserExist = await User.findOne({ email: email });
    if (isUserExist) {
      return res
        .status(CODE.ALREADY_EXIST)
        .send({ message: `User ${MESSAGE.ALREADY_EXIST}` });
    }
    const trimmedData = await trimInputData({
      name,
      email,
      password,
    });
    return await UserORM.register(req, res, trimmedData);
  } catch (error) {
    logger.error(error);
    return res
      .status(CODE.INTERNAL_SERVER_ERROR)
      .send({ message: MESSAGE.serverError });
  }
};

exports.getFilesAndFolderForDashboard = async (req, res) => {
  logger.info("services::getFilesAndFolderForDashboard");
  let { page, limit } = req.query;
  page = page ? page : 1;
  limit = limit ? limit : 20;
  const skip = (parseInt(page) - 1) * limit;
  await UserORM.getFilesAndFolderForDashboard(req, res, skip, limit);
};
