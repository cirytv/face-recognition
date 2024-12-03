import { Routes, Route } from 'react-router-dom'
import Topbar from './scenes/global/Topbar'
import Sidebar from './scenes/global/Sidebar'
import Dashboard from './scenes/dashboard'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { ColorModeContext, useMode } from './theme'
import Empresas from './scenes/empresas'
import FormStudent from './scenes/form/FormStudent'
import FormSubject from './scenes/form/FormSubject'
import FormAttendance from './scenes/form/FormAttendance'
import FormProfessor from './scenes/form/FormProfessor'
import Students from './scenes/students'
import Example from './scenes/example'
import FormExample from './scenes/form/FormExample'

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
              <Route path="/students" element={<Students />} />
              <Route path="/professors" element={<Example />} />
              <Route path="/attendances" element={<Empresas />} />
              <Route path="/form/student" element={<FormStudent />} />
              <Route path="/form/professor" element={<FormProfessor />} />
              <Route path="/form/attendance" element={<FormAttendance />} />
              <Route path="/form/subject" element={<FormSubject />} />
              <Route path="/form/example" element={<FormExample />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}

export default App
