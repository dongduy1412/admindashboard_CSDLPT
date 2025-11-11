const { getConnection, sql } = require('../config/database');

const getAllKhutro = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query('SELECT * FROM Khutro');
        res.json(result.recordset);
    } catch (err) {
        console.error('Error getting Khutro:', err);
        res.status(500).json({ error: err.message });
    }
};

const getKhutroById = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('makhutro', sql.NVarChar, req.params.id)
            .query('SELECT * FROM Khutro WHERE Makhutro = @makhutro');
        
        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'Khutro not found' });
        }
        res.json(result.recordset[0]);
    } catch (err) {
        console.error('Error getting Khutro by ID:', err);
        res.status(500).json({ error: err.message });
    }
};

const createKhutro = async (req, res) => {
    try {
        const { makhutro, tenkhutro, diachi } = req.body;
        const pool = await getConnection();
        
        await pool.request()
            .input('makhutro', sql.NVarChar, makhutro)
            .input('tenkhutro', sql.NVarChar, tenkhutro)
            .input('diachi', sql.NVarChar, diachi)
            .query('INSERT INTO Khutro (Makhutro, Tenkhutro, Diachi) VALUES (@makhutro, @tenkhutro, @diachi)');
        
        res.status(201).json({ message: 'Khutro created successfully', makhutro });
    } catch (err) {
        console.error('Error creating Khutro:', err);
        res.status(500).json({ error: err.message });
    }
};

const updateKhutro = async (req, res) => {
    try {
        const { tenkhutro, diachi } = req.body;
        const pool = await getConnection();
        
        const result = await pool.request()
            .input('makhutro', sql.NVarChar, req.params.id)
            .input('tenkhutro', sql.NVarChar, tenkhutro)
            .input('diachi', sql.NVarChar, diachi)
            .query('UPDATE Khutro SET Tenkhutro = @tenkhutro, Diachi = @diachi WHERE Makhutro = @makhutro');
        
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: 'Khutro not found' });
        }
        res.json({ message: 'Khutro updated successfully' });
    } catch (err) {
        console.error('Error updating Khutro:', err);
        res.status(500).json({ error: err.message });
    }
};

const deleteKhutro = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('makhutro', sql.NVarChar, req.params.id)
            .query('DELETE FROM Khutro WHERE Makhutro = @makhutro');
        
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: 'Khutro not found' });
        }
        res.json({ message: 'Khutro deleted successfully' });
    } catch (err) {
        console.error('Error deleting Khutro:', err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAllKhutro,
    getKhutroById,
    createKhutro,
    updateKhutro,
    deleteKhutro
};
