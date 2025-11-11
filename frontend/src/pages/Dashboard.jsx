import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import ApartmentIcon from '@mui/icons-material/Apartment';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { dashboardAPI } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await dashboardAPI.getStats();
      setStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <Typography>Đang tải...</Typography>;
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount || 0);
  };

  const statCards = [
    {
      title: 'Tổng khu trọ',
      value: stats?.stats?.TongKhutro || 0,
      icon: <ApartmentIcon sx={{ fontSize: 40 }} />,
      color: '#1976d2',
    },
    {
      title: 'Tổng phòng trọ',
      value: stats?.stats?.TongPhongtro || 0,
      icon: <MeetingRoomIcon sx={{ fontSize: 40 }} />,
      color: '#2e7d32',
    },
    {
      title: 'Phòng trống',
      value: stats?.stats?.PhongTrong || 0,
      icon: <MeetingRoomIcon sx={{ fontSize: 40 }} />,
      color: '#ed6c02',
    },
    {
      title: 'Tổng khách thuê',
      value: stats?.stats?.TongKhachthue || 0,
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: '#9c27b0',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard Tổng quan
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      {card.title}
                    </Typography>
                    <Typography variant="h4">{card.value}</Typography>
                  </Box>
                  <Box sx={{ color: card.color }}>{card.icon}</Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Doanh thu tháng này
            </Typography>
            <Typography variant="h4" color="primary">
              {formatCurrency(stats?.stats?.DoanhThuThangNay)}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Phòng theo khu trọ
            </Typography>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats?.phongByKhutro || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="Tenkhutro" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="PhongDaThue" fill="#1976d2" name="Đã thuê" />
                <Bar dataKey="PhongTrong" fill="#ed6c02" name="Trống" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Hóa đơn gần đây
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Mã HĐ</TableCell>
                    <TableCell>Khu trọ</TableCell>
                    <TableCell>Phòng</TableCell>
                    <TableCell>Tháng/Năm</TableCell>
                    <TableCell align="right">Tổng tiền</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats?.recentHoadon?.map((row) => (
                    <TableRow key={row.Mahoadon}>
                      <TableCell>{row.Mahoadon}</TableCell>
                      <TableCell>{row.Tenkhutro}</TableCell>
                      <TableCell>{row.Tenphong}</TableCell>
                      <TableCell>
                        {row.Thang}/{row.Nam}
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(row.Tongtien)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
