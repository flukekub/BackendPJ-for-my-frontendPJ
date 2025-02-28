const Dentist = require("../models/Dentist");

exports.getDentists = async (req, res) => {
    try {
        const data = await Dentist.getAll();

        res.status(200).json({success: true, data});
    } 
    catch (err) {
        res.status(500).json({success: false, message: err.message || "Some error occurred while retrieving all dentists"});
    }
};

exports.getDentist = async (req, res) => {
    const {dentistID} = req.params;

    try {
        const data = await Dentist.findById(dentistID);

        if (!data) {
            return res.status(404).json({success: false, message: `Dentist with ID ${dentistID} not found.`});
        }
        res.status(200).json({success: true, data});
    } 
    catch (err) {
        res.status(500).json({success: false, message: `Error retrieving dentist with ID ${dentistID}.`});
    }
};

exports.createDentist = async (req, res) => {
    const {name, experience, expertise} = req.body;

    if (!name || !experience || !expertise) {
        return res.status(400).json({success: false, message: "All fields (name, experience, expertise) are required!"});
    }

    const newDentist = {name, experience, expertise};

    try {
        const data = await Dentist.create(newDentist);

        res.status(201).json({success: true, data});
    } 
    catch (err) {
        res.status(500).json({success: false, message: err.message || "Error creating dentist"});
    }
};

exports.updateDentist = async (req, res) => {
    const {name, experience, expertise} = req.body;

    try {
        const data = await Dentist.updateById(req.params.dentistID, {name, experience, expertise});

        if (!data) {
            return res.status(404).json({success: false, message: `Dentist with ID ${req.params.dentistID} not found.`});
        }
        res.status(200).json({success: true, data});
    } 
    catch (err) {
        res.status(500).json({success: false, message: `Error updating dentist with ID ${req.params.dentistID}.`});
    }
};

exports.deleteDentist = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({success: false, message: "Content cannot be empty!"});
    }

    const {dentistID} = req.params;

    try {
        const data = await Dentist.remove(dentistID);
        
        if (!data) {
            return res.status(404).json({success: false, message: `Dentist with ID ${dentistID} not found.`});
        }
        res.status(200).json({success: true, message: "Dentist deleted successfully!"});
    } 
    catch (err) {
        res.status(500).json({success: false, message: `Could not delete dentist with ID ${dentistID}.`});
    }
};
