const { getConnection, sql } = require('../config/database');

const getAllNguoidung = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query(`
            SELECT n.Manguoidung, n.Tendangnhap, n.Vaitro, n.Makhutro, k.Tenkhutro
            FROM Nguoidung n
            LEFT JOIN Khutro k ON n.Makhutro = k.Makhutro
        `);
        res.json(result.recordset);
    } catch (err) {
        console.error('Error getting Nguoidung:', err);
        res.status(500).json({ error: err.message });
    }
};

const getNguoidungById = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('manguoidung', sql.Int, req.params.id)
            .query(`
                SELECT n.Manguoidung, n.Tendangnhap, n.Vaitro, n.Makhutro, k.Tenkhutro
                FROM Nguoidung n
                LEFT JOIN Khutro k ON n.Makhutro = k.Makhutro
                WHERE n.Manguoidung = @manguoidung
            `);
        
        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'Nguoidung not found' });
        }
        res.json(result.recordset[0]);
    } catch (err) {
        console.error('Error getting Nguoidung by ID:', err);
        res.status(500).json({ error: err.message });
    }
};

const createNguoidung = async (req, res) => {
    try {
        const { tendangnhap, matkhau, vaitro, makhutro } = req.body;
        const pool = await getConnection();
        
        await pool.request()
            .input('tendangnhap', sql.VarChar, tendangnhap)
            .input('matkhau', sql.NVarChar, matkhau)
            .input('vaitro', sql.NVarChar, vaitro)
            .input('makhutro', sql.NVarChar, makhutro)
            .query(`
                INSERT INTO Nguoidung (Tendangnhap, Matkhau, Vaitro, Makhutro) 
                VALUES (@tendangnhap, @matkhau, @vaitro, @makhutro)
            `);
        
        const result = await pool.request().query('SELECT SCOPE_IDENTITY() AS Manguoidung');
        const manguoidung = result.recordset[0].Manguoidung;
        
        res.status(201).json({ message: 'Nguoidung created successfully', manguoidung });
    } catch (err) {
        console.error('Error creating Nguoidung:', err);
        res.status(500).json({ error: err.message });
    }
};

const updateNguoidung = async (req, res) => {
    try {
        const { tendangnhap, matkhau, vaitro, makhutro } = req.body;
        const pool = await getConnection();
        
        let query = `UPDATE Nguoidung SET Tendangnhap = @tendangnhap, Vaitro = @vaitro, Makhutro = @makhutro`;
        const request = pool.request()
            .input('manguoidung', sql.Int, req.params.id)
            .input('tendangnhap', sql.VarChar, tendangnhap)
            .input('vaitro', sql.NVarChar, vaitro)
            .input('makhutro', sql.NVarChar, makhutro);
        
        if (matkhau) {
            query += `, Matkhau = @matkhau`;
            request.input('matkhau', sql.NVarChar, matkhau);
        }
        
        query += ` WHERE Manguoidung = @manguoidung`;
        const result = await request.query(query);
        
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: 'Nguoidung not found' });
        }
        res.json({ message: 'Nguoidung updated successfully' });
    } catch (err) {
        console.error('Error updating Nguoidung:', err);
        res.status(500).json({ error: err.message });
    }
};

const deleteNguoidung = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('manguoidung', sql.Int, req.params.id)
            .query('DELETE FROM Nguoidung WHERE Manguoidung = @manguoidung');
        
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: 'Nguoidung not found' });
        }
        res.json({ message: 'Nguoidung deleted successfully' });
    } catch (err) {
        console.error('Error deleting Nguoidung:', err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAllNguoidung,
    getNguoidungById,
    createNguoidung,
    updateNguoidung,
    deleteNguoidung
};
