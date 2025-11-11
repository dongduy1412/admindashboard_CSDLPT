import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { hoadonAPI, hopdongAPI } from '../services/api';

export default function Hoadon() {
  const [hoadonList, setHoadonList] = useState([]);
  const [hopdongList, setHopdongList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentHoadon, setCurrentHoadon] = useState({
    mahoadon: '',
    mahopdong: '',
    thang: '',
    nam: '',
    tienphong: '',
    tiendien: '',
    tiennuoc: '',
    tiendichvu: '',
  });

  useEffect(() => {
    fetchHoadon();
    fetchHopdong();
  }, []);

  const fetchHoadon = async () => {
    try {
      const response = await hoadonAPI.getAll();
      setHoadonList(response.data);
    } catch (error) {
      console.error('Error fetching hoadon:', error);
    }
  };

  const fetchHopdong = async () => {
    try {
      const response = await hopdongAPI.getAll();
      setHopdongList(response.data);
    } catch (error) {
      console.error('Error fetching hopdong:', error);
    }
  };

  const handleOpenDialog = (hoadon = null) => {
    if (hoadon) {
      setCurrentHoadon({
        mahoadon: hoadon.Mahoadon,
        mahopdong: hoadon.Mahopdong,
        thang: hoadon.Thang,
        nam: hoadon.Nam,
        tienphong: hoadon.Tienphong,
        tiendien: hoadon.Tiendien,
        tiennuoc: hoadon.Tiennuoc,
        tiendichvu: hoadon.Tiendichvu,
      });
      setEditMode(true);
    } else {
      const currentDate = new Date();
      setCurrentHoadon({
        mahoadon: '',
        mahopdong: '',
        thang: currentDate.getMonth() + 1,
        nam: currentDate.getFullYear(),
        tienphong: '',
        tiendien: '',
        tiennuoc: '',
        tiendichvu: '',
      });
      setEditMode(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSave = async () => {
    try {
      if (editMode) {
        await hoadonAPI.update(currentHoadon.mahoadon, currentHoadon);
      } else {
        await hoadonAPI.create(currentHoadon);
      }
      fetchHoadon();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving hoadon:', error);
      alert('Có lỗi xảy ra: ' + error.response?.data?.error || error.message);
    }
  };

  const handleDelete = async (mahoadon) => {
    if (window.confirm('Bạn có chắc muốn xóa hóa đơn này?')) {
      try {
        await hoadonAPI.delete(mahoadon);
        fetchHoadon();
      } catch (error) {
        console.error('Error deleting hoadon:', error);
        alert('Có lỗi xảy ra: ' + error.response?.data?.error || error.message);
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Quản lý Hóa đơn</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Thêm hóa đơn
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã HĐ</TableCell>
              <TableCell>Khu trọ</TableCell>
              <TableCell>Phòng</TableCell>
              <TableCell>Tháng/Năm</TableCell>
              <TableCell align="right">Tiền phòng</TableCell>
              <TableCell align="right">Tiền điện</TableCell>
              <TableCell align="right">Tiền nước</TableCell>
              <TableCell align="right">Tiền DV</TableCell>
              <TableCell align="right">Tổng tiền</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {hoadonList.map((row) => (
              <TableRow key={row.Mahoadon}>
                <TableCell>{row.Mahoadon}</TableCell>
                <TableCell>{row.Tenkhutro}</TableCell>
                <TableCell>{row.Tenphong}</TableCell>
                <TableCell>
                  {row.Thang}/{row.Nam}
                </TableCell>
                <TableCell align="right">
                  {formatCurrency(row.Tienphong)}
                </TableCell>
                <TableCell align="right">
                  {formatCurrency(row.Tiendien)}
                </TableCell>
                <TableCell align="right">
                  {formatCurrency(row.Tiennuoc)}
                </TableCell>
                <TableCell align="right">
                  {formatCurrency(row.Tiendichvu)}
                </TableCell>
                <TableCell align="right">
                  {formatCurrency(row.Tongtien)}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(row)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(row.Mahoadon)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editMode ? 'Chỉnh sửa hóa đơn' : 'Thêm hóa đơn mới'}
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Hợp đồng</InputLabel>
            <Select
              value={currentHoadon.mahopdong}
              label="Hợp đồng"
              onChange={(e) =>
                setCurrentHoadon({ ...currentHoadon, mahopdong: e.target.value })
              }
            >
              {hopdongList.map((hopdong) => (
                <MenuItem key={hopdong.Mahopdong} value={hopdong.Mahopdong}>
                  HĐ {hopdong.Mahopdong} - {hopdong.Tenkhutro} - {hopdong.Tenphong}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              margin="dense"
              label="Tháng"
              type="number"
              fullWidth
              value={currentHoadon.thang}
              onChange={(e) =>
                setCurrentHoadon({ ...currentHoadon, thang: e.target.value })
              }
              inputProps={{ min: 1, max: 12 }}
            />
            <TextField
              margin="dense"
              label="Năm"
              type="number"
              fullWidth
              value={currentHoadon.nam}
              onChange={(e) =>
                setCurrentHoadon({ ...currentHoadon, nam: e.target.value })
              }
            />
          </Box>
          <TextField
            margin="dense"
            label="Tiền phòng"
            type="number"
            fullWidth
            value={currentHoadon.tienphong}
            onChange={(e) =>
              setCurrentHoadon({ ...currentHoadon, tienphong: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Tiền điện"
            type="number"
            fullWidth
            value={currentHoadon.tiendien}
            onChange={(e) =>
              setCurrentHoadon({ ...currentHoadon, tiendien: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Tiền nước"
            type="number"
            fullWidth
            value={currentHoadon.tiennuoc}
            onChange={(e) =>
              setCurrentHoadon({ ...currentHoadon, tiennuoc: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Tiền dịch vụ"
            type="number"
            fullWidth
            value={currentHoadon.tiendichvu}
            onChange={(e) =>
              setCurrentHoadon({ ...currentHoadon, tiendichvu: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleSave} variant="contained">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
