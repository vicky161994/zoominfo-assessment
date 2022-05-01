const { userPopulate, FolderPopulate } = require("../constants/populate");
const { File } = require("../models");
const logger = require("../utils/logger");
const CODE = require("../Helper/httpResponseCode");
const MESSAGE = require("../Helper/httpResponseMessage");
const { serverError } = require("../constants/commonConstants");

exports.createFile = async (req, res, payload) => {
  logger.info("ORM::createFile");
  try {
    console.log(payload);
    const newFileData = new File({
      name: payload.name,
      folder: payload.folderId ? payload.folderId : null,
      createdBy: req.user._id,
    });
    console.log(newFileData);
    const createdFile = await newFileData.save();
    return res.status(CODE.NEW_RESOURCE_CREATED).send({
      message: `File ${MESSAGE.CREATE_SUCCESS}`,
      data: {
        _id: createdFile._id,
        name: createdFile.name,
        folder: createdFile.folder,
        content: createdFile.content,
        is_active: createdFile.is_active,
        created_on: createdFile.created_on,
        modified_on: createdFile.modified_on,
      },
    });
  } catch (error) {
    logger.error(error);
    return res
      .status(CODE.INTERNAL_SERVER_ERROR)
      .send({ message: serverError });
  }
};

exports.getFileById = async (req, res, fileId, folderId) => {
  logger.info("ORM::getFileById");
  try {
    const fileData = await File.find({
      _id: fileId,
      is_active: true,
      createdBy: req.user._id,
    }).populate([userPopulate, FolderPopulate]);
    return res.status(CODE.EVERYTHING_IS_OK).send({
      message: MESSAGE.SUCCESSFULLY_DONE,
      data: fileData,
    });
  } catch (error) {
    logger.error(error);
    return res
      .status(CODE.INTERNAL_SERVER_ERROR)
      .send({ message: serverError });
  }
};

exports.getFilesOfFolder = async (req, res, skip, limit, folderId) => {
  logger.info("ORM::getFilesOfFolder");
  try {
    const fileList = await File.find({
      folder: folderId,
      is_active: true,
      createdBy: req.user._id,
    })
      .sort({ created_on: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .populate([userPopulate, FolderPopulate]);
    return res.status(CODE.EVERYTHING_IS_OK).send({
      message: MESSAGE.SUCCESSFULLY_DONE,
      data: fileList,
    });
  } catch (error) {
    logger.error(error);
    return res
      .status(CODE.INTERNAL_SERVER_ERROR)
      .send({ message: serverError });
  }
};

exports.updateFile = async (req, res, fileId, payload) => {
  logger.info("ORM::updateFile");
  try {
    await File.findOneAndUpdate(
      { _id: fileId, createdBy: req.user._id },
      payload
    );
    return res.status(CODE.EVERYTHING_IS_OK).send({
      message: MESSAGE.UPDATE_SUCCESS,
    });
  } catch (error) {
    logger.error(error);
    return res
      .status(CODE.INTERNAL_SERVER_ERROR)
      .send({ message: serverError });
  }
};

exports.deleteFile = async (req, res, fileId) => {
  logger.info("ORM::deleteFile");
  try {
    await File.findOneAndUpdate(
      { _id: fileId, createdBy: req.user._id },
      {
        is_active: false,
      }
    );
    return res.status(CODE.EVERYTHING_IS_OK).send({
      message: MESSAGE.DELETE_SUCCESS,
    });
  } catch (error) {
    logger.error(error);
    return res
      .status(CODE.INTERNAL_SERVER_ERROR)
      .send({ message: serverError });
  }
};
