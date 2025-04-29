import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Divider,
  Alert,
  Checkbox,
  Snackbar,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import MuiAlert from '@mui/material/Alert';
import { kAPI_URL } from '../../api/utils/constants';
import { AuthContext } from '../../context/AuthProvider';

const StudyConfiguration = () => {
  const { user } = useContext(AuthContext);
  const [distributionData, setDistributionData] = useState([]);
  const [studyData, setStudyData] = useState([]);
  const [statementData, setStatementData] = useState([]);
  const [studyStatementData, setStudyStatementData] = useState([]);
  const [studyRoundData, setStudyRoundData] = useState([]);
  const [respondentData, setRespondentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDistribution, setSelectedDistribution] = useState(null);
  const [clientUsers, setClientUsers] = useState([]);

  // 添加完成状态
  const [completedSteps, setCompletedSteps] = useState({
    distribution: false,
    study: false,
    statement: false,
    studyStatement: false,
    studyRound: false,
    respondent: false
  });

  // 添加当前打开的标签页状态
  const [openSteps, setOpenSteps] = useState({
    distribution: true,
    study: false,
    statement: false,
    studyStatement: false,
    studyRound: false,
    respondent: false
  });

  // 编辑面板状态
  const [editConfig, setEditConfig] = useState({
    distribution: {
      distributionDetails: '',
    },
    study: {
      studyName: '',
      studyDate: new Date().toISOString().split('T')[0],
      distributionID: '',
    },
    statement: {
      short: '',
      statementText: '',
    },
    studyStatement: {
      studyID: '',
      statementID: '',
    },
    studyRound: {
      studyID: '',
      studyRound: 1,
      roundDate: new Date().toISOString().split('T')[0],
    },
    respondent: {
      username: '',
      password: '',
      studyID: '',
    }
  });

  // 保存的配置状态
  const [savedConfig, setSavedConfig] = useState({
    distribution: null,
    study: null,
    statement: null,
    studyStatement: null,
    studyRound: null,
    respondent: null
  });

  // 添加选中行的状态
  const [selectedRows, setSelectedRows] = useState({
    distribution: null,
    study: null,
    statement: null,
    studyStatement: null,
    studyRound: null,
    respondent: null
  });

  // 添加临时语句数据状态
  const [tempStatements, setTempStatements] = useState([]);

  // 添加表格展开状态
  const [isStatementTableExpanded, setIsStatementTableExpanded] = useState(false);

  // 添加选中的语句状态
  const [selectedStatements, setSelectedStatements] = useState([]);

  const [generatedRespondents, setGeneratedRespondents] = useState([]);

  const [respondentCount, setRespondentCount] = useState(10);

  const [editingRespondent, setEditingRespondent] = useState(null);

  // 添加错误消息状态
  const [errorMessage, setErrorMessage] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Add Alert component
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  // Add handleClose for Snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const steps = [
    {
      label: 'Distribution Setup',
      description: 'Configure the distribution pattern for your study. Select one existing distribution or create a new one.',
      table: 'distribution',
      columns: [
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
    },
    {
      label: 'Study Creation',
      description: 'Create a new study and link it to the selected distribution.',
      table: 'study',
      columns: [
        { field: 'studyID', label: 'ID' },
        { field: 'studyName', label: 'Name' },
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
    },
    {
      label: 'Statement Management',
      description: 'Add statements for your study. Click on show statements to view all existing statements. You can add new statements by uploading a CSV file or manually adding statements one by one.',
      table: 'statement',
      columns: [
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
    },
    {
      label: 'Study Statement Assignment',
      description: 'Assign statements to your study by clicking the boxes in the select column. You can also unselect statements by clicking the boxes again.',
      table: 'studyStatement',
      columns: [
        { field: 'short', label: 'Short' },
        { field: 'statementText', label: 'Statement Text' },
        { 
          field: 'adminID', 
          label: 'Admin Name',
          render: (item) => {
            if (item.adminName) {
              return item.adminName;
            }
            if (user?.role === 'admin') {
              return user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : 'Current Admin';
            }
            const admin = clientUsers.find(user => user.id === item.adminID);
            return admin ? `${admin.firstName} ${admin.lastName}` : 'Current Admin';
          }
        }
      ],
    },
    {
      label: 'Study Round Setup',
      description: 'Configure your study rounds. By default, you should start with the first round.',
      table: 'studyRound',
      columns: [
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
    },
    {
      label: 'Respondent Management',
      description: 'Add respondents to your study by selecting the number of respondents you want to add.',
      table: 'respondent',
      columns: [
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
    },
  ];

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
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const response = await fetch(`${kAPI_URL}/users/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        console.error('Failed to fetch client users:', response.status, response.statusText);
        return;
      }

      const result = await response.json();
      
      if (Array.isArray(result)) {
        setClientUsers(result);
      } else {
        console.error('Invalid response format:', result);
        setClientUsers([]);
      }
    } catch (error) {
      console.error('Error fetching client users:', error);
      setClientUsers([]);
    }
  };

  // Load all data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [
          distribution,
          study,
          statement,
          studyStatement,
          studyRound,
          respondent,
        ] = await Promise.all([
          fetchData('distribution'),
          fetchData('study'),
          fetchData('statement'),
          fetchData('studyStatement'),
          fetchData('studyRound'),
          fetchData('respondent'),
        ]);

        setDistributionData(distribution);
        setStudyData(study);
        setStatementData(statement);
        setStudyStatementData(studyStatement);
        setStudyRoundData(studyRound);
        setRespondentData(respondent);
        
        // Get admin user data
      } catch (error) {
        console.error('Failed to load data:', error);
      }
      setLoading(false);
    };

    loadData();
  }, []);

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

  // 处理行选择
  const handleRowSelect = (step, item) => {
    setSelectedRows(prev => ({
      ...prev,
      [step]: item
    }));

    // 更新配置表单
    setEditConfig(prev => ({
      ...prev,
      [step]: {
        ...Object.keys(prev[step]).reduce((acc, key) => {
          acc[key] = item[key] || '';
          return acc;
        }, {})
      }
    }));

    // 更新保存的配置
    setSavedConfig(prev => ({
      ...prev,
      [step]: {
        ...item,
        // 确保 distributionID 被正确保存
        ...(step === 'distribution' && item.distributionID ? { distributionID: item.distributionID } : {}),
        // 确保 studyID 被正确保存
        ...(step === 'study' && item.studyID ? { studyID: item.studyID } : {})
      }
    }));
  };

  // 处理配置更新
  const handleConfigChange = (step, field, value) => {
    setEditConfig(prev => ({
      ...prev,
      [step]: {
        ...prev[step],
        [field]: value
      }
    }));
  };

  // 处理临时语句添加
  const handleAddTempStatement = () => {
    if (editConfig.statement.short && editConfig.statement.statementText) {
      const newStatement = {
        statementID: `temp_${Date.now()}`,
        short: editConfig.statement.short,
        statementText: editConfig.statement.statementText,
        adminID: user?.id
      };
      setTempStatements(prev => [...prev, newStatement]);
      // 重置表单
      setEditConfig(prev => ({
        ...prev,
        statement: {
          short: '',
          statementText: ''
        }
      }));
    }
  };

  // 处理临时语句删除
  const handleDeleteTempStatement = (statementID) => {
    setTempStatements(prev => prev.filter(stmt => stmt.statementID !== statementID));
  };

  // 获取当前选中的 distribution 的总数
  const getSelectedDistributionTotal = () => {
    if (!savedConfig.distribution?.distributionDetails) return 0;
    return savedConfig.distribution.distributionDetails
      .split(',')
      .map(num => parseInt(num.trim()))
      .reduce((sum, num) => sum + num, 0);
  };

  // 处理语句选择
  const handleStatementSelect = (statementID) => {
    const totalRequired = getSelectedDistributionTotal();
    setSelectedStatements(prev => {
      if (prev.includes(statementID)) {
        return prev.filter(id => id !== statementID);
      } else if (prev.length < totalRequired) {
        return [...prev, statementID];
      }
      return prev;
    });
  };

  // 处理下一步
  const handleNext = async (currentStep) => {
    if (currentStep === 'distribution') {
      const validation = validateDistributionFormat(editConfig.distribution.distributionDetails);
      if (!validation.isValid) {
        setErrorMessage(validation.message);
        return;
      }
    }

    // Create new saved configuration object
    const newSavedConfig = { ...savedConfig };

    if (currentStep === 'distribution') {
      setErrorMessage('');
      newSavedConfig.distribution = {
        ...editConfig.distribution
      };
    } else if (currentStep === 'study') {
      if (!editConfig.study.studyName || !editConfig.study.studyDate) {
        setErrorMessage('Please fill in all required fields');
        return;
      }
      if (!savedConfig.distribution?.distributionDetails) {
        setErrorMessage('Please complete the distribution step first');
        return;
      }
      newSavedConfig.study = {
        studyName: editConfig.study.studyName,
        studyDate: editConfig.study.studyDate,
        distributionID: savedConfig.distribution.distributionID
      };
    } else if (currentStep === 'statement' && tempStatements.length > 0) {
      newSavedConfig.statement = {
        statements: tempStatements
      };
    } else if (currentStep === 'studyStatement' && selectedStatements.length > 0) {
      // 合并新语句和旧语句的 ID
      const allStatements = [
        ...tempStatements.map(stmt => stmt.statementID),
        ...statementData.map(stmt => stmt.statementID)
      ];
      
      // 只保存选中的语句
      newSavedConfig.studyStatement = {
        studyID: savedConfig.study.studyID,
        statements: selectedStatements.filter(id => allStatements.includes(id))
      };
    } else if (currentStep === 'studyRound') {
      // Ensure study round configuration contains all required data
      if (!editConfig.studyRound.roundDate) {
        setErrorMessage('Please fill in all required fields');
        return;
      }

      // Ensure studyRound has a value
      const studyRoundValue = editConfig.studyRound.studyRound || 1;
      
      newSavedConfig.studyRound = {
        studyRound: studyRoundValue,
        roundDate: editConfig.studyRound.roundDate
      };
    } else {
      newSavedConfig[currentStep] = editConfig[currentStep];
    }

    // Update saved configuration
    setSavedConfig(newSavedConfig);

    // Mark current step as completed
    setCompletedSteps(prev => ({
      ...prev,
      [currentStep]: true
    }));

    // Close current tab and open next tab
    const stepOrder = ['distribution', 'study', 'statement', 'studyStatement', 'studyRound', 'respondent'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setOpenSteps(prev => ({
        ...prev,
        [currentStep]: false,
        [stepOrder[currentIndex + 1]]: true
      }));
    }

    // Reset edit configuration
    setEditConfig(prev => ({
      ...prev,
      [currentStep]: {
        ...Object.keys(prev[currentStep]).reduce((acc, key) => {
          acc[key] = key === 'studyRound' ? 1 : '';
          return acc;
        }, {})
      }
    }));
  };

  // Handle final submit
  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      const headers = {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };

      // Validate all required steps are completed
      const requiredSteps = ['distribution', 'study', 'statement', 'studyStatement', 'studyRound', 'respondent'];
      const incompleteSteps = requiredSteps.filter(step => !completedSteps[step]);
      
      if (incompleteSteps.length > 0) {
        setErrorMessage('Please complete all steps before submitting');
        return;
      }

      // 1. Process distribution
      let distributionID;
      if (!savedConfig.distribution) {
        throw new Error('Distribution configuration is missing');
      }

      if (savedConfig.distribution.distributionID && savedConfig.distribution.distributionID !== 'new') {
        // Use existing distribution
        distributionID = savedConfig.distribution.distributionID;
      } else {
        // Create new distribution
        const distributionResponse = await fetch(`${kAPI_URL}/api/distribution`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            distributionDetails: savedConfig.distribution.distributionDetails,
            adminID: user?.id
          })
        });

        if (!distributionResponse.ok) {
          const errorData = await distributionResponse.json();
          throw new Error(`Failed to create distribution: ${errorData.message || distributionResponse.statusText}`);
        }

        // Query the latest distribution record
        const distributionQueryResponse = await fetch(`${kAPI_URL}/api/distribution`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!distributionQueryResponse.ok) {
          throw new Error('Failed to query distribution data');
        }

        const distributionQueryData = await distributionQueryResponse.json();

        // Find the newly created distribution
        const latestDistribution = distributionQueryData.data.find(dist => 
          dist.distributionDetails === savedConfig.distribution.distributionDetails
        );

        if (!latestDistribution) {
          throw new Error('Failed to find newly created distribution');
        }

        distributionID = latestDistribution.distributionID;

        // Update distributionID in savedConfig
        setSavedConfig(prev => ({
          ...prev,
          distribution: {
            ...prev.distribution,
            distributionID: distributionID
          }
        }));
      }

      // 2. Process study
      let studyID;
      if (!savedConfig.study) {
        throw new Error('Study configuration is missing');
      }

      if (savedConfig.study.studyID) {
        // Use existing study
        studyID = savedConfig.study.studyID;
      } else if (savedConfig.study.studyName) {
        // Create new study
        const studyResponse = await fetch(`${kAPI_URL}/api/study`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            studyName: savedConfig.study.studyName,
            studyDate: savedConfig.study.studyDate,
            distributionID: distributionID,
            adminID: user?.id
          })
        });

        if (!studyResponse.ok) {
          const errorData = await studyResponse.json();
          throw new Error(`Failed to create study: ${errorData.message || studyResponse.statusText}`);
        }

        // Query the latest study record
        const studyQueryResponse = await fetch(`${kAPI_URL}/api/study`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!studyQueryResponse.ok) {
          throw new Error('Failed to query study data');
        }

        const studyQueryData = await studyQueryResponse.json();

        // Find the newly created study
        const latestStudy = studyQueryData.data.find(study => 
          study.studyName === savedConfig.study.studyName && 
          study.distributionID === distributionID
        );

        if (!latestStudy) {
          throw new Error('Failed to find newly created study');
        }

        studyID = latestStudy.studyID;

        // Update studyID in savedConfig
        setSavedConfig(prev => ({
          ...prev,
          study: {
            ...prev.study,
            studyID: studyID
          }
        }));
      } else {
        throw new Error('Study name is missing');
      }

      // 3. Process statements
      const statementIDs = [];
      const tempToActualIDMap = new Map(); // 用于存储临时ID到实际ID的映射
      
      if (savedConfig.statement?.statements && Array.isArray(savedConfig.statement.statements)) {
        for (const statement of savedConfig.statement.statements) {
          // Check if it's a new statement (temporary ID starts with 'temp_')
          if (statement.statementID.startsWith('temp_')) {
            // Create new statement
            const statementResponse = await fetch(`${kAPI_URL}/api/statement`, {
              method: 'POST',
              headers,
              body: JSON.stringify({
                short: statement.short,
                statementText: statement.statementText,
                adminID: user?.id
              })
            });

            if (!statementResponse.ok) {
              throw new Error('Failed to create statement');
            }

            // Query the latest statement record
            const statementQueryResponse = await fetch(`${kAPI_URL}/api/statement`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            });

            if (!statementQueryResponse.ok) {
              throw new Error('Failed to query statement data');
            }

            const statementQueryData = await statementQueryResponse.json();

            // Find the newly created statement
            const latestStatement = statementQueryData.data.find(stmt => 
              stmt.short === statement.short && 
              stmt.statementText === statement.statementText
            );

            if (!latestStatement) {
              throw new Error('Failed to find newly created statement');
            }

            // 保存临时ID到实际ID的映射
            tempToActualIDMap.set(statement.statementID, latestStatement.statementID);
            statementIDs.push(latestStatement.statementID);
          } else {
            // Use existing statement ID
            statementIDs.push(statement.statementID);
          }
        }
      }

      // 4. Process study statements
      if (savedConfig.studyStatement?.statements && Array.isArray(savedConfig.studyStatement.statements)) {
        // 转换选中的语句ID（将临时ID转换为实际ID）
        const selectedStatementIDs = savedConfig.studyStatement.statements.map(id => {
          if (typeof id === 'string' && id.startsWith('temp_')) {
            return tempToActualIDMap.get(id);
          }
          return id;
        }).filter(id => id); // 过滤掉undefined的值

        // 使用转换后的ID创建study statement关联
        for (const statementID of selectedStatementIDs) {
          const studyStatementResponse = await fetch(`${kAPI_URL}/api/studyStatement`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              studyID: studyID,
              statementID: statementID,
              adminID: user?.id
            })
          });

          console.log("studyID", studyID);
          console.log("statementID", statementID);

          if (!studyStatementResponse.ok) {
            const errorData = await studyStatementResponse.json();
            throw new Error(`Failed to create study statement: ${errorData.message || studyStatementResponse.statusText}`);
          }
        }
      }

      // 5. Process study round
      if (savedConfig.studyRound?.studyRound && savedConfig.studyRound?.roundDate) {
        const studyRoundResponse = await fetch(`${kAPI_URL}/api/studyRound`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            studyID: studyID,
            studyRound: savedConfig.studyRound.studyRound,
            roundDate: savedConfig.studyRound.roundDate,
            adminID: user?.id
          })
        });

        if (!studyRoundResponse.ok) {
          const errorData = await studyRoundResponse.json();
          throw new Error(`Failed to create study round: ${errorData.message || studyRoundResponse.statusText}`);
        }
      }

      // 6. Process respondents
      for (const respondent of generatedRespondents) {
        const respondentResponse = await fetch(`${kAPI_URL}/api/respondent`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            username: respondent.username,
            rawPassword: respondent.rawPassword,
            studyID: studyID,
            adminID: user?.id
          })
        });

        if (!respondentResponse.ok) {
          throw new Error('Failed to create respondent');
        }
      }

      // Reset all states
      setSavedConfig({
        distribution: null,
        study: null,
        statement: null,
        studyStatement: null,
        studyRound: null,
        respondent: null
      });
      setCompletedSteps({
        distribution: false,
        study: false,
        statement: false,
        studyStatement: false,
        studyRound: false,
        respondent: false
      });
      setEditConfig({
        distribution: { distributionDetails: '' },
        study: { studyName: '', studyDate: new Date().toISOString().split('T')[0], distributionID: '' },
        statement: { short: '', statementText: '' },
        studyStatement: { studyID: '', statementID: '' },
        studyRound: { studyID: '', studyRound: 1, roundDate: new Date().toISOString().split('T')[0] },
        respondent: { username: '', password: '', studyID: '' }
      });
      setOpenSteps({
        distribution: true,
        study: false,
        statement: false,
        studyRound: false,
        studyStatement: false,
        respondent: false
      });
      setGeneratedRespondents([]);
      setErrorMessage('');

      // Show success message
      setSnackbar({
        open: true,
        message: `Study "${savedConfig.study.studyName}" has been successfully created`,
        severity: 'success'
      });

    } catch (error) {
      setErrorMessage(error.message || 'Failed to submit configurations');
      setSnackbar({
        open: true,
        message: error.message || 'Failed to submit configurations',
        severity: 'error'
      });
    }
    setLoading(false);
  };

  // 处理标签页打开/关闭
  const handleStepToggle = (step, isOpen) => {
    setOpenSteps(prev => ({
      ...prev,
      [step]: isOpen
    }));

    // 如果打开标签页且有保存的配置，更新编辑面板
    if (isOpen && savedConfig[step]) {
      setEditConfig(prev => ({
        ...prev,
        [step]: {
          ...prev[step],
          ...savedConfig[step]
        }
      }));
    } else if (!isOpen) {
      // 如果关闭标签页，重置编辑面板为初始状态
      setEditConfig(prev => ({
        ...prev,
        [step]: {
          ...Object.keys(prev[step]).reduce((acc, key) => {
            acc[key] = key === 'studyRound' ? 1 : '';
            return acc;
          }, {})
        }
      }));
    }
  };

  // 重置所有状态
  const handleReset = () => {
    setSavedConfig({
      distribution: null,
      study: null,
      statement: null,
      studyStatement: null,
      studyRound: null,
      respondent: null
    });
    setCompletedSteps({
      distribution: false,
      study: false,
      statement: false,
      studyStatement: false,
      studyRound: false,
      respondent: false
    });
    setEditConfig({
      distribution: { distributionDetails: '' },
      study: { studyName: '', studyDate: new Date().toISOString().split('T')[0], distributionID: '' },
      statement: { short: '', statementText: '' },
      studyStatement: { studyID: '', statementID: '' },
      studyRound: { studyID: '', studyRound: 1, roundDate: new Date().toISOString().split('T')[0] },
      respondent: { username: '', password: '', studyID: '' }
    });
    setOpenSteps({
      distribution: true,
      study: false,
      statement: false,
      studyRound: false,
      studyStatement: false,
      respondent: false
    });
  };

  // 获取当前可用的 distributions（包括新创建的）
  const getAvailableDistributions = () => {
    const savedDistribution = savedConfig.distribution;
    if (savedDistribution && !distributionData.some(d => d.distributionDetails === savedDistribution.distributionDetails)) {
      return [...distributionData, { distributionID: 'new', distributionDetails: savedDistribution.distributionDetails }];
    }
    return distributionData;
  };

  // 处理批量创建受访者
  const handleBulkAddRespondents = async () => {
    setLoading(true);
    try {
      // 获取选中的研究名称
      const studyName = savedConfig.study?.studyName.replace(/\s+/g, '_') || '';

      // 生成批量添加数据
      const respondents = Array.from({ length: respondentCount }, (_, index) => {
        const timestamp = new Date().getTime();
        return {
          respondentID: `temp_${timestamp}_${index}`,
          username: `${studyName}_respondent_${timestamp}_${index + 1}`,
          rawPassword: Math.random().toString(36).slice(-8)
        };
      });
      
      setGeneratedRespondents(respondents);
      
      // 标记步骤为完成
      setCompletedSteps(prev => ({
        ...prev,
        respondent: true
      }));

    } catch (error) {
      console.error('Failed to create respondents:', error);
      setGeneratedRespondents([]);
    }
    setLoading(false);
  };

  // 处理编辑受访者
  const handleEditRespondent = (respondent) => {
    setEditingRespondent(respondent);
  };

  // 处理删除受访者
  const handleDeleteRespondent = (respondentId) => {
    setGeneratedRespondents(prev => prev.filter(r => r.respondentID !== respondentId));
  };

  // 处理保存编辑
  const handleSaveEdit = (updatedRespondent) => {
    setGeneratedRespondents(prev => 
      prev.map(r => r.respondentID === updatedRespondent.respondentID ? updatedRespondent : r)
    );
    setEditingRespondent(null);
  };

  // Add function to download CSV template
  const downloadCSVTemplate = () => {
    const csvContent = "short,statementText\nExample1,This is an example statement 1\nExample2,This is an example statement 2";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'statement_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Add function to handle CSV file upload
  const handleCSVUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(header => header.trim());
      
      if (headers[0] !== 'short' || headers[1] !== 'statementText') {
        setSnackbar({
          open: true,
          message: 'Invalid CSV format. Please use the provided template.',
          severity: 'error'
        });
        return;
      }

      const newStatements = [];
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        const values = lines[i].split(',').map(value => value.trim());
        if (values.length >= 2) {
          newStatements.push({
            statementID: `temp_${Date.now()}_${i}`,
            short: values[0],
            statementText: values[1],
            adminID: user?.id
          });
        }
      }

      if (newStatements.length > 0) {
        setTempStatements(prev => [...prev, ...newStatements]);
        setSnackbar({
          open: true,
          message: `${newStatements.length} statements have been added successfully`,
          severity: 'success'
        });
      } else {
        setSnackbar({
          open: true,
          message: 'No valid statements found in the CSV file',
          severity: 'warning'
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Study Configuration</h1>
        <p className="text-base-content/70">Configure your study step by step</p>
      </div>
      
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div 
            key={index} 
            className="collapse collapse-arrow bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100"
          >
            <input 
              type="checkbox" 
              className="peer" 
              checked={openSteps[step.table]}
              onChange={(e) => handleStepToggle(step.table, e.target.checked)}
            />
            <div className="collapse-title text-xl font-medium bg-zinc-200 text-zinc-800 rounded-t-lg peer-checked:rounded-t-none border-b border-zinc-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="mr-4 text-primary font-bold">{index + 1}.</span>
                  <span className="font-semibold">{step.label}</span>
                </div>
                {completedSteps[step.table] && (
                  <CheckCircleIcon className="text-green-500" />
                )}
              </div>
            </div>
            <div className="collapse-content bg-white rounded-b-lg">
              <div className="p-4">
                <p className="text-gray-600 mb-4">{step.description}</p>
                
                {/* 显示错误消息 */}
                {step.table === 'distribution' && errorMessage && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {errorMessage}
                  </Alert>
                )}
                
                {/* 只在非 Study Creation、Study Round 和 Respondent 步骤显示表格 */}
                {step.table !== 'study' && step.table !== 'studyRound' && step.table !== 'respondent' && (
                  <>
                    {step.table === 'statement' && (
                      <Box sx={{ mb: 2 }}>
                        <Button
                          variant="outlined"
                          onClick={() => setIsStatementTableExpanded(!isStatementTableExpanded)}
                          endIcon={isStatementTableExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        >
                          {isStatementTableExpanded ? 'Hide Existing Statements' : 'Show Existing Statements'}
                        </Button>
                      </Box>
                    )}
                    {(!isStatementTableExpanded && step.table === 'statement') ? null : (
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
                              {step.columns.map((column) => (
                                <TableCell key={column.field}>{column.label}</TableCell>
                              ))}
                              {step.table === 'studyStatement' && <TableCell>Select</TableCell>}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {(() => {
                              switch (step.table) {
                                case 'distribution':
                                  return distributionData;
                                case 'statement':
                                  return statementData;
                                case 'studyStatement':
                                  return [...tempStatements.map(stmt => ({
                                    ...stmt,
                                    adminID: user?.id,
                                    adminName: 'Current Admin'
                                  })), ...statementData];
                                case 'studyRound':
                                  return studyRoundData;
                                case 'respondent':
                                  return respondentData;
                                default:
                                  return [];
                              }
                            })().map((item) => (
                              <TableRow 
                                key={item[step.columns[0].field]}
                                onClick={step.table !== 'studyStatement' ? () => handleRowSelect(step.table, item) : undefined}
                                sx={{
                                  cursor: step.table !== 'studyStatement' ? 'pointer' : 'default',
                                  backgroundColor: step.table !== 'studyStatement' && 
                                                 editConfig[step.table][`${step.table}ID`] === item[`${step.table}ID`] ? 
                                                 '#e3f2fd' : 'inherit',
                                  '&:hover': {
                                    backgroundColor: '#f8f8f8',
                                  }
                                }}
                              >
                                {step.columns.map((column) => (
                                  <TableCell key={column.field}>
                                    {column.render ? column.render(item) : 
                                     column.field === 'adminID' && item.adminName ? item.adminName : 
                                     item[column.field]}
                                  </TableCell>
                                ))}
                                {step.table === 'studyStatement' && (
                                  <TableCell>
                                    <Checkbox
                                      checked={selectedStatements.includes(item.statementID)}
                                      onChange={() => handleStatementSelect(item.statementID)}
                                      disabled={!selectedStatements.includes(item.statementID) && 
                                               selectedStatements.length >= getSelectedDistributionTotal()}
                                    />
                                  </TableCell>
                                )}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                  </>
                )}

                {/* 配置表单 - 只在非 Study Statement 和 Respondent 步骤显示 */}
                {step.table !== 'studyStatement' && step.table !== 'respondent' && (
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      {savedConfig[step.table] ? `Edit ${step.label.replace(/ (Setup|Creation|Management)$/, '')}` : `New ${step.label.replace(/ (Setup|Creation|Management)$/, '')}`}
                    </Typography>
                    <Paper sx={{ p: 3, mb: 2 }}>
                      {step.table === 'distribution' && (
                        <>
                          <TextField
                            fullWidth
                            label="Distribution Details"
                            value={editConfig.distribution.distributionDetails}
                            onChange={(e) => handleConfigChange('distribution', 'distributionDetails', e.target.value)}
                            helperText="Enter 5 numbers separated by commas (e.g., 1,2,3,2,1)"
                            sx={{ mb: 2 }}
                          />
                        </>
                      )}

                      {step.table === 'study' && (
                        <>
                          <TextField
                            fullWidth
                            label="Study Name"
                            value={editConfig.study.studyName}
                            onChange={(e) => handleConfigChange('study', 'studyName', e.target.value)}
                            sx={{ mb: 2 }}
                          />
                          <TextField
                            fullWidth
                            label="Study Date"
                            type="date"
                            value={editConfig.study.studyDate}
                            onChange={(e) => handleConfigChange('study', 'studyDate', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            sx={{ mb: 2 }}
                          />
                          <TextField
                            fullWidth
                            label="Distribution"
                            value={savedConfig.distribution?.distributionDetails || ''}
                            disabled
                            sx={{ mb: 2 }}
                          />
                        </>
                      )}

                      {step.table === 'statement' && (
                        <>
                          {/* 批量上传部分 */}
                          <Box sx={{ mb: 4 }}>
                            <Typography variant="subtitle1" sx={{ mb: 2, color: 'primary.main', fontWeight: 'bold' }}>
                              Bulk Upload Statements
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                              <Button
                                variant="outlined"
                                startIcon={<DownloadIcon />}
                                onClick={downloadCSVTemplate}
                                sx={{ 
                                  borderColor: 'primary.main',
                                  color: 'primary.main',
                                  '&:hover': {
                                    borderColor: 'primary.dark',
                                    backgroundColor: 'primary.light',
                                    color: 'primary.dark'
                                  }
                                }}
                              >
                                Download Template
                              </Button>
                              <Typography variant="body2" color="text.secondary">
                                Download the CSV template and fill in your statements
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Button
                                variant="contained"
                                component="label"
                                startIcon={<UploadIcon />}
                                sx={{ 
                                  backgroundColor: 'primary.main',
                                  '&:hover': {
                                    backgroundColor: 'primary.dark'
                                  }
                                }}
                              >
                                Upload CSV
                                <input
                                  type="file"
                                  hidden
                                  accept=".csv"
                                  onChange={handleCSVUpload}
                                />
                              </Button>
                              <Typography variant="body2" color="text.secondary">
                                Upload your filled CSV file to add multiple statements at once
                              </Typography>
                            </Box>
                          </Box>

                          <Divider sx={{ my: 3 }}>
                            <Typography variant="body2" color="text.secondary">
                              OR
                            </Typography>
                          </Divider>

                          {/* 单个语句添加部分 */}
                          <Box>
                            <Typography variant="subtitle1" sx={{ mb: 2, color: 'primary.main', fontWeight: 'bold' }}>
                              Add Individual Statement
                            </Typography>
                            <TextField
                              fullWidth
                              label="Short"
                              value={editConfig.statement.short}
                              onChange={(e) => handleConfigChange('statement', 'short', e.target.value)}
                              sx={{ mb: 2 }}
                            />
                            <TextField
                              fullWidth
                              label="Statement Text"
                              multiline
                              rows={4}
                              value={editConfig.statement.statementText}
                              onChange={(e) => handleConfigChange('statement', 'statementText', e.target.value)}
                              sx={{ mb: 2 }}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                              <Button
                                variant="contained"
                                onClick={handleAddTempStatement}
                                disabled={!editConfig.statement.short || !editConfig.statement.statementText}
                                sx={{ 
                                  backgroundColor: 'primary.main',
                                  '&:hover': {
                                    backgroundColor: 'primary.dark'
                                  }
                                }}
                              >
                                Add Statement
                              </Button>
                            </Box>
                          </Box>

                          {/* 临时语句表格 */}
                          {tempStatements.length > 0 && (
                            <Box sx={{ mt: 4 }}>
                              <Typography variant="subtitle1" sx={{ mb: 2, color: 'primary.main', fontWeight: 'bold' }}>
                                Temporary Statements ({tempStatements.length})
                              </Typography>
                              <TableContainer 
                                component={Paper} 
                                sx={{ 
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
                                      <TableCell>Short</TableCell>
                                      <TableCell>Statement Text</TableCell>
                                      <TableCell>Actions</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {tempStatements.map((item) => (
                                      <TableRow key={item.statementID}>
                                        <TableCell>{item.short}</TableCell>
                                        <TableCell>{item.statementText}</TableCell>
                                        <TableCell>
                                          <Button
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            onClick={() => handleDeleteTempStatement(item.statementID)}
                                          >
                                            Delete
                                          </Button>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </Box>
                          )}
                        </>
                      )}

                      {step.table === 'studyRound' && (
                        <>
                          <TextField
                            fullWidth
                            label="Study"
                            value={savedConfig.study?.studyName || ''}
                            disabled
                            sx={{ mb: 2 }}
                          />
                          <TextField
                            fullWidth
                            label="Study Round"
                            type="number"
                            value={editConfig.studyRound.studyRound || 1}
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              if (value > 0) {
                                handleConfigChange('studyRound', 'studyRound', value);
                              }
                            }}
                            inputProps={{ min: 1 }}
                            sx={{ mb: 2 }}
                          />
                          <TextField
                            fullWidth
                            label="Round Date"
                            type="date"
                            value={editConfig.studyRound.roundDate}
                            onChange={(e) => handleConfigChange('studyRound', 'roundDate', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                          />
                        </>
                      )}

                      {step.table === 'respondent' && (
                        <>
                          <TextField
                            fullWidth
                            label="Username"
                            value={editConfig.respondent.username}
                            onChange={(e) => handleConfigChange('respondent', 'username', e.target.value)}
                            sx={{ mb: 2 }}
                          />
                          <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            value={editConfig.respondent.password}
                            onChange={(e) => handleConfigChange('respondent', 'password', e.target.value)}
                            sx={{ mb: 2 }}
                          />
                          <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Study</InputLabel>
                            <Select
                              value={editConfig.respondent.studyID}
                              onChange={(e) => handleConfigChange('respondent', 'studyID', e.target.value)}
                              label="Study"
                            >
                              {studyData.map((study) => (
                                <MenuItem key={study.studyID} value={study.studyID}>
                                  {study.studyName}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </>
                      )}

                      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button
                          variant="contained"
                          onClick={() => handleNext(step.table)}
                          disabled={loading || (step.table === 'studyStatement' && 
                                              selectedStatements.length !== getSelectedDistributionTotal())}
                        >
                          {loading ? 'Processing...' : 'Next'}
                        </Button>
                      </Box>
                    </Paper>
                  </Box>
                )}

                {/* 为 Study Statement Assignment 添加 Next 按钮 */}
                {step.table === 'studyStatement' && (
                  <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button
                      variant="contained"
                      onClick={() => handleNext(step.table)}
                      disabled={loading || selectedStatements.length !== getSelectedDistributionTotal()}
                    >
                      {loading ? 'Processing...' : 'Next'}
                    </Button>
                  </Box>
                )}

                {/* 为 Respondent Management 添加批量添加按钮和表格 */}
                {step.table === 'respondent' && (
                  <Box sx={{ mt: 4 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mb: 4 }}>
                      <TextField
                        label="Number of Respondents"
                        type="number"
                        value={respondentCount}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (value > 0) {
                            setRespondentCount(value);
                          }
                        }}
                        inputProps={{ min: 1 }}
                        sx={{ width: 200 }}
                      />
                      <Button
                        variant="contained"
                        size="large"
                        onClick={handleBulkAddRespondents}
                        disabled={loading}
                        sx={{ 
                          minWidth: 200,
                          height: 48,
                          fontSize: '1.1rem'
                        }}
                      >
                        {loading ? 'Processing...' : 'Create Respondents'}
                      </Button>
                    </Box>

                    {generatedRespondents && generatedRespondents.length > 0 && (
                      <TableContainer 
                        component={Paper} 
                        sx={{ 
                          mt: 4,
                          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                          borderRadius: '8px',
                          '& .MuiTableCell-root': {
                            padding: '12px 16px',
                            fontSize: '0.875rem',
                            borderBottom: '1px solid rgba(224, 224, 224, 1)',
                          },
                          '& .MuiTableHead-root': {
                            backgroundColor: '#f8f9fa',
                          },
                          '& .MuiTableHead-root .MuiTableCell-root': {
                            fontWeight: 600,
                            color: '#333',
                            backgroundColor: '#f8f9fa',
                          },
                          '& .MuiTableRow-root:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                          },
                          '& .MuiTableRow-root.Mui-selected': {
                            backgroundColor: 'rgba(25, 118, 210, 0.08)',
                          },
                          '& .MuiTableRow-root.Mui-selected:hover': {
                            backgroundColor: 'rgba(25, 118, 210, 0.12)',
                          }
                        }}
                      >
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Username</TableCell>
                              <TableCell>Password</TableCell>
                              <TableCell>Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {generatedRespondents.map((respondent) => (
                              <TableRow 
                                key={respondent.respondentID}
                                sx={{
                                  '&:last-child td, &:last-child th': { border: 0 },
                                  cursor: 'pointer',
                                  '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                  }
                                }}
                              >
                                {editingRespondent?.respondentID === respondent.respondentID ? (
                                  <>
                                    <TableCell>
                                      <TextField
                                        size="small"
                                        value={editingRespondent.username}
                                        onChange={(e) => setEditingRespondent({
                                          ...editingRespondent,
                                          username: e.target.value
                                        })}
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <TextField
                                        size="small"
                                        value={editingRespondent.rawPassword}
                                        onChange={(e) => setEditingRespondent({
                                          ...editingRespondent,
                                          rawPassword: e.target.value
                                        })}
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Button
                                          size="small"
                                          variant="contained"
                                          color="primary"
                                          onClick={() => handleSaveEdit(editingRespondent)}
                                        >
                                          Save
                                        </Button>
                                        <Button
                                          size="small"
                                          variant="outlined"
                                          color="error"
                                          onClick={() => setEditingRespondent(null)}
                                        >
                                          Cancel
                                        </Button>
                                      </Box>
                                    </TableCell>
                                  </>
                                ) : (
                                  <>
                                    <TableCell>{respondent.username}</TableCell>
                                    <TableCell>{respondent.rawPassword}</TableCell>
                                    <TableCell>
                                      <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Button
                                          size="small"
                                          variant="outlined"
                                          onClick={() => handleEditRespondent(respondent)}
                                        >
                                          Edit
                                        </Button>
                                        <Button
                                          size="small"
                                          variant="outlined"
                                          color="error"
                                          onClick={() => handleDeleteRespondent(respondent.respondentID)}
                                        >
                                          Delete
                                        </Button>
                                      </Box>
                                    </TableCell>
                                  </>
                                )}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                  </Box>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 操作按钮组 */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          color="error"
          size="large"
          onClick={handleReset}
          sx={{ 
            minWidth: 150,
            height: 48,
            fontSize: '1.1rem'
          }}
        >
          Reset All
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleFinalSubmit}
          disabled={loading || !Object.values(completedSteps).every(Boolean)}
          sx={{ 
            minWidth: 200,
            height: 48,
            fontSize: '1.1rem'
          }}
        >
          {loading ? 'Submitting...' : 'Submit All Configurations'}
        </Button>
      </Box>

      {/* Add Snackbar component */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default StudyConfiguration; 