const { getConnection, sql } = require('../config/database');

const getAllHoadon = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query(`
            SELECT h.*, hd.Ngaybatdau, p.Tenphong, k.Tenkhutro
            FROM Hoadon h
            LEFT JOIN Hopdong hd ON h.Mahopdong = hd.Mahopdong
            LEFT JOIN Phongtro p ON hd.Maphong = p.Maphong
            LEFT JOIN Khutro k ON p.Makhutro = k.Makhutro
            ORDER BY h.Nam DESC, h.Thang DESC
        `);
        res.json(result.recordset);
    } catch (err) {
        console.error('Error getting Hoadon:', err);
        res.status(500).json({ error: err.message });
    }
};

const getHoadonById = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('mahoadon', sql.Int, req.params.id)
            .query(`
                SELECT h.*, hd.Ngaybatdau, hd.Ngayketthuc, p.Tenphong, p.Giathue, k.Tenkhutro
                FROM Hoadon h
                LEFT JOIN Hopdong hd ON h.Mahopdong = hd.Mahopdong
                LEFT JOIN Phongtro p ON hd.Maphong = p.Maphong
                LEFT JOIN Khutro k ON p.Makhutro = k.Makhutro
                WHERE h.Mahoadon = @mahoadon
            `);
        
        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'Hoadon not found' });
        }
        res.json(result.recordset[0]);
    } catch (err) {
        console.error('Error getting Hoadon by ID:', err);
        res.status(500).json({ error: err.message });
    }
};

const getHoadonByHopdong = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('mahopdong', sql.Int, req.params.mahopdong)
            .query(`
                SELECT * FROM Hoadon 
                WHERE Mahopdong = @mahopdong
                ORDER BY Nam DESC, Thang DESC
            `);
        res.json(result.recordset);
    } catch (err) {
        console.error('Error getting Hoadon by Hopdong:', err);
        res.status(500).json({ error: err.message });
    }
};

const createHoadon = async (req, res) => {
    try {
        const { mahopdong, thang, nam, tienphong, tiendien, tiennuoc, tiendichvu } = req.body;
        const pool = await getConnection();
        
        await pool.request()
            .input('mahopdong', sql.Int, mahopdong)
            .input('thang', sql.Int, thang)
            .input('nam', sql.Int, nam)
            .input('tienphong', sql.Decimal(18, 2), tienphong)
            .input('tiendien', sql.Decimal(18, 2), tiendien)
            .input('tiennuoc', sql.Decimal(18, 2), tiennuoc)
            .input('tiendichvu', sql.Decimal(18, 2), tiendichvu)
            .query(`
                INSERT INTO Hoadon (Mahopdong, Thang, Nam, Tienphong, Tiendien, Tiennuoc, Tiendichvu) 
                VALUES (@mahopdong, @thang, @nam, @tienphong, @tiendien, @tiennuoc, @tiendichvu)
            `);
        
        const result = await pool.request().query('SELECT SCOPE_IDENTITY() AS Mahoadon');
        const mahoadon = result.recordset[0].Mahoadon;
        
        res.status(201).json({ message: 'Hoadon created successfully', mahoadon });
    } catch (err) {
        console.error('Error creating Hoadon:', err);
        res.status(500).json({ error: err.message });
    }
};

const updateHoadon = async (req, res) => {
    try {
        const { mahopdong, thang, nam, tienphong, tiendien, tiennuoc, tiendichvu } = req.body;
        const pool = await getConnection();
        
        const result = await pool.request()
            .input('mahoadon', sql.Int, req.params.id)
            .input('mahopdong', sql.Int, mahopdong)
            .input('thang', sql.Int, thang)
            .input('nam', sql.Int, nam)
            .input('tienphong', sql.Decimal(18, 2), tienphong)
            .input('tiendien', sql.Decimal(18, 2), tiendien)
            .input('tiennuoc', sql.Decimal(18, 2), tiennuoc)
            .input('tiendichvu', sql.Decimal(18, 2), tiendichvu)
            .query(`
                UPDATE Hoadon 
                SET Mahopdong = @mahopdong, Thang = @thang, Nam = @nam, 
                    Tienphong = @tienphong, Tiendien = @tiendien, 
                    Tiennuoc = @tiennuoc, Tiendichvu = @tiendichvu 
                WHERE Mahoadon = @mahoadon
            `);
        
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: 'Hoadon not found' });
        }
        res.json({ message: 'Hoadon updated successfully' });
    } catch (err) {
        console.error('Error updating Hoadon:', err);
        res.status(500).json({ error: err.message });
    }
};

const deleteHoadon = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('mahoadon', sql.Int, req.params.id)
            .query('DELETE FROM Hoadon WHERE Mahoadon = @mahoadon');
        
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: 'Hoadon not found' });
        }
        res.json({ message: 'Hoadon deleted successfully' });
    } catch (err) {
        console.error('Error deleting Hoadon:', err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAllHoadon,
    getHoadonById,
    getHoadonByHopdong,
    createHoadon,
    updateHoadon,
    deleteHoadon
};
