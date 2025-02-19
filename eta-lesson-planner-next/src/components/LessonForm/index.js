// app/components/LessonForm/index.js
'use client';

import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  TextField,
  MenuItem,
  Button,
  Container,
} from '@mui/material';

const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const LessonPlanForm = () => {
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    topic: '',
    grade: '',
    classDuration: '',
    coTeachingModel: '',
    objectives: '',
    classroomSetting: '',
    classSize: 25,
    proficiencyLevels: [],
    materials: '',
    keyVocabulary: '',
    extraConsiderations: '',
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add form submission logic here
  };

  return (
    <Container maxWidth='md'>
      <Box sx={{ width: '100%', mt: 4 }}>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label='Essential Info' />
          <Tab label='Class Details' />
          <Tab label='Additional Info' />
        </Tabs>

        <form onSubmit={handleSubmit}>
          <TabPanel value={tabValue} index={0}>
            <TextField
              required
              name='topic'
              label='Topic/Theme'
              value={formData.topic}
              onChange={handleInputChange}
              margin='normal'
              fullWidth
              placeholder='e.g., Food and Nutrition, Family Members'
            />
            <TextField
              required
              name='grade'
              label='Grade Level'
              value={formData.grade}
              onChange={handleInputChange}
              select
              margin='normal'
              fullWidth
            >
              {[...Array(12)].map((_, i) => (
                <MenuItem key={i + 1} value={i + 1}>
                  Grade {i + 1}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              required
              name='objectives'
              label='Learning Objectives'
              value={formData.objectives}
              onChange={handleInputChange}
              multiline
              rows={4}
              margin='normal'
              fullWidth
              placeholder='Example: SWBAT identify common food vocabulary words'
            />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <TextField
              name='classDuration'
              label='Class Duration'
              value={formData.classDuration}
              onChange={handleInputChange}
              margin='normal'
              fullWidth
              placeholder='e.g., 40 min'
            />
            <TextField
              name='classroomSetting'
              label='Classroom Setting'
              value={formData.classroomSetting}
              onChange={handleInputChange}
              multiline
              rows={3}
              margin='normal'
              fullWidth
            />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <TextField
              name='materials'
              label='Teaching Materials'
              value={formData.materials}
              onChange={handleInputChange}
              multiline
              rows={3}
              margin='normal'
              fullWidth
            />
            <TextField
              name='keyVocabulary'
              label='Key Vocabulary'
              value={formData.keyVocabulary}
              onChange={handleInputChange}
              multiline
              rows={3}
              margin='normal'
              fullWidth
            />
          </TabPanel>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant='contained'
              color='primary'
              type='submit'
              size='large'
            >
              Generate Lesson Plan
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default LessonPlanForm;
