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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { khachthueAPI } from '../services/api';

export default function Khachthue() {
  const [khachthueList, setKhachthueList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentKhachthue, setCurrentKhachthue] = useState({
    makhachthue: '',
    hoten: '',
    cccd: '',
    sodienthoai: '',
    manguoidung: '',
  });

  useEffect(() => {
    fetchKhachthue();
  }, []);

  const fetchKhachthue = async () => {
    try {
      const response = await khachthueAPI.getAll();
      setKhachthueList(response.data);
    } catch (error) {
      console.error('Error fetching khachthue:', error);
    }
  };

  const handleOpenDialog = (khachthue = null) => {
    if (khachthue) {
      setCurrentKhachthue({
        makhachthue: khachthue.Makhachthue,
        hoten: khachthue.Hoten,
        cccd: khachthue.CCCD,
        sodienthoai: khachthue.Sodienthoai,
        manguoidung: khachthue.Manguoidung,
      });
      setEditMode(true);
    } else {
      setCurrentKhachthue({
        makhachthue: '',
        hoten: '',
        cccd: '',
        sodienthoai: '',
        manguoidung: '',
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
        await khachthueAPI.update(currentKhachthue.makhachthue, {
          hoten: currentKhachthue.hoten,
          cccd: currentKhachthue.cccd,
          sodienthoai: currentKhachthue.sodienthoai,
        });
      } else {
        await khachthueAPI.create(currentKhachthue);
      }
      fetchKhachthue();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving khachthue:', error);
      alert('Có lỗi xảy ra: ' + error.response?.data?.error || error.message);
    }
  };

  const handleDelete = async (makhachthue) => {
    if (window.confirm('Bạn có chắc muốn xóa khách thuê này?')) {
      try {
        await khachthueAPI.delete(makhachthue);
        fetchKhachthue();
      } catch (error) {
        console.error('Error deleting khachthue:', error);
        alert('Có lỗi xảy ra: ' + error.response?.data?.error || error.message);
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Quản lý Khách thuê</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Thêm khách thuê
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã KH</TableCell>
              <TableCell>Họ tên</TableCell>
              <TableCell>CCCD</TableCell>
              <TableCell>Số điện thoại</TableCell>
              <TableCell>Tên đăng nhập</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {khachthueList.map((row) => (
              <TableRow key={row.Makhachthue}>
                <TableCell>{row.Makhachthue}</TableCell>
                <TableCell>{row.Hoten}</TableCell>
                <TableCell>{row.CCCD}</TableCell>
                <TableCell>{row.Sodienthoai}</TableCell>
                <TableCell>{row.Tendangnhap}</TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(row)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(row.Makhachthue)}
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
          {editMode ? 'Chỉnh sửa khách thuê' : 'Thêm khách thuê mới'}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Mã khách thuê"
            fullWidth
            value={currentKhachthue.makhachthue}
            onChange={(e) =>
              setCurrentKhachthue({
                ...currentKhachthue,
                makhachthue: e.target.value,
              })
            }
            disabled={editMode}
          />
          <TextField
            margin="dense"
            label="Họ tên"
            fullWidth
            value={currentKhachthue.hoten}
            onChange={(e) =>
              setCurrentKhachthue({ ...currentKhachthue, hoten: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="CCCD"
            fullWidth
            value={currentKhachthue.cccd}
            onChange={(e) =>
              setCurrentKhachthue({ ...currentKhachthue, cccd: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Số điện thoại"
            fullWidth
            value={currentKhachthue.sodienthoai}
            onChange={(e) =>
              setCurrentKhachthue({
                ...currentKhachthue,
                sodienthoai: e.target.value,
              })
            }
          />
          {!editMode && (
            <TextField
              margin="dense"
              label="Mã người dùng"
              fullWidth
              type="number"
              value={currentKhachthue.manguoidung}
              onChange={(e) =>
                setCurrentKhachthue({
                  ...currentKhachthue,
                  manguoidung: e.target.value,
                })
              }
            />
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
