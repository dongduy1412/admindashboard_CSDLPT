const { getConnection } = require('../config/database');

const getDashboardStats = async (req, res) => {
    try {
        const pool = await getConnection();
        
        const statsQuery = `
            SELECT 
                (SELECT COUNT(*) FROM Khutro) AS TongKhutro,
                (SELECT COUNT(*) FROM Phongtro) AS TongPhongtro,
                (SELECT COUNT(*) FROM Phongtro WHERE Tinhtrang = N'Trống') AS PhongTrong,
                (SELECT COUNT(*) FROM Phongtro WHERE Tinhtrang = N'Đã thuê') AS PhongDaThue,
                (SELECT COUNT(*) FROM Khachthue) AS TongKhachthue,
                (SELECT COUNT(*) FROM Hopdong) AS TongHopdong,
                (SELECT SUM(Tongtien) FROM Hoadon WHERE Thang = MONTH(GETDATE()) AND Nam = YEAR(GETDATE())) AS DoanhThuThangNay
        `;
        
        const stats = await pool.request().query(statsQuery);
        
        const recentHoadonQuery = `
            SELECT TOP 5 h.*, p.Tenphong, k.Tenkhutro
            FROM Hoadon h
            LEFT JOIN Hopdong hd ON h.Mahopdong = hd.Mahopdong
            LEFT JOIN Phongtro p ON hd.Maphong = p.Maphong
            LEFT JOIN Khutro k ON p.Makhutro = k.Makhutro
            ORDER BY h.Nam DESC, h.Thang DESC, h.Mahoadon DESC
        `;
        
        const recentHoadon = await pool.request().query(recentHoadonQuery);
        
        const phongByKhutroQuery = `
            SELECT 
                k.Tenkhutro,
                COUNT(p.Maphong) AS TongPhong,
                SUM(CASE WHEN p.Tinhtrang = N'Đã thuê' THEN 1 ELSE 0 END) AS PhongDaThue,
                SUM(CASE WHEN p.Tinhtrang = N'Trống' THEN 1 ELSE 0 END) AS PhongTrong
            FROM Khutro k
            LEFT JOIN Phongtro p ON k.Makhutro = p.Makhutro
            GROUP BY k.Tenkhutro
        `;
        
        const phongByKhutro = await pool.request().query(phongByKhutroQuery);
        
        const doanhThuTheoThangQuery = `
            SELECT 
                Thang,
                Nam,
                SUM(Tongtien) AS TongDoanhThu
            FROM Hoadon
            WHERE Nam = YEAR(GETDATE())
            GROUP BY Thang, Nam
            ORDER BY Thang
        `;
        
        const doanhThuTheoThang = await pool.request().query(doanhThuTheoThangQuery);
        
        res.json({
            stats: stats.recordset[0],
            recentHoadon: recentHoadon.recordset,
            phongByKhutro: phongByKhutro.recordset,
            doanhThuTheoThang: doanhThuTheoThang.recordset
        });
    } catch (err) {
        console.error('Error getting dashboard stats:', err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getDashboardStats
};
