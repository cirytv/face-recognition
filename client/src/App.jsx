import { Routes, Route } from 'react-router-dom'
import Topbar from './scenes/global/Topbar'
import Sidebar from './scenes/global/Sidebar'
import Dashboard from './scenes/dashboard'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { ColorModeContext, useMode } from './theme'
import FormStudent from './scenes/form/FormStudent'
import FormAttendance from './scenes/form/FormAttendance'
import FormProfessor from './scenes/form/FormProfessor'
import Students from './scenes/students'
import Example from './scenes/example'
import FormExample from './scenes/form/FormExample'
import FormCourse from './scenes/form/FormCourse'
import FormCareer from './scenes/form/FormCareer'
import FormEnrollment from './scenes/form/FormEnrollment'
// import FaceRecognition from './scenes/fr/faceRecognition'
import FormSchedule from './scenes/form/FormSchedule'
import WebcamFaceRecognition from './scenes/webcam/WebcamFaceRecognition'
import { ToastContainer } from 'react-toastify'

function App() {
  const [theme, colorMode] = useMode()

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar />
          <main className="content">
            <Topbar />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              {/* <Route path="/face-recognition" element={<FaceRecognition />} /> */}
              <Route path="/webcam" element={<WebcamFaceRecognition />} />
              <Route path="/students" element={<Students />} />
              <Route path="/professors" element={<Example />} />
              <Route path="/attendances" element={<Example />} />
              <Route path="/form/student" element={<FormStudent />} />
              <Route path="/form/professor" element={<FormProfessor />} />
              <Route path="/form/attendance" element={<FormAttendance />} />
              <Route path="/form/schedule" element={<FormSchedule />} />
              <Route path="/form/course" element={<FormCourse />} />
              <Route path="/form/enrollment" element={<FormEnrollment />} />
              <Route path="/form/career" element={<FormCareer />} />
              <Route path="/form/example" element={<FormExample />} />
            </Routes>
          </main>
          <ToastContainer /> {/* Add this at the end of your main content */}
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}

export default App
