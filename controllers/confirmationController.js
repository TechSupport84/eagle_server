import { Confirmation } from "../models/confirmation.model.js";
import { Partner } from "../models/partner.model.js";
import cron from "node-cron";


const cleanExpiredConfirmations = async () => {
  try {
    const now = new Date();
    const result = await Confirmation.deleteMany({ endDate: { $lt: now } });
    console.log(` Deleted ${result.deletedCount} expired confirmations.`);
  } catch (error) {
    console.error(" Error cleaning expired confirmations:", error);
  }
};

cron.schedule("0 0 * * *", () => {
  cleanExpiredConfirmations();
});

//  Confirm a partner (1 month subscription)
export const confirmation = async (req, res) => {
  const { partnerId, tokenMoney, amount } = req.body;
  const userId = req.user?.id;

  try {
    //  Check if the partner exists
    const partner = await Partner.findOne({ partnerID: partnerId });
    if (!partner) {
      return res.status(404).json({ success: false, message: "No partner found!" });
    }

    // Validate input fields
    if (!partnerId || !tokenMoney || !amount) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    //  Generate start and end dates
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(startDate.getMonth() + 1);
    const confirmedPartenerID = await Confirmation.findOne({partnerId})
    if(confirmedPartenerID)return res.status(403).json({success:false, message:"A Subcription with  this  partner Id  already  exist."})
    //  Save the confirmation

  //valigate token 
  if (!/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9]{17}$/.test(tokenMoney)) {
    return next(createError(400, "Le ID de transaction doit contenir 17 caractères, incluant au moins une lettre et un chiffre."));
  }
  
    const newConfirmedPartner = new Confirmation({
      userId,
      partnerId,
      tokenMoney,
      amount,
      startDate,
      endDate
    });

    await newConfirmedPartner.save();

    return res.status(201).json({
      success: true,
      message: "Partner inserted in the system.",
      data: newConfirmedPartner
    });

  } catch (error) {
    console.error(" Error creating confirmation:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

export const getAllConfirmedPartner = async (req, res) => {
  try {
    const confirmedPartners = await Confirmation.find({})
      .populate("userId","username email");

    if (!confirmedPartners || confirmedPartners.length === 0) {
      return res.status(404).json({ success: false, message: "No confirmed partners found." });
    }

    res.status(200).json({
      success: true,
      message: "Confirmed partners retrieved successfully.",
      confirmedPartners
    });
  } catch (error) {
    console.error("Error fetching confirmed partners:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};



export const getAllUnconfirmedPartners = async (req, res) => {
  try {
    const unconfirmedPartners = await Partner.find({
      partnerID: { $nin: await Confirmation.distinct("partnerId") }
    }).populate("userId", "username email");

    if (!unconfirmedPartners || unconfirmedPartners.length === 0) {
      return res.status(404).json({ success: false, message: "No unconfirmed partners found." });
    }

    res.status(200).json({
      success: true,
      message: "Unconfirmed partners retrieved successfully.",
      partners: unconfirmedPartners
    });
  } catch (error) {
    console.error("Error fetching unconfirmed partners:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};
