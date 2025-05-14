import { FileRequest } from "../models/fileRequestModel.js";
import { User } from "../models/userModel.js";

const createFileRequest = async (req, res) => {
  try {
    let fileRequest = new FileRequest(req.body);

    await fileRequest.save();

    res.status(201).json({
      success: true,
      message: "File Request created successfully",
      data: fileRequest,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

const getFileRequest = async (req, res) => {
  try {
    const fileRequest = await FileRequest.findById(req.params.id);
    if (!fileRequest)
      return res
        .status(404)
        .json({ success: false, message: "File Request not found" });
    res.json({
      success: true,
      message: "File Request retrieved",
      data: fileRequest,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

const getFileRequests = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      requestNumber,
      requestedDocumentType,
      dateFrom,
      dateTo,
      search,
    } = req.query;

    const fileRequestFilter = {};

    // * requestNumber
    if (requestNumber) {
      fileRequestFilter.requestNumber = Number(requestNumber);
    }

    // * requestedDocumentType
    if (requestedDocumentType) {
      fileRequestFilter.requestedDocumentType = new RegExp(
        requestedDocumentType,
        "i"
      );
    }

    // * dateRequested between full days
    if (dateFrom || dateTo) {
      fileRequestFilter.dateRequested = {};
      if (dateFrom) {
        const start = new Date(dateFrom);
        start.setHours(0, 0, 0, 0); // * 00:00:00.000
        fileRequestFilter.dateRequested.$gte = start;
      }
      if (dateTo) {
        const end = new Date(dateTo);
        end.setHours(23, 59, 59, 999); // * 23:59:59.999
        fileRequestFilter.dateRequested.$lte = end;
      }
    }

    // * requestedBy via User fields
    if (search) {
      const userRegex = new RegExp(search, "i");
      const matchedUsers = await User.find({
        $or: [
          { firstName: userRegex },
          { lastName: userRegex },
          { email: userRegex },
        ],
      }).select("_id");

      const matchedUserIds = matchedUsers.map((user) => user._id);
      fileRequestFilter.requestedBy = { $in: matchedUserIds };
    }

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const fileRequests = await FileRequest.find(fileRequestFilter)
      .populate("requestedBy", "firstName lastName email role")
      .sort({ dateRequested: -1 })
      .skip(skip)
      .limit(limitNumber);

    const total = await FileRequest.countDocuments(fileRequestFilter);

    res.json({
      success: true,
      message: "File Requests retrieved",
      data: fileRequests,
      meta: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const updateFileRequest = async (req, res) => {
  try {
    const fileRequestId = req.params.id;

    const updatedFileRequest = await FileRequest.findByIdAndUpdate(
      fileRequestId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedFileRequest) {
      return res
        .status(404)
        .json({ success: false, message: "File Request not found" });
    }

    res.json({
      success: true,
      message: "File Request updated successfully",
      data: updatedFileRequest,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

const deleteFileRequest = async (req, res) => {
  try {
    const fileRequest = await FileRequest.findByIdAndDelete(req.params.id);
    if (!fileRequest) {
      return res
        .status(404)
        .json({ success: false, message: "File Request not found" });
    }

    res.json({
      success: true,
      message: "File Request data deleted successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export {
  createFileRequest,
  getFileRequest,
  getFileRequests,
  updateFileRequest,
  deleteFileRequest,
};
