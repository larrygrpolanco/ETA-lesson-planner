// app/components/LessonForm/FormTabs.js
'use client';

import { useState } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import CoreInfoTab from './CoreInfoTab';
import ClassContextTab from './ClassContextTab';
import MaterialsTab from './MaterialsTab';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`lesson-tabpanel-${index}`}
      aria-labelledby={`lesson-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function FormTabs({ formData, setFormData, handleSubmit }) {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label='lesson plan form tabs'
        >
          <Tab label='Essential Info' />
          <Tab label='Class Context' />
          <Tab label='Materials' />
        </Tabs>
      </Box>

      <TabPanel value={value} index={0}>
        <CoreInfoTab formData={formData} setFormData={setFormData} />
      </TabPanel>

      <TabPanel value={value} index={1}>
        <ClassContextTab formData={formData} setFormData={setFormData} />
      </TabPanel>

      <TabPanel value={value} index={2}>
        <MaterialsTab formData={formData} setFormData={setFormData} />
      </TabPanel>
    </Box>
  );
}
