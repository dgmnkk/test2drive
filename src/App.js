import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React from 'react';
import MainLayout from './layouts/layout';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import LecturesList from './pages/lectures/LecturesList';
import LectureDetails from './pages/lectures/LectureDetails';
import ProfilePage from './pages/profile/ProfilePage';
import TestsList from './pages/tests/TestsList';
import TestPage from './pages/tests/TestPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path="/lectures" element={<LecturesList />} />
          <Route path="/lectures/:id" element={<LectureDetails />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path='/tests' element={<TestsList />} />
          <Route path='/tests/:id' element={<TestPage />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
