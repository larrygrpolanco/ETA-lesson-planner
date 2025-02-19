// app/page.js
'use client';

import { Container, Typography, Box } from '@mui/material';
import LessonPlanForm from './components/LessonForm';

export default function Home() {
  return (
    <Container>
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant='h3' component='h1' gutterBottom>
          ETA Lesson Plan
        </Typography>
        <Typography variant='subtitle1' color='text.secondary' sx={{ mb: 4 }}>
          Create lesson plan ideas. Share your topic, objectives, and class
          details, and the app will make you a lesson plan draft.
        </Typography>
        <LessonPlanForm />
      </Box>
    </Container>
  );
}
