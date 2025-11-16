const { getConnection, sql } = require('../config/database');

const getAllPhongtro = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query(`
            SELECT p.*, k.Tenkhutro 
            FROM Phongtro p
            LEFT JOIN Khutro k ON p.Makhutro = k.Makhutro
        `);
        res.json(result.recordset);
    } catch (err) {
        console.error('Error getting Phongtro:', err);
        res.status(500).json({ error: err.message });
    }
};

const getAllOK = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query(`
            SELECT p.*, k.Tenkhutro 
            FROM Phongtro p
            LEFT JOIN Khutro k ON p.Makhutro = k.Makhutro
        `);
        res.json(result.recordset);
    } catch (err) {
        console.error('Error getting Phongtro:', err);
        res.status(500).json({ error: err.message });
    }
};

const getPhongtroById = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('maphong', sql.NVarChar, req.params.id)
            .query(`
                SELECT p.*, k.Tenkhutro 
                FROM Phongtro p
                LEFT JOIN Khutro k ON p.Makhutro = k.Makhutro
                WHERE p.Maphong = @maphong
            `);
        
        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'Phongtro not found' });
        }
        res.json(result.recordset[0]);
    } catch (err) {
        console.error('Error getting Phongtro by ID:', err);
        res.status(500).json({ error: err.message });
    }
};

const createPhongtro = async (req, res) => {
    try {
        const { maphong, tenphong, giathue, tinhtrang, makhutro } = req.body;
        const pool = await getConnection();
        
        await pool.request()
            .input('maphong', sql.NVarChar, maphong)
            .input('tenphong', sql.NVarChar, tenphong)
            .input('giathue', sql.Decimal(18, 2), giathue)
            .input('tinhtrang', sql.NVarChar, tinhtrang)
            .input('makhutro', sql.NVarChar, makhutro)
            .query(`
                INSERT INTO Phongtro (Maphong, Tenphong, Giathue, Tinhtrang, Makhutro) 
                VALUES (@maphong, @tenphong, @giathue, @tinhtrang, @makhutro)
            `);
        
        res.status(201).json({ message: 'Phongtro created successfully', maphong });
    } catch (err) {
        console.error('Error creating Phongtro:', err);
        res.status(500).json({ error: err.message });
    }
};

const updatePhongtro = async (req, res) => {
    try {
        const { tenphong, giathue, tinhtrang, makhutro } = req.body;
        const pool = await getConnection();
        
        const result = await pool.request()
            .input('maphong', sql.NVarChar, req.params.id)
            .input('tenphong', sql.NVarChar, tenphong)
            .input('giathue', sql.Decimal(18, 2), giathue)
            .input('tinhtrang', sql.NVarChar, tinhtrang)
            .input('makhutro', sql.NVarChar, makhutro)
            .query(`
                UPDATE Phongtro 
                SET Tenphong = @tenphong, Giathue = @giathue, Tinhtrang = @tinhtrang, Makhutro = @makhutro 
                WHERE Maphong = @maphong
            `);
        
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: 'Phongtro not found' });
        }
        res.json({ message: 'Phongtro updated successfully' });
    } catch (err) {
        console.error('Error updating Phongtro:', err);
        res.status(500).json({ error: err.message });
    }
};

const deletePhongtro = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('maphong', sql.NVarChar, req.params.id)
            .query('DELETE FROM Phongtro WHERE Maphong = @maphong');
        
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: 'Phongtro not found' });
        }
        res.json({ message: 'Phongtro deleted successfully' });
    } catch (err) {
        console.error('Error deleting Phongtro:', err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAllPhongtro,
    getAllOK, 
    getPhongtroById,
    createPhongtro,
    updatePhongtro,
    deletePhongtro
};
