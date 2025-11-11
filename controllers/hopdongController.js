const { getConnection, sql } = require('../config/database');

const getAllHopdong = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query(`
            SELECT h.*, p.Tenphong, p.Giathue, k.Tenkhutro
            FROM Hopdong h
            LEFT JOIN Phongtro p ON h.Maphong = p.Maphong
            LEFT JOIN Khutro k ON p.Makhutro = k.Makhutro
        `);
        res.json(result.recordset);
    } catch (err) {
        console.error('Error getting Hopdong:', err);
        res.status(500).json({ error: err.message });
    }
};

const getHopdongById = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('mahopdong', sql.Int, req.params.id)
            .query(`
                SELECT h.*, p.Tenphong, p.Giathue, k.Tenkhutro
                FROM Hopdong h
                LEFT JOIN Phongtro p ON h.Maphong = p.Maphong
                LEFT JOIN Khutro k ON p.Makhutro = k.Makhutro
                WHERE h.Mahopdong = @mahopdong
            `);
        
        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'Hopdong not found' });
        }
        res.json(result.recordset[0]);
    } catch (err) {
        console.error('Error getting Hopdong by ID:', err);
        res.status(500).json({ error: err.message });
    }
};

const getHopdongWithKhachthue = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('mahopdong', sql.Int, req.params.id)
            .query(`
                SELECT 
                    h.Mahopdong, h.Ngaybatdau, h.Ngayketthuc, h.Tiencoc,
                    p.Maphong, p.Tenphong, p.Giathue,
                    k.Tenkhutro,
                    kt.Makhachthue, kt.Hoten, kt.CCCD, kt.Sodienthoai,
                    hdk.Lakhachchinh, hdk.Ngaythamgia
                FROM Hopdong h
                LEFT JOIN Phongtro p ON h.Maphong = p.Maphong
                LEFT JOIN Khutro k ON p.Makhutro = k.Makhutro
                LEFT JOIN Hopdong_Khachthue hdk ON h.Mahopdong = hdk.Mahopdong
                LEFT JOIN Khachthue kt ON hdk.Makhachthue = kt.Makhachthue
                WHERE h.Mahopdong = @mahopdong
            `);
        res.json(result.recordset);
    } catch (err) {
        console.error('Error getting Hopdong with Khachthue:', err);
        res.status(500).json({ error: err.message });
    }
};

const createHopdong = async (req, res) => {
    try {
        const { ngaybatdau, ngayketthuc, tiencoc, maphong } = req.body;
        const pool = await getConnection();
        
        await pool.request()
            .input('ngaybatdau', sql.Date, ngaybatdau)
            .input('ngayketthuc', sql.Date, ngayketthuc)
            .input('tiencoc', sql.Decimal(18, 2), tiencoc)
            .input('maphong', sql.NVarChar, maphong)
            .query(`
                INSERT INTO Hopdong (Ngaybatdau, Ngayketthuc, Tiencoc, Maphong) 
                VALUES (@ngaybatdau, @ngayketthuc, @tiencoc, @maphong)
            `);
        
        const result = await pool.request().query('SELECT SCOPE_IDENTITY() AS Mahopdong');
        const mahopdong = result.recordset[0].Mahopdong;
        
        res.status(201).json({ message: 'Hopdong created successfully', mahopdong });
    } catch (err) {
        console.error('Error creating Hopdong:', err);
        res.status(500).json({ error: err.message });
    }
};

const updateHopdong = async (req, res) => {
    try {
        const { ngaybatdau, ngayketthuc, tiencoc, maphong } = req.body;
        const pool = await getConnection();
        
        const result = await pool.request()
            .input('mahopdong', sql.Int, req.params.id)
            .input('ngaybatdau', sql.Date, ngaybatdau)
            .input('ngayketthuc', sql.Date, ngayketthuc)
            .input('tiencoc', sql.Decimal(18, 2), tiencoc)
            .input('maphong', sql.NVarChar, maphong)
            .query(`
                UPDATE Hopdong 
                SET Ngaybatdau = @ngaybatdau, Ngayketthuc = @ngayketthuc, 
                    Tiencoc = @tiencoc, Maphong = @maphong 
                WHERE Mahopdong = @mahopdong
            `);
        
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: 'Hopdong not found' });
        }
        res.json({ message: 'Hopdong updated successfully' });
    } catch (err) {
        console.error('Error updating Hopdong:', err);
        res.status(500).json({ error: err.message });
    }
};

const deleteHopdong = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('mahopdong', sql.Int, req.params.id)
            .query('DELETE FROM Hopdong WHERE Mahopdong = @mahopdong');
        
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: 'Hopdong not found' });
        }
        res.json({ message: 'Hopdong deleted successfully' });
    } catch (err) {
        console.error('Error deleting Hopdong:', err);
        res.status(500).json({ error: err.message });
    }
};

const addKhachthueToHopdong = async (req, res) => {
    try {
        const { mahopdong, makhachthue, lakhachchinh, ngaythamgia } = req.body;
        const pool = await getConnection();
        
        await pool.request()
            .input('mahopdong', sql.Int, mahopdong)
            .input('makhachthue', sql.NVarChar, makhachthue)
            .input('lakhachchinh', sql.Bit, lakhachchinh)
            .input('ngaythamgia', sql.Date, ngaythamgia)
            .query(`
                INSERT INTO Hopdong_Khachthue (Mahopdong, Makhachthue, Lakhachchinh, Ngaythamgia) 
                VALUES (@mahopdong, @makhachthue, @lakhachchinh, @ngaythamgia)
            `);
        
        res.status(201).json({ message: 'Khachthue added to Hopdong successfully' });
    } catch (err) {
        console.error('Error adding Khachthue to Hopdong:', err);
        res.status(500).json({ error: err.message });
    }
};

const removeKhachthueFromHopdong = async (req, res) => {
    try {
        const { mahopdong, makhachthue } = req.params;
        const pool = await getConnection();
        
        const result = await pool.request()
            .input('mahopdong', sql.Int, mahopdong)
            .input('makhachthue', sql.NVarChar, makhachthue)
            .query('DELETE FROM Hopdong_Khachthue WHERE Mahopdong = @mahopdong AND Makhachthue = @makhachthue');
        
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: 'Khachthue not found in Hopdong' });
        }
        res.json({ message: 'Khachthue removed from Hopdong successfully' });
    } catch (err) {
        console.error('Error removing Khachthue from Hopdong:', err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAllHopdong,
    getHopdongById,
    getHopdongWithKhachthue,
    createHopdong,
    updateHopdong,
    deleteHopdong,
    addKhachthueToHopdong,
    removeKhachthueFromHopdong
};
