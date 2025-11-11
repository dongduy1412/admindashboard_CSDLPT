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
import { nguoidungAPI, khutroAPI } from '../services/api';

export default function Nguoidung() {
  const [nguoidungList, setNguoidungList] = useState([]);
  const [khutroList, setKhutroList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentNguoidung, setCurrentNguoidung] = useState({
    manguoidung: '',
    tendangnhap: '',
    matkhau: '',
    vaitro: 'KhachThue',
    makhutro: '',
  });

  useEffect(() => {
    fetchNguoidung();
    fetchKhutro();
  }, []);

  const fetchNguoidung = async () => {
    try {
      const response = await nguoidungAPI.getAll();
      setNguoidungList(response.data);
    } catch (error) {
      console.error('Error fetching nguoidung:', error);
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

  const handleOpenDialog = (nguoidung = null) => {
    if (nguoidung) {
      setCurrentNguoidung({
        manguoidung: nguoidung.Manguoidung,
        tendangnhap: nguoidung.Tendangnhap,
        matkhau: '',
        vaitro: nguoidung.Vaitro,
        makhutro: nguoidung.Makhutro || '',
      });
      setEditMode(true);
    } else {
      setCurrentNguoidung({
        manguoidung: '',
        tendangnhap: '',
        matkhau: '',
        vaitro: 'KhachThue',
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
      const data = {
        tendangnhap: currentNguoidung.tendangnhap,
        vaitro: currentNguoidung.vaitro,
        makhutro: currentNguoidung.makhutro || null,
      };

      if (currentNguoidung.matkhau) {
        data.matkhau = currentNguoidung.matkhau;
      }

      if (editMode) {
        await nguoidungAPI.update(currentNguoidung.manguoidung, data);
      } else {
        data.matkhau = currentNguoidung.matkhau;
        await nguoidungAPI.create(data);
      }
      fetchNguoidung();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving nguoidung:', error);
      alert('Có lỗi xảy ra: ' + error.response?.data?.error || error.message);
    }
  };

  const handleDelete = async (manguoidung) => {
    if (window.confirm('Bạn có chắc muốn xóa người dùng này?')) {
      try {
        await nguoidungAPI.delete(manguoidung);
        fetchNguoidung();
      } catch (error) {
        console.error('Error deleting nguoidung:', error);
        alert('Có lỗi xảy ra: ' + error.response?.data?.error || error.message);
      }
    }
  };

  const getRoleColor = (vaitro) => {
    switch (vaitro) {
      case 'Admin':
        return 'error';
      case 'NhanVien':
        return 'primary';
      case 'KhachThue':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Quản lý Người dùng</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Thêm người dùng
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã ND</TableCell>
              <TableCell>Tên đăng nhập</TableCell>
              <TableCell>Vai trò</TableCell>
              <TableCell>Khu trọ</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {nguoidungList.map((row) => (
              <TableRow key={row.Manguoidung}>
                <TableCell>{row.Manguoidung}</TableCell>
                <TableCell>{row.Tendangnhap}</TableCell>
                <TableCell>
                  <Chip
                    label={row.Vaitro}
                    color={getRoleColor(row.Vaitro)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{row.Tenkhutro || '-'}</TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(row)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(row.Manguoidung)}
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
          {editMode ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Tên đăng nhập"
            fullWidth
            value={currentNguoidung.tendangnhap}
            onChange={(e) =>
              setCurrentNguoidung({
                ...currentNguoidung,
                tendangnhap: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label={editMode ? 'Mật khẩu mới (để trống nếu không đổi)' : 'Mật khẩu'}
            type="password"
            fullWidth
            value={currentNguoidung.matkhau}
            onChange={(e) =>
              setCurrentNguoidung({
                ...currentNguoidung,
                matkhau: e.target.value,
              })
            }
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Vai trò</InputLabel>
            <Select
              value={currentNguoidung.vaitro}
              label="Vai trò"
              onChange={(e) =>
                setCurrentNguoidung({
                  ...currentNguoidung,
                  vaitro: e.target.value,
                })
              }
            >
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="NhanVien">Nhân viên</MenuItem>
              <MenuItem value="KhachThue">Khách thuê</MenuItem>
            </Select>
          </FormControl>
          {currentNguoidung.vaitro !== 'KhachThue' && (
            <FormControl fullWidth margin="dense">
              <InputLabel>Khu trọ</InputLabel>
              <Select
                value={currentNguoidung.makhutro}
                label="Khu trọ"
                onChange={(e) =>
                  setCurrentNguoidung({
                    ...currentNguoidung,
                    makhutro: e.target.value,
                  })
                }
              >
                <MenuItem value="">Không chọn</MenuItem>
                {khutroList.map((khutro) => (
                  <MenuItem key={khutro.Makhutro} value={khutro.Makhutro}>
                    {khutro.Tenkhutro}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
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
