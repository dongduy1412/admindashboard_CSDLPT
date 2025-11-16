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
import { khachthueAPI, hopdongAPI, phongtroAPI } from '../services/api';

export default function Hopdong() {
  const [hopdongList, setHopdongList] = useState([]);
  const [phongtroList, setPhongtroList] = useState([]);
  const [khachthueList, setKhachthueList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentHopdong, setCurrentHopdong] = useState({
    mahopdong: '',
    ngaybatdau: '',
    ngayketthuc: '',
    tiencoc: '',
    maphong: '',
    khachthueList: [''],
    khachthuechinh: '',
  });
  const [hopdongDetail, setHopdongDetail] = useState([]);

  // ================== FETCH DATA ==================
  useEffect(() => {
    fetchHopdong();
    fetchPhongtro();
    fetchKhachthue();
  }, []);

  const fetchHopdong = async () => {
    try {
      const response = await hopdongAPI.getAll();
      const data = response.data;

      // Map để thêm tên khách chính vào mỗi hợp đồng
      const dataWithKhachChinh = await Promise.all(
        data.map(async (hd) => {
          try {
            const detailRes = await hopdongAPI.getWithKhachthue(hd.Mahopdong);
            const khachChinh = detailRes.data.find((k) => k.Lakhachchinh)
              ?.Hoten || '';
            return { ...hd, Khachchinh: khachChinh };
          } catch (err) {
            console.error('Error fetching hopdong detail:', err);
            return { ...hd, Khachchinh: '' };
          }
        })
      );

      setHopdongList(dataWithKhachChinh);
    } catch (error) {
      console.error('Error fetching hopdong:', error);
    }
  };

  const fetchKhachthue = async () => {
    try {
      const response = await khachthueAPI.getAll();
      setKhachthueList(response.data);
    } catch (error) {
      console.error('Error fetching khachthue:', error);
    }
  };

  // Lấy danh sách Makhachthue theo Mahopdong
  const fetchKhachThue_Hopdong = async (mahopdong) => {
    try {
      const response = await khachthueAPI.getByHopdong(mahopdong);
      console.log('Khách thuê theo HĐ', mahopdong, response.data);
      // Trả về mảng Makhachthue
      return response.data.map((k) => k.Makhachthue);
    } catch (error) {
      console.error('Error fetching khachthue by hopdong:', error);
      return [];
    }
  };

  const fetchPhongtro = async () => {
    try {
      const response = await phongtroAPI.getAllOK();
      setPhongtroList(response.data);
    } catch (error) {
      console.error('Error fetching phongtro:', error);
    }
  };

  // ================== HANDLERS ==================

  const handleViewDetail = async (mahopdong) => {
    try {
      const response = await hopdongAPI.getWithKhachthue(mahopdong);
      setHopdongDetail(response.data);
      setOpenDetailDialog(true);
    } catch (error) {
      console.error('Error fetching hopdong detail:', error);
    }
  };

  // mở dialog: nếu có hopdong => SỬA, không có => THÊM
  const handleOpenDialog = async (hopdong = null) => {
    if (hopdong) {
      // EDIT MODE
      setEditMode(true);

      // Lấy danh sách khách thuê theo hợp đồng
      const khList = await fetchKhachThue_Hopdong(hopdong.Mahopdong);

      setCurrentHopdong({
        mahopdong: hopdong.Mahopdong,
        ngaybatdau: hopdong.Ngaybatdau?.split('T')[0] || '',
        ngayketthuc: hopdong.Ngayketthuc?.split('T')[0] || '',
        tiencoc: hopdong.Tiencoc,
        maphong: hopdong.Maphong,
        khachthueList: khList.length ? khList : [''],
        khachthuechinh: '', // nếu sau này cần đánh dấu khách chính
      });
    } else {
      // ADD MODE
      setEditMode(false);
      setCurrentHopdong({
        mahopdong: '',
        ngaybatdau: '',
        ngayketthuc: '',
        tiencoc: '',
        maphong: '',
        khachthueList: [''],
        khachthuechinh: '',
      });
    }

    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSave = async () => {
    console.log('Saving hopdong:', currentHopdong);
    try {
      const data = {
        ...currentHopdong,
        ngayketthuc: currentHopdong.ngayketthuc || null,
        listkhachthue: currentHopdong.khachthueList.filter((k) => k), // loại bỏ rỗng
      };

      if (editMode) {
        await hopdongAPI.update(currentHopdong.mahopdong, data);
      } else {
        await hopdongAPI.create(data);
      }

      await fetchHopdong();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving hopdong:', error);
      alert('Có lỗi xảy ra: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleDelete = async (mahopdong) => {
    if (window.confirm('Bạn có chắc muốn xóa hợp đồng này?')) {
      try {
        await hopdongAPI.delete(mahopdong);
        fetchHopdong();
      } catch (error) {
        console.error('Error deleting hopdong:', error);
        alert('Có lỗi xảy ra: ' + (error.response?.data?.error || error.message));
      }
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);

  const formatDate = (dateString) =>
    !dateString ? '' : new Date(dateString).toLocaleDateString('vi-VN');

  // ================== RENDER ==================
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

      {/* Bảng hợp đồng */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã HĐ</TableCell>
              <TableCell>Khu trọ</TableCell>
              <TableCell>Phòng</TableCell>
              <TableCell>Ngày bắt đầu</TableCell>
              <TableCell>Ngày kết thúc</TableCell>
              <TableCell align="right">Đại diện</TableCell>
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
                <TableCell align="right">{row.Khachchinh}</TableCell>
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

      {/* Dialog Thêm / Sửa HĐ */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editMode ? 'Chỉnh sửa hợp đồng' : 'Thêm hợp đồng mới'}
        </DialogTitle>

        <DialogContent>
          {editMode ? (
            <>
              {/* ====== FORM CHỈNH SỬA ====== */}
              <FormControl fullWidth margin="dense">
                <InputLabel>Phòng trọ</InputLabel>
                <Select
                  value={currentHopdong.maphong}
                  label="Phòng trọ"
                  onChange={(e) =>
                    setCurrentHopdong({
                      ...currentHopdong,
                      maphong: e.target.value,
                    })
                  }
                  disabled
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
                label="Mã hợp đồng"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={currentHopdong.mahopdong}
                disabled
              />

              <TextField
                margin="dense"
                label="Ngày bắt đầu"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={currentHopdong.ngaybatdau}
                onChange={(e) =>
                  setCurrentHopdong({
                    ...currentHopdong,
                    ngaybatdau: e.target.value,
                  })
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
                  setCurrentHopdong({
                    ...currentHopdong,
                    ngayketthuc: e.target.value,
                  })
                }
              />
              <TextField
                margin="dense"
                label="Tiền cọc"
                type="number"
                fullWidth
                value={currentHopdong.tiencoc}
                onChange={(e) =>
                  setCurrentHopdong({
                    ...currentHopdong,
                    tiencoc: e.target.value,
                  })
                }
              />

              {/* Khách thuê */}
              <Box sx={{ mt: 2 }}>
                <Typography>Khách thuê (tối đa 3)</Typography>
                {currentHopdong.khachthueList.map((khach, index) => (
                  <Box
                    key={index}
                    sx={{ display: 'flex', alignItems: 'center', mt: 1 }}
                  >
                    <FormControl fullWidth>
                      <InputLabel>Khách thuê {index + 1}</InputLabel>
                      <Select
                        value={khach || ''}
                        label={`Khách thuê ${index + 1}`}
                        onChange={(e) => {
                          const newList = [...currentHopdong.khachthueList];
                          newList[index] = e.target.value;
                          setCurrentHopdong({
                            ...currentHopdong,
                            khachthueList: newList,
                          });
                        }}
                      >
                        {khachthueList
                          .filter(
                            (k) =>
                              !currentHopdong.khachthueList.includes(
                                k.Makhachthue
                              ) || k.Makhachthue === khach
                          )
                          .map((k) => (
                            <MenuItem
                              key={k.Makhachthue}
                              value={k.Makhachthue}
                            >
                              {k.Hoten} - {k.CCCD}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>

                    {index === currentHopdong.khachthueList.length - 1 &&
                      currentHopdong.khachthueList.length < 3 && (
                        <IconButton
                          color="primary"
                          onClick={() =>
                            setCurrentHopdong({
                              ...currentHopdong,
                              khachthueList: [
                                ...currentHopdong.khachthueList,
                                '',
                              ],
                            })
                          }
                        >
                          <AddIcon />
                        </IconButton>
                      )}

                    {currentHopdong.khachthueList.length > 1 && (
                      <IconButton
                        color="error"
                        onClick={() => {
                          const newList =
                            currentHopdong.khachthueList.filter(
                              (_, i) => i !== index
                            );
                          setCurrentHopdong({
                            ...currentHopdong,
                            khachthueList: newList,
                          });
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                ))}
              </Box>
            </>
          ) : (
            <>
              {/* ====== FORM THÊM MỚI ====== */}
              <FormControl fullWidth margin="dense">
                <InputLabel>Phòng trọ</InputLabel>
                <Select
                  value={currentHopdong.maphong}
                  label="Phòng trọ"
                  onChange={(e) =>
                    setCurrentHopdong({
                      ...currentHopdong,
                      maphong: e.target.value,
                    })
                  }
                >
                  {phongtroList.map((phong) => (
                    <MenuItem key={phong.Maphong} value={phong.Maphong}>
                      {phong.Tenkhutro} - {phong.Tenphong}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Số hợp đồng: chỉ nhập số cuối, auto ghép maphong + _HD + số */}
              <TextField
                margin="dense"
                label="Số hợp đồng"
                type="number"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={
                  currentHopdong.mahopdong
                    ?.replace(`${currentHopdong.maphong}_HD`, '') || ''
                }
                onChange={(e) => {
                  let so = e.target.value;
                  const soHD = String(parseInt(so || 0, 10)).padStart(3, '0');

                  setCurrentHopdong({
                    ...currentHopdong,
                    mahopdong: `${currentHopdong.maphong}_HD${soHD}`,
                  });
                }}
              />

              <TextField
                margin="dense"
                label="Ngày bắt đầu"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={currentHopdong.ngaybatdau}
                onChange={(e) =>
                  setCurrentHopdong({
                    ...currentHopdong,
                    ngaybatdau: e.target.value,
                  })
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
                  setCurrentHopdong({
                    ...currentHopdong,
                    ngayketthuc: e.target.value,
                  })
                }
              />
              <TextField
                margin="dense"
                label="Tiền cọc"
                type="number"
                fullWidth
                value={currentHopdong.tiencoc}
                onChange={(e) =>
                  setCurrentHopdong({
                    ...currentHopdong,
                    tiencoc: e.target.value,
                  })
                }
              />

              {/* Khách thuê */}
              <Box sx={{ mt: 2 }}>
                <Typography>Khách thuê (tối đa 3)</Typography>
                {currentHopdong.khachthueList.map((khach, index) => (
                  <Box
                    key={index}
                    sx={{ display: 'flex', alignItems: 'center', mt: 1 }}
                  >
                    <FormControl fullWidth>
                      <InputLabel>Khách thuê {index + 1}</InputLabel>
                      <Select
                        value={khach || ''}
                        label={`Khách thuê ${index + 1}`}
                        onChange={(e) => {
                          const newList = [...currentHopdong.khachthueList];
                          newList[index] = e.target.value;
                          setCurrentHopdong({
                            ...currentHopdong,
                            khachthueList: newList,
                          });
                        }}
                      >
                        {khachthueList
                          .filter(
                            (k) =>
                              !currentHopdong.khachthueList.includes(
                                k.Makhachthue
                              ) || k.Makhachthue === khach
                          )
                          .map((k) => (
                            <MenuItem
                              key={k.Makhachthue}
                              value={k.Makhachthue}
                            >
                              {k.Hoten} - {k.CCCD}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>

                    {index === currentHopdong.khachthueList.length - 1 &&
                      currentHopdong.khachthueList.length < 3 && (
                        <IconButton
                          color="primary"
                          onClick={() =>
                            setCurrentHopdong({
                              ...currentHopdong,
                              khachthueList: [
                                ...currentHopdong.khachthueList,
                                '',
                              ],
                            })
                          }
                        >
                          <AddIcon />
                        </IconButton>
                      )}

                    {currentHopdong.khachthueList.length > 1 && (
                      <IconButton
                        color="error"
                        onClick={() => {
                          const newList =
                            currentHopdong.khachthueList.filter(
                              (_, i) => i !== index
                            );
                          setCurrentHopdong({
                            ...currentHopdong,
                            khachthueList: newList,
                          });
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                ))}
              </Box>
            </>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleSave} variant="contained">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Chi tiết HĐ */}
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
                            <TableCell>
                              {row.Lakhachchinh ? 'Có' : 'Không'}
                            </TableCell>
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
