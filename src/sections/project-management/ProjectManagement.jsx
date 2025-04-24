import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
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
  Snackbar,
  Alert,
  FormHelperText,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';
import { kAPI_URL } from '../../api/utils/constants';
import { AuthContext } from '../../context/AuthProvider';

// Table component
const DataTable = ({ data, columns, onEdit, onDelete, onAdd, parentData = null, clientUsers = null, currentTab, statementData, showBulkAddModal, setShowBulkAddModal, respondentData, selectedStudy, setSelectedStudy, selectedStudyForQSort, setSelectedStudyForQSort }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({});

  // Generate recommended password
  const generateRecommendedPassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  };

  // Filter data based on selected study
  const filteredData = selectedStudy && (currentTab === 3 || currentTab === 4 || currentTab === 5)
    ? data.filter(item => parseInt(item.studyID) === parseInt(selectedStudy))
    : data;

  const handleEdit = (item) => {
    setSelectedItem(item);
    // Initialize form data based on current tab
    let formDataWithPassword = { ...item };
    
    if (currentTab === 3) { // Respondent table
      formDataWithPassword = {
        ...item,
        password: item.rawPassword || '',
        showPassword: false
      };
    } else if (currentTab === 6) { // Q-Sort table
      // Find corresponding statementID
      const studyStatement = studyStatementData.find(s => 
        s.studyStatementID === item.studyStatementID
      );
      
      if (studyStatement) {
        formDataWithPassword = {
          respondentID: item.respondentID,
          statementID: studyStatement.statementID,
          qSortValue: item.qSortValue
        };
      }
    }
    
    setFormData(formDataWithPassword);
    setOpenDialog(true);
  };

  const handleAdd = () => {
    setSelectedItem(null);
    // Initialize form data based on current tab
    let initialFormData = {};
    if (currentTab === 3) { // Respondent table
      initialFormData = {
        username: '',
        password: '',
        studyID: selectedStudy || '',
        showPassword: false
      };
    } else if (currentTab === 4) { // Study Round table
      initialFormData = {
        studyID: selectedStudy || '',
        studyRound: '',
        roundDate: new Date().toISOString().split('T')[0]
      };
    } else if (currentTab === 5) { // Study Statement table
      initialFormData = {
        studyID: selectedStudy || '',
        statementID: ''
      };
    } else if (currentTab === 1) { // Study table
      initialFormData = {
        studyName: '',
        studyDate: new Date().toISOString().split('T')[0],
        distributionID: ''
      };
    }
    setFormData(initialFormData);
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setSelectedItem(null);
    setFormData({});
  };

  const handleSubmit = () => {
    if (selectedItem) {
      // For edit operation, ensure password field is handled correctly
      let submitData = { ...formData };
      if (currentTab === 3) { // Respondent table
        if (submitData.password) {
          submitData.rawPassword = submitData.password;
          delete submitData.password;
        }
      } else if (currentTab === 6) { // Q-Sort table
        // Find corresponding studyStatementID
        const studyStatement = studyStatementData.find(s => 
          s.statementID === submitData.statementID
        );
        
        if (!studyStatement) {
          setSnackbar({
            open: true,
            message: 'Invalid statement selection',
            severity: 'error',
          });
          return;
        }

        submitData = {
          respondentID: submitData.respondentID,
          studyStatementID: studyStatement.studyStatementID,
          qSortValue: submitData.qSortValue
        };
      }
      onEdit(selectedItem, submitData);
    } else {
      // For add operation, add studyID based on selection mode
      let submitData = { ...formData };
      
      // Ensure respondent table data contains all required fields
      if (currentTab === 3) {
        if (!submitData.username || !submitData.password) {
          setSnackbar({
            open: true,
            message: 'Username and password are required',
            severity: 'error',
          });
          return;
        }
        
        // Ensure studyID is correctly set
        const studyID = selectedStudy || submitData.studyID;
        if (!studyID) {
          setSnackbar({
            open: true,
            message: 'Please select a study',
            severity: 'error',
          });
          return;
        }
        
        // Create new submit data object
        submitData = {
          username: submitData.username,
          rawPassword: submitData.password,  // Use password field directly as rawPassword
          studyID: parseInt(studyID)
        };
      }

      // Ensure studyStatement table data contains all required fields
      if (currentTab === 5) {
        if (!submitData.studyID || !submitData.statementID) {
          setSnackbar({
            open: true,
            message: 'Please select both study and statement',
            severity: 'error',
          });
          return;
        }
        
        // Ensure IDs are numbers
        submitData.studyID = parseInt(submitData.studyID);
        submitData.statementID = parseInt(submitData.statementID);
        
        if (isNaN(submitData.studyID) || isNaN(submitData.statementID)) {
          setSnackbar({
            open: true,
            message: 'Invalid study or statement ID',
            severity: 'error',
          });
          return;
        }
      }
      
      // Determine table name based on current tab
      let tableName;
      switch (currentTab) {
        case 0:
          tableName = 'distribution';
          break;
        case 1:
          tableName = 'study';
          break;
        case 2:
          tableName = 'statement';
          break;
        case 3:
          tableName = 'respondent';
          break;
        case 4:
          tableName = 'studyRound';
          break;
        case 5:
          tableName = 'studyStatement';
          break;
        default:
          tableName = 'distribution';
      }
      
      // Pass processed data directly
      onAdd(tableName, submitData);
    }
    handleClose();
  };

  // 添加下载数据函数
  const handleDownload = () => {
    // 获取当前表格的列名，使用 label 而不是 headerName
    const headers = columns.map(col => col.label);
    
    // 使用 filteredData 而不是 data，这样只下载当前筛选后的数据
    const rows = filteredData.map(item => {
      return columns.map(col => {
        if (col.field === 'studyID' && parentData) {
          const study = parentData.find(s => s.studyID === item[col.field]);
          return study ? study.studyName : item[col.field];
        }
        if (col.field.startsWith('statements.')) {
          const statementKey = col.field.split('.')[1];
          const value = item.statements[statementKey];
          // 处理0值和null值
          if (value === 0) return '0';
          return value !== null && value !== undefined ? value : '-';
        }
        // 跳过 actions 列
        if (col.field === 'actions') return null;
        return item[col.field];
      }).filter(Boolean); // 移除 null 值
    });

    // 创建CSV内容，添加表头
    const csvContent = [
      headers.filter((_, index) => columns[index].field !== 'actions').join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // 创建Blob对象
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // 创建下载链接
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    
    // 根据当前标签页设置文件名
    let fileName = 'data';
    switch(currentTab) {
      case 0:
        fileName = 'distribution_data';
        break;
      case 1:
        fileName = 'study_data';
        break;
      case 2:
        fileName = 'client_user_data';
        break;
      case 3:
        fileName = 'respondent_data';
        break;
      case 4:
        fileName = 'study_round_data';
        break;
      case 5:
        fileName = 'study_statement_data';
        break;
      case 6:
        fileName = 'qsort_data';
        break;
    }
    
    // 添加筛选信息到文件名
    let filterInfo = '';
    if (selectedStudy && (currentTab === 3 || currentTab === 4 || currentTab === 5)) {
      const study = parentData.find(s => s.studyID === selectedStudy);
      filterInfo = `_${study ? study.studyName : 'filtered'}`;
    }
    
    link.setAttribute('download', `${fileName}${filterInfo}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    // 触发下载
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Data Management</Typography>
        <Box>
          {currentTab === 3 && (
            <Button
              variant="contained"
              color="secondary"
              startIcon={<AddIcon />}
              onClick={() => setShowBulkAddModal(true)}
              sx={{ mr: 1 }}
            >
              Bulk Add
            </Button>
          )}
          {currentTab !== 3 && currentTab !== 6 && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAdd}
              sx={{ mr: 1 }}
            >
              Add
            </Button>
          )}
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
          >
            Download
          </Button>
        </Box>
      </Box>

      {/* 添加研究选择器 */}
      {(currentTab === 3 || currentTab === 4 || currentTab === 5 || currentTab === 6) && (
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Select Study</InputLabel>
          <Select
            value={currentTab === 6 ? selectedStudyForQSort : selectedStudy}
            onChange={(e) => currentTab === 6 ? setSelectedStudyForQSort(e.target.value) : setSelectedStudy(e.target.value)}
            label="Select Study"
          >
            <MenuItem value="">All Studies</MenuItem>
            {parentData.map((study) => (
              <MenuItem key={study.studyID} value={study.studyID}>
                {study.studyName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      <TableContainer 
        component={Paper} 
        sx={{ 
          mt: 2,
          boxShadow: 2,
          borderRadius: 2,
          '& .MuiTableCell-root': {
            padding: '16px',
            fontSize: '0.875rem',
          },
          '& .MuiTableHead-root .MuiTableCell-root': {
            backgroundColor: '#f5f5f5',
            fontWeight: 'bold',
          },
          '& .MuiTableRow-root:hover': {
            backgroundColor: '#f8f8f8',
          }
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.field}>{column.label}</TableCell>
              ))}
              {currentTab !== 6 && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item[columns[0].field]}>
                {columns.map((column) => (
                  <TableCell key={column.field}>
                    {column.render ? column.render(item) : item[column.field]}
                  </TableCell>
                ))}
                {currentTab !== 6 && (
                  <TableCell>
                    <IconButton 
                      onClick={() => handleEdit(item)}
                      sx={{ 
                        color: 'primary.main',
                        '&:hover': { color: 'primary.dark' }
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      onClick={() => onDelete(item)}
                      sx={{ 
                        color: 'error.main',
                        '&:hover': { color: 'error.dark' }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog 
        open={openDialog} 
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: 3
          }
        }}
      >
        <DialogTitle sx={{ 
          backgroundColor: '#f5f5f5',
          borderBottom: 1,
          borderColor: 'divider',
          '& .MuiTypography-root': {
            fontWeight: 'bold'
          }
        }}>
          {selectedItem ? 'Edit Data' : 'Add Data'}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {/* Respondent 表单字段 */}
          {currentTab === 3 && (
            <>
              <TextField
                fullWidth
                margin="normal"
                label="Username"
                value={formData.username || ''}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                helperText="Required field"
              />
              <Box sx={{ position: 'relative', mt: 2 }}>
                <TextField
                  fullWidth
                  label="Password"
                  type={formData.showPassword ? 'text' : 'password'}
                  value={formData.password || ''}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  helperText="Required field"
                  InputProps={{
                    endAdornment: (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton
                          onClick={() => setFormData({ ...formData, showPassword: !formData.showPassword })}
                          edge="end"
                        >
                          {formData.showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                        <IconButton
                          onClick={() => setFormData({ ...formData, password: generateRecommendedPassword() })}
                          edge="end"
                        >
                          <RefreshIcon />
                        </IconButton>
                      </Box>
                    ),
                  }}
                />
                <Typography 
                  variant="caption" 
                  color="text.secondary" 
                  sx={{ 
                    display: 'block', 
                    mt: 1,
                    textAlign: 'right'
                  }}
                >
                  Recommended password: 12 characters, including uppercase, lowercase, numbers, and special characters
                </Typography>
              </Box>
            </>
          )}

          {/* 添加 Distribution 选择器 */}
          {parentData && currentTab === 1 && (
            <TextField
              select
              fullWidth
              margin="normal"
              label="Distribution"
              value={formData.distributionID || ''}
              onChange={(e) => setFormData({ ...formData, distributionID: e.target.value })}
              required
              helperText="Required field"
            >
              {parentData.map((item) => (
                <MenuItem key={item.distributionID} value={item.distributionID}>
                  {item.distributionDetails}
                </MenuItem>
              ))}
            </TextField>
          )}

          {/* Study Statement 表单字段 */}
          {currentTab === 5 && (
            <>
              {/* 只在未选择 study 时显示 study 选择器 */}
              {!selectedStudy && (
                <FormControl fullWidth margin="normal" required>
                  <InputLabel>Select Study</InputLabel>
                  <Select
                    value={formData.studyID || ''}
                    onChange={(e) => setFormData({ ...formData, studyID: e.target.value })}
                    label="Select Study"
                  >
                    {parentData.map((study) => (
                      <MenuItem key={study.studyID} value={study.studyID}>
                        {study.studyName}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>Required field</FormHelperText>
                </FormControl>
              )}
              {/* 只显示一个 statement 选择器 */}
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Select Statement</InputLabel>
                <Select
                  value={formData.statementID || ''}
                  onChange={(e) => setFormData({ ...formData, statementID: e.target.value })}
                  label="Select Statement"
                >
                  {statementData.map((statement) => (
                    <MenuItem key={statement.statementID} value={statement.statementID}>
                      {statement.short}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Required field</FormHelperText>
              </FormControl>
            </>
          )}

          {/* Q-Sort 数据编辑表单 */}
          {currentTab === 6 && (
            <>
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Select Respondent</InputLabel>
                <Select
                  value={formData.respondentID || ''}
                  onChange={(e) => setFormData({ ...formData, respondentID: e.target.value })}
                  label="Select Respondent"
                >
                  {respondentData.map((respondent) => (
                    <MenuItem key={respondent.respondentID} value={respondent.respondentID}>
                      {respondent.username}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Required field</FormHelperText>
              </FormControl>
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Select Statement</InputLabel>
                <Select
                  value={formData.statementID || ''}
                  onChange={(e) => setFormData({ ...formData, statementID: e.target.value })}
                  label="Select Statement"
                >
                  {statementData.map((statement) => (
                    <MenuItem key={statement.statementID} value={statement.statementID}>
                      {statement.short}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Required field</FormHelperText>
              </FormControl>
              <TextField
                fullWidth
                margin="normal"
                label="Q-Sort Value"
                type="number"
                value={formData.qSortValue || ''}
                onChange={(e) => setFormData({ ...formData, qSortValue: parseInt(e.target.value) })}
                required
                helperText="Required field"
              />
            </>
          )}

          {columns.map((column) => {
            // 隐藏 auto increment 的 ID 输入框、adminID 字段和 studyStatement 的字段
            if (column.field === 'studyID' || column.field === 'distributionID' || 
                column.field === 'respondentID' || column.field === 'roundID' ||
                column.field === 'studyStatementID' || column.field === 'statementID' ||
                column.field === 'username' || column.field === 'rawPassword' ||
                column.field === 'adminID' || 
                (currentTab === 5 && column.field !== 'studyID' && column.field !== 'statementID')) return null;
            
            if (column.field === 'studyDate' || column.field === 'roundDate') {
              return (
                <TextField
                  key={column.field}
                  fullWidth
                  margin="normal"
                  label={column.label}
                  type="date"
                  value={formData[column.field] || ''}
                  onChange={(e) => setFormData({ ...formData, [column.field]: e.target.value })}
                  required
                  helperText="Required field"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              );
            }

            if (column.field === 'studyName') {
              return (
                <TextField
                  key={column.field}
                  fullWidth
                  margin="normal"
                  label={column.label}
                  value={formData[column.field] || ''}
                  onChange={(e) => setFormData({ ...formData, [column.field]: e.target.value })}
                  required
                  helperText="Required field"
                />
              );
            }

            if (column.field === 'studyRound') {
              return (
                <TextField
                  key={column.field}
                  fullWidth
                  margin="normal"
                  label={column.label}
                  type="number"
                  value={formData[column.field] || ''}
                  onChange={(e) => setFormData({ ...formData, [column.field]: parseInt(e.target.value) })}
                  required
                  helperText="Required field"
                />
              );
            }

            return (
              <TextField
                key={column.field}
                fullWidth
                margin="normal"
                label={column.label}
                value={formData[column.field] || ''}
                onChange={(e) => setFormData({ ...formData, [column.field]: e.target.value })}
                required
                helperText="Required field"
              />
            );
          })}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Main component
export default function ProjectManagement() {
  const { user } = useContext(AuthContext);
  const [currentTab, setCurrentTab] = useState(0);
  const [distributionData, setDistributionData] = useState([]);
  const [studyData, setStudyData] = useState([]);
  const [respondentData, setRespondentData] = useState([]);
  const [studyRoundData, setStudyRoundData] = useState([]);
  const [statementData, setStatementData] = useState([]);
  const [studyStatementData, setStudyStatementData] = useState([]);
  const [qSortData, setQSortData] = useState([]);
  const [clientUsers, setClientUsers] = useState([]);
  const [showBulkAddModal, setShowBulkAddModal] = useState(false);
  const [bulkCount, setBulkCount] = useState(1);
  const [selectedStudy, setSelectedStudy] = useState('');
  const [selectedStudyForQSort, setSelectedStudyForQSort] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Get data function
  const fetchData = async (endpoint) => {
    try {
      const response = await fetch(`${kAPI_URL}/api/${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      return [];
    }
  };

  // Get admin user data
  const fetchClientUsers = async () => {
    try {
      const response = await fetch(`${kAPI_URL}/users/all`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const result = await response.json();
      
      if (Array.isArray(result)) {
        setClientUsers(result);
      } else {
        setClientUsers([]);
      }
    } catch (error) {
      setClientUsers([]);
    }
  };

  // Load all data
  useEffect(() => {
    const loadData = async () => {
      const [
        distribution,
        study,
        respondent,
        studyRound,
        statement,
        studyStatement,
        qsort,
      ] = await Promise.all([
        fetchData('distribution'),
        fetchData('study'),
        fetchData('respondent'),
        fetchData('studyRound'),
        fetchData('statement'),
        fetchData('studyStatement'),
        fetchData('qsort'),
      ]);

      setDistributionData(distribution);
      setStudyData(study);
      setRespondentData(respondent);
      setStudyRoundData(studyRound);
      setStatementData(statement);
      setStudyStatementData(studyStatement);
      setQSortData(qsort);
      
      // Get admin user data
      await fetchClientUsers();
    };

    loadData();
  }, []);

  // Table column definition
  const columns = {
    distribution: [
      { field: 'distributionID', label: 'ID' },
      { field: 'distributionDetails', label: 'Distribution Details' },
      { 
        field: 'adminID', 
        label: 'Admin Name',
        render: (item) => {
          if (user?.role === 'admin') {
            return user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : 'Current Admin';
          }
          const admin = clientUsers.find(user => user.id === item.adminID);
          return admin ? `${admin.firstName} ${admin.lastName}` : 'Unknown';
        }
      }
    ],
    study: [
      { field: 'studyID', label: 'ID' },
      { field: 'studyName', label: 'Study Name' },
      { field: 'studyDate', label: 'Study Date' },
      { 
        field: 'distributionID', 
        label: 'Distribution',
        render: (item) => {
          const distribution = distributionData.find(d => d.distributionID === item.distributionID);
          return distribution ? distribution.distributionDetails : 'Unknown';
        }
      },
      { 
        field: 'adminID', 
        label: 'Admin Name',
        render: (item) => {
          if (user?.role === 'admin') {
            return user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : 'Current Admin';
          }
          const admin = clientUsers.find(user => user.id === item.adminID);
          return admin ? `${admin.firstName} ${admin.lastName}` : 'Unknown';
        }
      }
    ],
    respondent: [
      { field: 'respondentID', label: 'ID' },
      { field: 'username', label: 'Username' },
      { field: 'rawPassword', label: 'Password' },
      { 
        field: 'studyID', 
        label: 'Study',
        render: (item) => {
          const study = studyData.find(s => s.studyID === item.studyID);
          return study ? study.studyName : 'Unknown';
        }
      },
      { 
        field: 'adminID', 
        label: 'Admin Name',
        render: (item) => {
          if (user?.role === 'admin') {
            return user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : 'Current Admin';
          }
          const admin = clientUsers.find(user => user.id === item.adminID);
          return admin ? `${admin.firstName} ${admin.lastName}` : 'Unknown';
        }
      }
    ],
    studyRound: [
      { field: 'roundID', label: 'ID' },
      { 
        field: 'studyID', 
        label: 'Study',
        render: (item) => {
          const study = studyData.find(s => s.studyID === item.studyID);
          return study ? study.studyName : 'Unknown';
        }
      },
      { field: 'studyRound', label: 'Study Round' },
      { field: 'roundDate', label: 'Round Date' },
      { 
        field: 'adminID', 
        label: 'Admin Name',
        render: (item) => {
          if (user?.role === 'admin') {
            return user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : 'Current Admin';
          }
          const admin = clientUsers.find(user => user.id === item.adminID);
          return admin ? `${admin.firstName} ${admin.lastName}` : 'Unknown';
        }
      }
    ],
    statement: [
      { field: 'statementID', label: 'ID' },
      { field: 'short', label: 'Short' },
      { field: 'statementText', label: 'Statement Text' },
      { 
        field: 'adminID', 
        label: 'Admin Name',
        render: (item) => {
          if (user?.role === 'admin') {
            return user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : 'Current Admin';
          }
          const admin = clientUsers.find(user => user.id === item.adminID);
          return admin ? `${admin.firstName} ${admin.lastName}` : 'Unknown';
        }
      }
    ],
    studyStatement: [
      { field: 'studyStatementID', label: 'ID' },
      { 
        field: 'studyID', 
        label: 'Study',
        render: (item) => {
          const study = studyData.find(s => parseInt(s.studyID) === parseInt(item.studyID));
          return study ? study.studyName : 'Unknown';
        }
      },
      { 
        field: 'statementID', 
        label: 'Statement',
        render: (item) => {
          const statement = statementData.find(s => s.statementID === item.statementID);
          return statement ? statement.short : 'Unknown';
        }
      },
      { 
        field: 'adminID', 
        label: 'Admin Name',
        render: (item) => {
          if (user?.role === 'admin') {
            return user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : 'Current Admin';
          }
          const admin = clientUsers.find(user => user.id === item.adminID);
          return admin ? `${admin.firstName} ${admin.lastName}` : 'Unknown';
        }
      }
    ],
    qsort: [
      { 
        field: 'respondentID', 
        label: 'Respondent',
        render: (item) => {
          const respondent = respondentData.find(r => r.respondentID === item.respondentID);
          return respondent ? respondent.username : 'Unknown';
        }
      },
      { 
        field: 'statements', 
        label: 'Statements',
        render: (item) => {
          const studyStatement = studyStatementData.find(s => s.studyStatementID === item.studyStatementID);
          if (studyStatement) {
            const statement = statementData.find(s => s.statementID === studyStatement.statementID);
            return statement ? statement.short : 'Unknown';
          }
          return 'Unknown';
        }
      },
      { field: 'qSortValue', label: 'Q-Sort Value' },
      { 
        field: 'adminID', 
        label: 'Admin Name',
        render: (item) => {
          if (user?.role === 'admin') {
            return user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : 'Current Admin';
          }
          const admin = clientUsers.find(user => user.id === item.adminID);
          return admin ? `${admin.firstName} ${admin.lastName}` : 'Unknown';
        }
      }
    ]
  };

  // Handle edit, delete and add functions
  const handleDelete = async (table, item) => {
    try {
      const headers = {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      };

      const response = await fetch(`${kAPI_URL}/api/${table}/${item[Object.keys(item)[0]]}`, {
        method: 'DELETE',
        headers
      });

      const responseData = await response.json();

      if (!responseData.Error) {
        // Refresh data
        const updatedData = await fetchData(table);
        switch (table) {
          case 'distribution':
            setDistributionData(updatedData);
            break;
          case 'study':
            setStudyData(updatedData);
            break;
          case 'respondent':
            setRespondentData(updatedData);
            break;
          case 'studyRound':
            setStudyRoundData(updatedData);
            break;
          case 'statement':
            setStatementData(updatedData);
            break;
          case 'studyStatement':
            setStudyStatementData(updatedData);
            break;
          case 'qsort':
            setQSortData(updatedData);
            break;
        }
        setSnackbar({
          open: true,
          message: responseData.Message || 'Data deleted successfully',
          severity: 'success',
        });
      } else {
        setSnackbar({
          open: true,
          message: responseData.Message || 'Failed to delete data',
          severity: 'error',
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to delete data',
        severity: 'error',
      });
    }
  };

  // 验证Distribution数据格式
  const validateDistributionFormat = (distributionDetails) => {
    // 检查是否为空
    if (!distributionDetails) {
      return { isValid: false, message: 'Distribution details cannot be empty' };
    }

    // 分割字符串并检查数量
    const numbers = distributionDetails.split(',');
    if (numbers.length !== 5) {
      return { isValid: false, message: 'Distribution must contain exactly 5 numbers, following the format of "x,x,x,x,x", e.g., "1,2,3,2,1".' };
    }

    // 定义投票选项的映射
    const votingOptions = {
      0: '-2',
      1: '-1',
      2: '0',
      3: '1',
      4: '2'
    };

    // 检查每个部分是否为非负数
    for (let i = 0; i < numbers.length; i++) {
      const num = numbers[i].trim();
      if (num === '') {
        return { isValid: false, message: `Distribution value for voting option ${votingOptions[i]} cannot be empty` };
      }
      if (isNaN(num)) {
        return { isValid: false, message: `Distribution value for voting option ${votingOptions[i]} must be a number` };
      }
      if (parseFloat(num) < 0) {
        return { isValid: false, message: `Distribution value for voting option ${votingOptions[i]} cannot be negative` };
      }
    }

    return { isValid: true };
  };

  const handleEdit = async (table, item, newData) => {
    if (!table || !newData) return;

    try {
      // 如果是Distribution表，验证数据格式
      if (table === 'distribution') {
        const validation = validateDistributionFormat(newData.distributionDetails);
        if (!validation.isValid) {
          setSnackbar({
            open: true,
            message: validation.message,
            severity: 'error',
          });
          return;
        }
      }

      // Remove adminID from newData
      const { adminID, ...dataToUpdate } = newData || {};
      
      // If Q-Sort data, special handling needed
      if (table === 'qsort') {
        // Find corresponding studyStatementID
        const studyStatement = studyStatementData.find(s => 
          s.statementID === dataToUpdate.statementID
        );
        
        if (!studyStatement) {
          throw new Error('Invalid statement selection');
        }

        // Update data
        dataToUpdate.studyStatementID = studyStatement.studyStatementID;
        dataToUpdate.respondentID = dataToUpdate.respondentID;
        dataToUpdate.qSortValue = dataToUpdate.qSortValue;
      }
      
      const response = await fetch(`${kAPI_URL}/api/${table}/${item[Object.keys(item)[0]]}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(dataToUpdate)
      });

      if (response.ok) {
        // Refresh data
        const updatedData = await fetchData(table);
        switch (table) {
          case 'distribution':
            setDistributionData(updatedData);
            break;
          case 'study':
            setStudyData(updatedData);
            break;
          case 'respondent':
            setRespondentData(updatedData);
            break;
          case 'studyRound':
            setStudyRoundData(updatedData);
            break;
          case 'statement':
            setStatementData(updatedData);
            break;
          case 'studyStatement':
            setStudyStatementData(updatedData);
            break;
          case 'qsort':
            setQSortData(updatedData);
            break;
        }
        setSnackbar({
          open: true,
          message: 'Data updated successfully',
          severity: 'success',
        });
      } else {
        const errorData = await response.json();
        setSnackbar({
          open: true,
          message: errorData.message || 'Failed to update data',
          severity: 'error',
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to update data',
        severity: 'error',
      });
    }
  };

  const handleAdd = async (tablename, newData) => {
    if (!tablename) return;

    try {
      // 如果是Distribution表，验证数据格式
      if (tablename === 'distribution') {
        const validation = validateDistributionFormat(newData.distributionDetails);
        if (!validation.isValid) {
          setSnackbar({
            open: true,
            message: validation.message,
            severity: 'error',
          });
          return;
        }
      }

      let response;
      switch (tablename) {
        case 'distribution':
          response = await fetch(`${kAPI_URL}/api/distribution`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ distributionDetails: newData.distributionDetails })
          });
          break;
        case 'study':
          response = await fetch(`${kAPI_URL}/api/study`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              studyName: newData.studyName,
              studyDate: newData.studyDate,
              distributionID: newData.distributionID
            })
          });
          break;
        case 'respondent':
          response = await fetch(`${kAPI_URL}/api/respondent`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              username: newData.username,
              rawPassword: newData.rawPassword,
              studyID: newData.studyID
            })
          });
          break;
        case 'studyRound':
          response = await fetch(`${kAPI_URL}/api/studyRound`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              studyID: newData.studyID,
              studyRound: newData.studyRound,
              roundDate: newData.roundDate
            })
          });
          break;
        case 'statement':
          response = await fetch(`${kAPI_URL}/api/statement`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              short: newData.short,
              statementText: newData.statementText
            })
          });
          break;
        case 'studyStatement':
          // Ensure studyID and statementID are numbers
          const studyID = parseInt(newData.studyID);
          const statementID = parseInt(newData.statementID);
          
          if (isNaN(studyID) || isNaN(statementID)) {
            throw new Error('Invalid study or statement ID');
          }

          response = await fetch(`${kAPI_URL}/api/studyStatement`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              studyID: studyID,
              statementID: statementID
            })
          });
          break;
        case 'qsort':
          // Find corresponding studyStatementID
          const studyStatement = studyStatementData.find(s => 
            s.statementID === newData.statementID
          );
          
          if (!studyStatement) {
            throw new Error('Invalid statement selection');
          }

          response = await fetch(`${kAPI_URL}/api/qsort`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              respondentID: newData.respondentID,
              studyStatementID: studyStatement.studyStatementID,
              qSortValue: newData.qSortValue
            })
          });
          break;
      }

      const responseData = await response.json();

      if (response.ok) {
        // Refresh data
        const updatedData = await fetchData(tablename);
        
        switch (tablename) {
          case 'distribution':
            setDistributionData(updatedData);
            break;
          case 'study':
            setStudyData(updatedData);
            break;
          case 'respondent':
            setRespondentData(updatedData);
            break;
          case 'studyRound':
            setStudyRoundData(updatedData);
            break;
          case 'statement':
            setStatementData(updatedData);
            break;
          case 'studyStatement':
            setStudyStatementData(updatedData);
            break;
          case 'qsort':
            setQSortData(updatedData);
            break;
        }
        setSnackbar({
          open: true,
          message: responseData.Message || 'Successfully added',
          severity: 'success',
        });
      } else {
        setSnackbar({
          open: true,
          message: responseData.Message || 'Failed to add',
          severity: 'error',
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to add',
        severity: 'error',
      });
    }
  };

  // Add batch add processing function
  const handleBulkAdd = async () => {
    if (!selectedStudy) {
      setSnackbar({
        open: true,
        message: 'Please select a study',
        severity: 'error',
      });
      return;
    }

    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      };

      // Generate batch add data
      const respondents = Array.from({ length: bulkCount }, (_, index) => {
        const timestamp = new Date().getTime();
        return {
          username: `respondent_${timestamp}_${index + 1}`,
          rawPassword: Math.random().toString(36).slice(-8),
          studyID: parseInt(selectedStudy)
        };
      });

      const response = await fetch(`${kAPI_URL}/api/respondent/bulk`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ respondents }),
      });

      const responseData = await response.json();

      if (response.ok) {
        // Refresh data
        const updatedData = await fetchData('respondent');
        setRespondentData(updatedData);
        setShowBulkAddModal(false);
        setBulkCount(1);
        setSelectedStudy('');
        setSnackbar({
          open: true,
          message: `Successfully added ${bulkCount} respondents`,
          severity: 'success',
        });
      } else {
        setSnackbar({
          open: true,
          message: responseData.Message || 'Failed to add respondents',
          severity: 'error',
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to add respondents',
        severity: 'error',
      });
    }
  };

  // Add new data processing function in ProjectManagement component
  const processQSortData = () => {
    // Get all unique respondents who have submitted Q-Sort data
    const respondentsWithData = [...new Set(qSortData.map(item => item.respondentID))];
    
    // Get all unique statements for the selected study
    const uniqueStatements = selectedStudyForQSort
      ? [...new Set(studyStatementData
          .filter(s => s.studyID === parseInt(selectedStudyForQSort))
          .map(s => {
            const statement = statementData.find(st => st.statementID === s.statementID);
            return statement ? statement.statementID : null;
          }))]
          .filter(Boolean)
      : [...new Set(qSortData.map(item => {
          const studyStatement = studyStatementData.find(s => s.studyStatementID === item.studyStatementID);
          if (studyStatement) {
            const statement = statementData.find(s => s.statementID === studyStatement.statementID);
            return statement ? statement.statementID : null;
          }
          return null;
        }))]
        .filter(Boolean);

    // Filter respondents by selected study if a study is selected
    const filteredRespondents = selectedStudyForQSort
      ? respondentData.filter(r => 
          r.studyID === parseInt(selectedStudyForQSort) && 
          respondentsWithData.includes(r.respondentID)
        )
      : respondentData.filter(r => respondentsWithData.includes(r.respondentID));

    // Create new data structure
    return filteredRespondents.map(respondent => {
      const rowData = {
        respondentID: respondent.respondentID,
        username: respondent.username,
        statements: {}
      };

      // Add Q-Sort value for each statement
      uniqueStatements.forEach(statementId => {
        const studyStatement = studyStatementData.find(s => 
          s.statementID === statementId && 
          (!selectedStudyForQSort || s.studyID === parseInt(selectedStudyForQSort))
        );
        if (studyStatement) {
          const qSortItem = qSortData.find(q => 
            q.respondentID === respondent.respondentID && 
            q.studyStatementID === studyStatement.studyStatementID
          );
          const statement = statementData.find(s => s.statementID === statementId);
          if (statement) {
            rowData.statements[statement.short] = qSortItem ? qSortItem.qSortValue : null;
          }
        }
      });

      return rowData;
    });
  };

  return (
    <Box sx={{ 
      width: '100%',
      bgcolor: 'background.default',
      minHeight: '100vh',
      p: 3
    }}>
      <Paper 
        elevation={0}
        sx={{ 
          p: 3,
          borderRadius: 2,
          boxShadow: 1,
          bgcolor: 'background.paper'
        }}
      >
        <Tabs
          value={currentTab}
          onChange={(e, newValue) => setCurrentTab(newValue)}
          sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            mb: 3,
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              minWidth: 200,
              '&.Mui-selected': {
                color: 'primary.main',
                fontWeight: 600,
              },
              '&:hover': {
                color: 'primary.main',
              }
            }
          }}
        >
          <Tab label="Distribution Management" />
          <Tab label="Study Management" />
          <Tab label="Statement Management" />
          <Tab label="Respondent Management" />
          <Tab label="Study Round Management" />
          <Tab label="Study Statement Management" />
          <Tab label="Q-Sort Data" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {currentTab === 0 && (
            <DataTable
              data={distributionData}
              columns={columns.distribution}
              onEdit={(item, newData) => handleEdit('distribution', item, newData)}
              onDelete={(item) => handleDelete('distribution', item)}
              onAdd={(tablename, newData) => handleAdd('distribution', newData)}
              currentTab={currentTab}
            />
          )}
          {currentTab === 1 && (
            <DataTable
              data={studyData}
              columns={columns.study}
              onEdit={(item, newData) => handleEdit('study', item, newData)}
              onDelete={(item) => handleDelete('study', item)}
              onAdd={(tablename, newData) => handleAdd('study', newData)}
              parentData={distributionData}
              currentTab={currentTab}
            />
          )}
          {currentTab === 2 && (
            <DataTable
              data={statementData}
              columns={columns.statement}
              onEdit={(item, newData) => handleEdit('statement', item, newData)}
              onDelete={(item) => handleDelete('statement', item)}
              onAdd={(tablename, newData) => handleAdd('statement', newData)}
              currentTab={currentTab}
            />
          )}
          {currentTab === 3 && (
            <DataTable
              data={respondentData}
              columns={columns.respondent}
              onEdit={(item, newData) => handleEdit('respondent', item, newData)}
              onDelete={(item) => handleDelete('respondent', item)}
              onAdd={(tablename, newData) => handleAdd(tablename, newData)}
              parentData={studyData}
              clientUsers={clientUsers}
              currentTab={currentTab}
              showBulkAddModal={showBulkAddModal}
              setShowBulkAddModal={setShowBulkAddModal}
              respondentData={respondentData}
              selectedStudy={selectedStudy}
              setSelectedStudy={setSelectedStudy}
            />
          )}
          {currentTab === 4 && (
            <DataTable
              data={studyRoundData}
              columns={columns.studyRound}
              onEdit={(item, newData) => handleEdit('studyRound', item, newData)}
              onDelete={(item) => handleDelete('studyRound', item)}
              onAdd={(tablename, newData) => handleAdd('studyRound', newData)}
              parentData={studyData}
              currentTab={currentTab}
              selectedStudy={selectedStudy}
              setSelectedStudy={setSelectedStudy}
            />
          )}
          {currentTab === 5 && (
            <DataTable
              data={studyStatementData}
              columns={columns.studyStatement}
              onEdit={(item, newData) => handleEdit('studyStatement', item, newData)}
              onDelete={(item) => handleDelete('studyStatement', item)}
              onAdd={(tablename, newData) => handleAdd('studyStatement', newData)}
              parentData={studyData}
              statementData={statementData}
              currentTab={currentTab}
              selectedStudy={selectedStudy}
              setSelectedStudy={setSelectedStudy}
            />
          )}
          {currentTab === 6 && (
            <DataTable
              data={processQSortData()}
              columns={[
                { 
                  field: 'username', 
                  label: 'Respondent',
                  render: (item) => item.username
                },
                ...Object.keys(processQSortData()[0]?.statements || {}).map(statement => ({
                  field: `statements.${statement}`,
                  label: statement,
                  render: (item) => {
                    const value = item.statements[statement];
                    return value === null || value === undefined ? '-' : value;
                  }
                })),
                {
                  field: 'actions',
                  label: 'Actions',
                  render: (item) => (
                    <Box>
                      <IconButton 
                        onClick={() => {
                          // Find all Q-Sort data for this respondent
                          const qSortItems = qSortData.filter(q => q.respondentID === item.respondentID);
                          
                          // Log
                          console.log('Q-Sort data to be deleted:', {
                            respondentID: item.respondentID,
                            username: item.username,
                            qSortItems: qSortItems
                          });

                          // Delete all related Q-Sort data
                          qSortItems.forEach(qSortItem => {
                            console.log('Deleting Q-Sort data:', qSortItem);
                            // Send delete request
                            fetch(`${kAPI_URL}/api/qsort/${qSortItem.respondentID}`, {
                              method: 'DELETE',
                              headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${localStorage.getItem('token')}`
                              },
                              body: JSON.stringify({
                                respondentID: qSortItem.respondentID,
                                roundID: qSortItem.roundID,
                                studyStatementID: qSortItem.studyStatementID
                              })
                            })
                            .then(response => {
                              if (!response.ok) {
                                throw new Error(`HTTP error! status: ${response.status}`);
                              }
                              return response.json();
                            })
                            .then(data => {
                              if (data.Error) {
                                console.error('Delete failed:', data.Message);
                                setSnackbar({
                                  open: true,
                                  message: data.Message || 'Delete failed',
                                  severity: 'error',
                                });
                              } else {
                                console.log('Delete successful:', data.Message);
                                // Refresh data
                                fetchData('qsort').then(data => setQSortData(data));
                                setSnackbar({
                                  open: true,
                                  message: 'Delete successful',
                                  severity: 'success',
                                });
                              }
                            })
                            .catch(error => {
                              console.error('Delete request failed:', error);
                              setSnackbar({
                                open: true,
                                message: 'Delete request failed: ' + error.message,
                                severity: 'error',
                              });
                            });
                          });
                        }}
                        sx={{ 
                          color: 'error.main',
                          '&:hover': { color: 'error.dark' }
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  )
                }
              ]}
              onDelete={(item) => handleDelete('qsort', item)}
              currentTab={currentTab}
              respondentData={respondentData}
              statementData={statementData}
              studyStatementData={studyStatementData}
              parentData={studyData}
              selectedStudyForQSort={selectedStudyForQSort}
              setSelectedStudyForQSort={setSelectedStudyForQSort}
            />
          )}
        </Box>
      </Paper>
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{
          '& .MuiAlert-root': {
            minWidth: '300px',
            justifyContent: 'center',
            boxShadow: 3,
            borderRadius: 2,
          }
        }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ 
            width: '100%',
            textAlign: 'center',
            '& .MuiAlert-message': {
              flex: 1,
              textAlign: 'center',
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Add batch add dialog */}
      <Dialog 
        open={showBulkAddModal} 
        onClose={() => setShowBulkAddModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Bulk Add Respondents</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Number of Respondents"
            type="number"
            value={bulkCount}
            onChange={(e) => setBulkCount(Math.max(1, parseInt(e.target.value) || 1))}
            inputProps={{ min: 1 }}
            required
            helperText="Required field"
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Select Study</InputLabel>
            <Select
              value={selectedStudy}
              onChange={(e) => setSelectedStudy(e.target.value)}
              label="Select Study"
            >
              {studyData.map((study) => (
                <MenuItem key={study.studyID} value={study.studyID}>
                  {study.studyName}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Required field</FormHelperText>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowBulkAddModal(false)}>Cancel</Button>
          <Button onClick={handleBulkAdd} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 