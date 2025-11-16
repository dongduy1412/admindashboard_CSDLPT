const { getConnection, sql } = require('../config/database');

const getAllKhachthue = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query(`
            SELECT k.* 
            FROM Khachthue k
        `);
        res.json(result.recordset);
    } catch (err) {
        console.error('Error getting Khachthue:', err);
        res.status(500).json({ error: err.message });
    }
};

const getKhachthueById = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('makhachthue', sql.NVarChar, req.params.id)
            .query(`
                SELECT k.*, n.Tendangnhap, n.Vaitro 
                FROM Khachthue k
                WHERE k.Makhachthue = @makhachthue
            `);
        
        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'Khachthue not found' });
        }
        res.json(result.recordset[0]);
    } catch (err) {
        console.error('Error getting Khachthue by ID:', err);
        res.status(500).json({ error: err.message });
    }
};

const createKhachthue = async (req, res) => {
    try {
        const { makhachthue, hoten, cccd, sodienthoai} = req.body;
        const pool = await getConnection();
        
        await pool.request()
            .input('makhachthue', sql.NVarChar, makhachthue)
            .input('hoten', sql.NVarChar, hoten)
            .input('cccd', sql.VarChar, cccd)
            .input('sodienthoai', sql.VarChar, sodienthoai)
            .query(`
                INSERT INTO Khachthue (Makhachthue, Hoten, CCCD, Sodienthoai) 
                VALUES (@makhachthue, @hoten, @cccd, @sodienthoai)
            `);
        
        res.status(201).json({ message: 'Khachthue created successfully', makhachthue });
    } catch (err) {
        console.error('Error creating Khachthue:', err);
        res.status(500).json({ error: err.message });
    }
};

const updateKhachthue = async (req, res) => {
    try {
        const { hoten, cccd, sodienthoai } = req.body;
        const pool = await getConnection();
        
        const result = await pool.request()
            .input('makhachthue', sql.NVarChar, req.params.id)
            .input('hoten', sql.NVarChar, hoten)
            .input('cccd', sql.VarChar, cccd)
            .input('sodienthoai', sql.VarChar, sodienthoai)
            .query(`
                UPDATE Khachthue 
                SET Hoten = @hoten, CCCD = @cccd, Sodienthoai = @sodienthoai 
                WHERE Makhachthue = @makhachthue
            `);
        
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: 'Khachthue not found' });
        }
        res.json({ message: 'Khachthue updated successfully' });
    } catch (err) {
        console.error('Error updating Khachthue:', err);
        res.status(500).json({ error: err.message });
    }
};

const deleteKhachthue = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('makhachthue', sql.NVarChar, req.params.id)
            .query('DELETE FROM Khachthue WHERE Makhachthue = @makhachthue');
        
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: 'Khachthue not found' });
        }
        res.json({ message: 'Khachthue deleted successfully' });
    } catch (err) {
        console.error('Error deleting Khachthue:', err);
        res.status(500).json({ error: err.message });
    }
};


const getKhachthueWithHopdong = async (req, res) => {
    const mahopdong = req.params.id;
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('mahopdong', sql.NVarChar, mahopdong)
            .query(`
                SELECT k.*
                FROM Khachthue k
                INNER JOIN Hopdong_Khachthue hk ON k.Makhachthue = hk.Makhachthue
                WHERE hk.Mahopdong = @mahopdong;
            `);
        res.json(result.recordset);
    } catch (err) {
        console.error('Error getting Khachthue:', err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAllKhachthue,
    getKhachthueById,
    createKhachthue,
    updateKhachthue,
    deleteKhachthue,
    getKhachthueWithHopdong
};
