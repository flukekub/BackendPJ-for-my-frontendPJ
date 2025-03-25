const supabase = require('../config/db.js');

const Dentist = function (dentist) {
    this.dentistID = dentist.dentistid | dentist.dentistID;
    this.name = dentist.name;
    this.experience = dentist.experience;
    this.expertise = dentist.expertise;
};

Dentist.getAll = async () => {
    try {
        const { data, error } = await supabase
            .from('dentists')
            .select('*');

        if (error) {
            throw new Error(error.message);
        }

        console.log("All dentists:", data);
        return data;
    } 
    catch (err) {
        console.error("Get all dentists error:", err);
        throw err;
    }
};

Dentist.findById = async (id) => {
    try {
        const { data, error } = await supabase
            .from('dentists')
            .select('*')
            .eq('dentistid', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                throw { kind: "not_found" };
            }
            throw error;
        }

        console.log("Found dentist:", data);
        return data;
    } 
    catch (err) {
        console.log("Get dentist error:", err);
        throw err;
    }
};

Dentist.create = async (newDentist) => {
    try {
        const { data, error } = await supabase
            .from('dentists')
            .insert([
                {
                    name: newDentist.name,
                    experience: newDentist.experience,
                    expertise: newDentist.expertise
                }
            ])
            .select();
            
        if (error) {
            console.log("Insert error:", error);
            throw new Error(error.message);
        }

        console.log("Created dentist:", data[0]);
        return data[0];
    } 
    catch (err) {
        console.log("Create dentist error:", err);
        throw err;
    }
};

Dentist.updateById = async (id, dentist) => {
    try {
        const { data, error } = await supabase
            .from('dentists')
            .update({
                name: dentist.name,
                experience: dentist.experience,
                expertise: dentist.expertise
            })
            .eq('dentistid', id)
            .select();

        if (error) {
            if (error.code === 'PGRST116') {
                throw { kind: "not_found" };
            }
            throw error;
        }

        if (!data || data.length === 0) {
            throw { kind: "not_found" };
        }

        console.log("Updated dentist:", data[0]);
        return data[0];
    } 
    catch (err) {
        console.log("Update dentist error:", err);
        throw err;
    }
};

Dentist.remove = async (id) => {
    try {
        const { data, error } = await supabase
            .from('dentists')
            .delete()
            .eq('dentistid', id)
            .select();

        if (error) {
            throw error;
        }

        if (!data || data.length === 0) {
            throw { kind: "not_found" };
        }

        console.log("Deleted dentist with ID:", id);
        return data;
    } 
    catch (err) {
        console.log("Delete dentist error:", err);
        throw err;
    }
};

module.exports = Dentist;