const logger = require("../utils/logger");
const { User, Folder, File } = require("../models");
const CODE = require("../Helper/httpResponseCode");
const MESSAGE = require("../Helper/httpResponseMessage");
const bcrypt = require("bcrypt");
const { serverError } = require("../constants/commonConstants");
const { generateToken } = require("../Helper/commonFunction");

exports.login = async (req, res, email, password) => {
  logger.info("ORM::login");
  try {
    const isUserExist = await User.findOne({ email: { $eq: email } });
    if (!isUserExist) {
      return res
        .status(CODE.NOT_FOUND)
        .send({ message: MESSAGE.NO_VALID_RECORD_FOUND });
    }
    const match = await bcrypt.compare(password, isUserExist.password);
    if (!match) {
      return res
        .status(CODE.UNAUTHORIZED)
        .send({ message: MESSAGE.NO_VALID_RECORD_FOUND });
    }
    const token = await generateToken(isUserExist);
    return res.status(CODE.EVERYTHING_IS_OK).send({
      message: `User ${MESSAGE.SUCCESSFULLY_DONE}`,
      data: {
        _id: isUserExist._id,
        fullName: isUserExist.fullName,
        email: isUserExist.email,
        is_active: isUserExist.is_active,
        created_on: isUserExist.created_on,
        modified_on: isUserExist.modified_on,
        token,
      },
    });
  } catch (error) {
    logger.error(error);
    return res
      .status(CODE.INTERNAL_SERVER_ERROR)
      .send({ message: serverError });
  }
};

exports.register = async (req, res, payload) => {
  logger.info("ORM::register");
  try {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(payload.password, salt);
    const userRegisterData = new User({
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
    });
    const registeredUser = await userRegisterData.save();
    return res.status(CODE.NEW_RESOURCE_CREATED).send({
      message: `User ${MESSAGE.CREATE_SUCCESS}`,
      data: {
        _id: registeredUser._id,
        name: registeredUser.name,
        email: registeredUser.email,
        is_active: registeredUser.is_active,
        created_on: registeredUser.created_on,
        modified_on: registeredUser.modified_on,
      },
    });
  } catch (error) {
    logger.error(error);
    return res
      .status(CODE.INTERNAL_SERVER_ERROR)
      .send({ message: serverError });
  }
};

exports.getFilesAndFolderForDashboard = async (req, res, skip, limit) => {
  logger.info("ORM::getFilesAndFolderForDashboard");
  try {
    let finalDataSet = [];
    let folderList = await Folder.find({
      createdBy: req.user._id,
      is_active: true,
    })
      .sort({ created_on: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    let fileList = await File.find({
      createdBy: req.user._id,
      folder: { $eq: null },
      is_active: true,
    })
      .sort({ created_on: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    finalDataSet.push(...folderList, ...fileList);
    return res.status(CODE.EVERYTHING_IS_OK).send({
      message: `List ${MESSAGE.SUCCESSFULLY_DONE}`,
      data: finalDataSet,
    });
  } catch (error) {
    logger.error(error);
    return res
      .status(CODE.INTERNAL_SERVER_ERROR)
      .send({ message: serverError });
  }
};
