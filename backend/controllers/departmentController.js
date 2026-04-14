import Document from "../models/Document.js";

// 🔹 GET DOCUMENTS FOR DEPARTMENT USER
export const getDepartmentDocs = async (req, res) => {
  try {
    const user = req.dbUser;
    console.log("before---------------", req.dbUser.department);
    req.dbUser.department = "Finance";
    console.log("after---------------", req.dbUser.department);
    const docs = await Document.find({
      status: "APPROVED",
      department: user.department, // 🔥 restrict to their department
    })
      .populate("metadataAddedBy", "firstName lastName")
      .sort({ updatedAt: -1 });

    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching department docs", err });
  }
};

// 🔹 GET SINGLE DOC
export const getDepartmentDocById = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);

    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: "Error", err });
  }
};

export const approveDepartmentFiles = async (req, res) => {
  try {
    const { ids } = req.body;

    await Document.updateMany(
      { _id: { $in: ids } },
      {
        $set: {
          departmentApprovedBy: req.dbUser._id,
          departmentApprovedAt: new Date(),
        },
      },
    );

    res.json({ message: "Department Approved ✅" });
  } catch (err) {
    res.status(500).json({ message: "Error", err });
  }
};
