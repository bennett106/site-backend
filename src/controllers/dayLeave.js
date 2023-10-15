const DayLeave = require("../models/dayLeave");
const User = require("../models/user");

//* Retrieve day leave requests
const getDayLeave = async (req, res) => {
  try {
    const dayLeave_data = await DayLeave.find(req.query);
    res.status(200).json({ dayLeave_data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//* create dayleave requests

const createDayLeave = async (req, res) => {
  try {
    // Extract user information from the token
    const { _id } = req.user._id; // Assuming user's identity is stored in the "user" property of the request
    console.log("Object ID for the dayleave application :- ",_id);
    // Fetch user details from the User model
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const dayLeaveData = req.body; // Assuming you receive a single JSON object
    // console.log(dayLeaveData);
    const {
      dateOfLeaving,
      timeOfLeaving,
      purpose,
      timeOfReturn,
    } = dayLeaveData;

    console.log(req.body);
    console.log(dateOfLeaving, timeOfLeaving, purpose, timeOfReturn);
  
    try {
      const dayLeave = new DayLeave({ dateOfLeaving, timeOfLeaving, purpose, timeOfReturn, PostedBy: req.user._id });
      await dayLeave.save(); // Wait for the post to be saved before proceeding
      console.log("Success!");
      return res.json(dayLeave);
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .send("Error while submitting the content. Please try again.");
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};




// const createDayLeave = async (req, res) => {
//   try {
//     // Extract user information from the token
//     const userId = req.user.user.id; // Assuming user's identity is stored in the "user" property of the request
//     console.log(userId);

//     // Fetch user details from the User model
//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     const dayLeaveData = req.body;

//     // Ensure that required data is provided in the request body
//     if (!dayLeaveData.dateOfLeaving || !dayLeaveData.timeOfLeaving || !dayLeaveData.purpose || !dayLeaveData.timeOfReturn) {
//       return res.status(400).json({ error: "Missing required data in the request" });
//     }

//     // Create a new DayLeave document
//     const dayLeave = new DayLeave({
//       dateOfLeaving: dayLeaveData.dateOfLeaving,
//       timeOfLeaving: dayLeaveData.timeOfLeaving,
//       purpose: dayLeaveData.purpose,
//       timeOfReturn: dayLeaveData.timeOfReturn,
//       PostedBy: userId,
//     });

//     // Save the new dayLeave record to the database
//     await dayLeave.save();

//     // Respond with the created dayLeave object
//     return res.status(201).json(dayLeave);
//   } catch (error) {
//     console.error("Error while creating a document:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };


module.exports = { getDayLeave, createDayLeave };
