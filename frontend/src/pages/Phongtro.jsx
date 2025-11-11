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
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { phongtroAPI, khutroAPI } from '../services/api';

export default function Phongtro() {
  const [phongtroList, setPhongtroList] = useState([]);
  const [khutroList, setKhutroList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPhongtro, setCurrentPhongtro] = useState({
    maphong: '',
    tenphong: '',
    giathue: '',
    tinhtrang: 'Trống',
    makhutro: '',
  });

  useEffect(() => {
    fetchPhongtro();
    fetchKhutro();
  }, []);

  const fetchPhongtro = async () => {
    try {
      const response = await phongtroAPI.getAll();
      setPhongtroList(response.data);
    } catch (error) {
      console.error('Error fetching phongtro:', error);
    }
  };

  const fetchKhutro = async () => {
    try {
      const response = await khutroAPI.getAll();
      setKhutroList(response.data);
    } catch (error) {
      console.error('Error fetching khutro:', error);
    }
  };

  const handleOpenDialog = (phongtro = null) => {
    if (phongtro) {
      setCurrentPhongtro({
        maphong: phongtro.Maphong,
        tenphong: phongtro.Tenphong,
        giathue: phongtro.Giathue,
        tinhtrang: phongtro.Tinhtrang,
        makhutro: phongtro.Makhutro,
      });
      setEditMode(true);
    } else {
      setCurrentPhongtro({
        maphong: '',
        tenphong: '',
        giathue: '',
        tinhtrang: 'Trống',
        makhutro: '',
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
        await phongtroAPI.update(currentPhongtro.maphong, currentPhongtro);
      } else {
        await phongtroAPI.create(currentPhongtro);
      }
      fetchPhongtro();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving phongtro:', error);
      alert('Có lỗi xảy ra: ' + error.response?.data?.error || error.message);
    }
  };

  const handleDelete = async (maphong) => {
    if (window.confirm('Bạn có chắc muốn xóa phòng trọ này?')) {
      try {
        await phongtroAPI.delete(maphong);
        fetchPhongtro();
      } catch (error) {
        console.error('Error deleting phongtro:', error);
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

  const getTinhTrangColor = (tinhtrang) => {
    switch (tinhtrang) {
      case 'Trống':
        return 'success';
      case 'Đã thuê':
        return 'error';
      case 'Đang sửa chữa':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Quản lý Phòng trọ</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Thêm phòng trọ
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã phòng</TableCell>
              <TableCell>Tên phòng</TableCell>
              <TableCell>Khu trọ</TableCell>
              <TableCell align="right">Giá thuê</TableCell>
              <TableCell>Tình trạng</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {phongtroList.map((row) => (
              <TableRow key={row.Maphong}>
                <TableCell>{row.Maphong}</TableCell>
                <TableCell>{row.Tenphong}</TableCell>
                <TableCell>{row.Tenkhutro}</TableCell>
                <TableCell align="right">{formatCurrency(row.Giathue)}</TableCell>
                <TableCell>
                  <Chip
                    label={row.Tinhtrang}
                    color={getTinhTrangColor(row.Tinhtrang)}
                    size="small"
                  />
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
                    onClick={() => handleDelete(row.Maphong)}
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
          {editMode ? 'Chỉnh sửa phòng trọ' : 'Thêm phòng trọ mới'}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Mã phòng"
            fullWidth
            value={currentPhongtro.maphong}
            onChange={(e) =>
              setCurrentPhongtro({ ...currentPhongtro, maphong: e.target.value })
            }
            disabled={editMode}
          />
          <TextField
            margin="dense"
            label="Tên phòng"
            fullWidth
            value={currentPhongtro.tenphong}
            onChange={(e) =>
              setCurrentPhongtro({ ...currentPhongtro, tenphong: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Giá thuê"
            fullWidth
            type="number"
            value={currentPhongtro.giathue}
            onChange={(e) =>
              setCurrentPhongtro({ ...currentPhongtro, giathue: e.target.value })
            }
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Khu trọ</InputLabel>
            <Select
              value={currentPhongtro.makhutro}
              label="Khu trọ"
              onChange={(e) =>
                setCurrentPhongtro({ ...currentPhongtro, makhutro: e.target.value })
              }
            >
              {khutroList.map((khutro) => (
                <MenuItem key={khutro.Makhutro} value={khutro.Makhutro}>
                  {khutro.Tenkhutro}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Tình trạng</InputLabel>
            <Select
              value={currentPhongtro.tinhtrang}
              label="Tình trạng"
              onChange={(e) =>
                setCurrentPhongtro({ ...currentPhongtro, tinhtrang: e.target.value })
              }
            >
              <MenuItem value="Trống">Trống</MenuItem>
              <MenuItem value="Đã thuê">Đã thuê</MenuItem>
              <MenuItem value="Đang sửa chữa">Đang sửa chữa</MenuItem>
            </Select>
          </FormControl>
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
