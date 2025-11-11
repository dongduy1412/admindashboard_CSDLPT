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
import { khutroAPI } from '../services/api';

export default function Khutro() {
  const [khutroList, setKhutroList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentKhutro, setCurrentKhutro] = useState({
    makhutro: '',
    tenkhutro: '',
    diachi: '',
  });

  useEffect(() => {
    fetchKhutro();
  }, []);

  const fetchKhutro = async () => {
    try {
      const response = await khutroAPI.getAll();
      setKhutroList(response.data);
    } catch (error) {
      console.error('Error fetching khutro:', error);
    }
  };

  const handleOpenDialog = (khutro = null) => {
    if (khutro) {
      setCurrentKhutro({
        makhutro: khutro.Makhutro,
        tenkhutro: khutro.Tenkhutro,
        diachi: khutro.Diachi,
      });
      setEditMode(true);
    } else {
      setCurrentKhutro({ makhutro: '', tenkhutro: '', diachi: '' });
      setEditMode(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentKhutro({ makhutro: '', tenkhutro: '', diachi: '' });
  };

  const handleSave = async () => {
    try {
      if (editMode) {
        await khutroAPI.update(currentKhutro.makhutro, {
          tenkhutro: currentKhutro.tenkhutro,
          diachi: currentKhutro.diachi,
        });
      } else {
        await khutroAPI.create(currentKhutro);
      }
      fetchKhutro();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving khutro:', error);
      alert('Có lỗi xảy ra: ' + error.response?.data?.error || error.message);
    }
  };

  const handleDelete = async (makhutro) => {
    if (window.confirm('Bạn có chắc muốn xóa khu trọ này?')) {
      try {
        await khutroAPI.delete(makhutro);
        fetchKhutro();
      } catch (error) {
        console.error('Error deleting khutro:', error);
        alert('Có lỗi xảy ra: ' + error.response?.data?.error || error.message);
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Quản lý Khu trọ</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Thêm khu trọ
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã khu trọ</TableCell>
              <TableCell>Tên khu trọ</TableCell>
              <TableCell>Địa chỉ</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {khutroList.map((row) => (
              <TableRow key={row.Makhutro}>
                <TableCell>{row.Makhutro}</TableCell>
                <TableCell>{row.Tenkhutro}</TableCell>
                <TableCell>{row.Diachi}</TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(row)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(row.Makhutro)}
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
          {editMode ? 'Chỉnh sửa khu trọ' : 'Thêm khu trọ mới'}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Mã khu trọ"
            fullWidth
            value={currentKhutro.makhutro}
            onChange={(e) =>
              setCurrentKhutro({ ...currentKhutro, makhutro: e.target.value })
            }
            disabled={editMode}
          />
          <TextField
            margin="dense"
            label="Tên khu trọ"
            fullWidth
            value={currentKhutro.tenkhutro}
            onChange={(e) =>
              setCurrentKhutro({ ...currentKhutro, tenkhutro: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Địa chỉ"
            fullWidth
            multiline
            rows={2}
            value={currentKhutro.diachi}
            onChange={(e) =>
              setCurrentKhutro({ ...currentKhutro, diachi: e.target.value })
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
