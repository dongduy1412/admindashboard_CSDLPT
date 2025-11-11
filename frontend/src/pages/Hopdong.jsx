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
import VisibilityIcon from '@mui/icons-material/Visibility';
import { hopdongAPI, phongtroAPI } from '../services/api';

export default function Hopdong() {
  const [hopdongList, setHopdongList] = useState([]);
  const [phongtroList, setPhongtroList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentHopdong, setCurrentHopdong] = useState({
    mahopdong: '',
    ngaybatdau: '',
    ngayketthuc: '',
    tiencoc: '',
    maphong: '',
  });
  const [hopdongDetail, setHopdongDetail] = useState([]);

  useEffect(() => {
    fetchHopdong();
    fetchPhongtro();
  }, []);

  const fetchHopdong = async () => {
    try {
      const response = await hopdongAPI.getAll();
      setHopdongList(response.data);
    } catch (error) {
      console.error('Error fetching hopdong:', error);
    }
  };

  const fetchPhongtro = async () => {
    try {
      const response = await phongtroAPI.getAll();
      setPhongtroList(response.data);
    } catch (error) {
      console.error('Error fetching phongtro:', error);
    }
  };

  const handleViewDetail = async (mahopdong) => {
    try {
      const response = await hopdongAPI.getWithKhachthue(mahopdong);
      setHopdongDetail(response.data);
      setOpenDetailDialog(true);
    } catch (error) {
      console.error('Error fetching hopdong detail:', error);
    }
  };

  const handleOpenDialog = (hopdong = null) => {
    if (hopdong) {
      setCurrentHopdong({
        mahopdong: hopdong.Mahopdong,
        ngaybatdau: hopdong.Ngaybatdau?.split('T')[0] || '',
        ngayketthuc: hopdong.Ngayketthuc?.split('T')[0] || '',
        tiencoc: hopdong.Tiencoc,
        maphong: hopdong.Maphong,
      });
      setEditMode(true);
    } else {
      setCurrentHopdong({
        mahopdong: '',
        ngaybatdau: '',
        ngayketthuc: '',
        tiencoc: '',
        maphong: '',
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
        ...currentHopdong,
        ngayketthuc: currentHopdong.ngayketthuc || null,
      };
      if (editMode) {
        await hopdongAPI.update(currentHopdong.mahopdong, data);
      } else {
        await hopdongAPI.create(data);
      }
      fetchHopdong();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving hopdong:', error);
      alert('Có lỗi xảy ra: ' + error.response?.data?.error || error.message);
    }
  };

  const handleDelete = async (mahopdong) => {
    if (window.confirm('Bạn có chắc muốn xóa hợp đồng này?')) {
      try {
        await hopdongAPI.delete(mahopdong);
        fetchHopdong();
      } catch (error) {
        console.error('Error deleting hopdong:', error);
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

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Quản lý Hợp đồng</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Thêm hợp đồng
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã HĐ</TableCell>
              <TableCell>Khu trọ</TableCell>
              <TableCell>Phòng</TableCell>
              <TableCell>Ngày bắt đầu</TableCell>
              <TableCell>Ngày kết thúc</TableCell>
              <TableCell align="right">Tiền cọc</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {hopdongList.map((row) => (
              <TableRow key={row.Mahopdong}>
                <TableCell>{row.Mahopdong}</TableCell>
                <TableCell>{row.Tenkhutro}</TableCell>
                <TableCell>{row.Tenphong}</TableCell>
                <TableCell>{formatDate(row.Ngaybatdau)}</TableCell>
                <TableCell>{formatDate(row.Ngayketthuc)}</TableCell>
                <TableCell align="right">
                  {formatCurrency(row.Tiencoc)}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    color="info"
                    onClick={() => handleViewDetail(row.Mahopdong)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(row)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(row.Mahopdong)}
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
          {editMode ? 'Chỉnh sửa hợp đồng' : 'Thêm hợp đồng mới'}
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Phòng trọ</InputLabel>
            <Select
              value={currentHopdong.maphong}
              label="Phòng trọ"
              onChange={(e) =>
                setCurrentHopdong({ ...currentHopdong, maphong: e.target.value })
              }
            >
              {phongtroList.map((phong) => (
                <MenuItem key={phong.Maphong} value={phong.Maphong}>
                  {phong.Tenkhutro} - {phong.Tenphong}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Ngày bắt đầu"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={currentHopdong.ngaybatdau}
            onChange={(e) =>
              setCurrentHopdong({ ...currentHopdong, ngaybatdau: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Ngày kết thúc"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={currentHopdong.ngayketthuc}
            onChange={(e) =>
              setCurrentHopdong({ ...currentHopdong, ngayketthuc: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Tiền cọc"
            type="number"
            fullWidth
            value={currentHopdong.tiencoc}
            onChange={(e) =>
              setCurrentHopdong({ ...currentHopdong, tiencoc: e.target.value })
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

      <Dialog
        open={openDetailDialog}
        onClose={() => setOpenDetailDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Chi tiết hợp đồng và khách thuê</DialogTitle>
        <DialogContent>
          {hopdongDetail.length > 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Thông tin hợp đồng
              </Typography>
              <Typography>Mã HĐ: {hopdongDetail[0].Mahopdong}</Typography>
              <Typography>Phòng: {hopdongDetail[0].Tenphong}</Typography>
              <Typography>Khu trọ: {hopdongDetail[0].Tenkhutro}</Typography>
              <Typography>
                Ngày: {formatDate(hopdongDetail[0].Ngaybatdau)} -{' '}
                {formatDate(hopdongDetail[0].Ngayketthuc)}
              </Typography>

              <Typography variant="h6" sx={{ mt: 2 }} gutterBottom>
                Danh sách khách thuê
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Mã KH</TableCell>
                      <TableCell>Họ tên</TableCell>
                      <TableCell>CCCD</TableCell>
                      <TableCell>SĐT</TableCell>
                      <TableCell>Khách chính</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {hopdongDetail.map(
                      (row, index) =>
                        row.Makhachthue && (
                          <TableRow key={index}>
                            <TableCell>{row.Makhachthue}</TableCell>
                            <TableCell>{row.Hoten}</TableCell>
                            <TableCell>{row.CCCD}</TableCell>
                            <TableCell>{row.Sodienthoai}</TableCell>
                            <TableCell>{row.Lakhachchinh ? 'Có' : 'Không'}</TableCell>
                          </TableRow>
                        )
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailDialog(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
