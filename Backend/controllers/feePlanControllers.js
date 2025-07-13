import FeePlan from "../models/feePlan.js";

// ➕ Create a new fee plan
export const createFeePlan = async (req, res, next) => {
  try {
    const { planName, amount, durationInDays, description } = req.body;

    if (!planName || amount === undefined || durationInDays === undefined) {
      return res.status(400).json({ error: "planName, amount, and durationInDays are required" });
    }

    if (typeof planName !== "string" || planName.trim().length < 3) {
      return res.status(400).json({ error: "planName must be at least 3 characters long" });
    }

    if (typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({ error: "Amount must be a positive number" });
    }

    if (typeof durationInDays !== "number" || durationInDays <= 0) {
      return res.status(400).json({ error: "durationInDays must be a positive number" });
    }

    const existingPlan = await FeePlan.findOne({ planName });
    if (existingPlan) {
      return res.status(400).json({ error: "Fee plan with this name already exists" });
    }

    const newPlan = new FeePlan({ planName, amount, durationInDays, description });
    const savedPlan = await newPlan.save();

    res.status(201).json({
      message: "Fee plan created successfully",
      feePlan: {
        id: savedPlan._id,
        planName: savedPlan.planName,
        amount: savedPlan.amount,
        durationInDays: savedPlan.durationInDays,
        description: savedPlan.description,
      },
    });
  } catch (err) {
    next(err);
  }
};

// 📄 Get all fee plans
export const getAllFeePlans = async (req, res, next) => {
  try {
    const plans = await FeePlan.find();
    res.status(200).json(plans);
  } catch (err) {
    next(err);
  }
};

// ✏️ Update a fee plan
export const updateFeePlan = async (req, res, next) => {
  try {
    const { planName, amount, durationInDays, description } = req.body;
    const updateFields = {};

    if (planName) {
      if (typeof planName !== "string" || planName.trim().length < 3) {
        return res.status(400).json({ error: "planName must be at least 3 characters long" });
      }
      updateFields.planName = planName;
    }

    if (amount !== undefined) {
      if (typeof amount !== "number" || amount <= 0) {
        return res.status(400).json({ error: "Amount must be a positive number" });
      }
      updateFields.amount = amount;
    }

    if (durationInDays !== undefined) {
      if (typeof durationInDays !== "number" || durationInDays <= 0) {
        return res.status(400).json({ error: "durationInDays must be a positive number" });
      }
      updateFields.durationInDays = durationInDays;
    }

    if (description !== undefined) {
      updateFields.description = description;
    }

    const updatedPlan = await FeePlan.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    if (!updatedPlan) {
      return res.status(404).json({ error: "Fee plan not found" });
    }

    res.status(200).json({
      message: "Fee plan updated successfully",
      feePlan: {
        id: updatedPlan._id,
        planName: updatedPlan.planName,
        amount: updatedPlan.amount,
        durationInDays: updatedPlan.durationInDays,
        description: updatedPlan.description,
      },
    });
  } catch (err) {
    next(err);
  }
};

// 🗑️ Delete a fee plan
export const deleteFeePlan = async (req, res, next) => {
  try {
    const deleted = await FeePlan.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Fee plan not found" });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
