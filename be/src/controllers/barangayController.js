import { Barangay } from "../models/barangayModel.js";

const createBarangay = async (req, res) => {
  try {
    let barangay = new Barangay(req.body);

    await barangay.save();

    res.status(201).json({
      success: true,
      message: "Barangay created successfully",
      data: barangay,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

const getBarangay = async (req, res) => {
  try {
    const barangay = await Barangay.findById(req.params.id);
    if (!barangay)
      return res
        .status(404)
        .json({ success: false, message: "Barangay not found" });
    res.json({ success: true, message: "Barangay retrieved", data: barangay });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

const geBarangays = async (req, res) => {
  try {
    const barangays = await Barangay.find();
    res.json({
      success: true,
      message: "Barangays retrieved",
      data: barangays,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

const updateBarangay = async (req, res) => {
  try {
    const barangayId = req.params.id;

    const updatedBarangay = await Barangay.findByIdAndUpdate(
      barangayId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedBarangay) {
      return res
        .status(404)
        .json({ success: false, message: "Barangay not found" });
    }

    res.json({
      success: true,
      message: "Barangay updated successfully",
      data: updatedBarangay,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

const deleteBarangay = async (req, res) => {
  try {
    const barangay = await Barangay.findByIdAndDelete(req.params.id);
    if (!barangay) {
      return res
        .status(404)
        .json({ success: false, message: "Barangay not found" });
    }

    res.json({
      success: true,
      message: "Barangay data deleted successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export {
  createBarangay,
  getBarangay,
  geBarangays,
  updateBarangay,
  deleteBarangay,
};
