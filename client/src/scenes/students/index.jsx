import { Box, useTheme } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { tokens } from '../../theme'
import Header from '../../components/Header'
import { useStudents } from '../../hooks/useStudents'
import { useEffect } from 'react'
import { Link } from 'react-router-dom' // Importa para navegación

const Students = () => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  // const navigate = useNavigate() // Para manejar la navegación
  const { students, getStudents } = useStudents()

  useEffect(() => {
    getStudents()
  }, [])

  const columns = [
    { field: 'id', headerName: 'ID' },
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      cellClassName: 'name-column--cell',
      renderCell: (params) => {
        return (
          <Link
            to={`/students/${params.id}`}
            style={{
              color: colors.greenAccent[300],
              textDecoration: 'none',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => (e.target.style.textDecoration = 'underline')}
            onMouseLeave={(e) => (e.target.style.textDecoration = 'none')}
          >
            {params.value}
          </Link>
        )
      },
    },
    {
      field: 'age',
      headerName: 'Age',
      type: 'number',
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'image',
      headerName: 'Image',
      headerAlign: 'left',
      align: 'left',
      flex: 1,
      width: 150,
      renderCell: (params) => (
        <img
          src={`http://localhost:4000/Images/${params.value}`}
          style={{
            width: 50,
            height: 50,
            borderRadius: '50%',
          }}
        />
      ),
    },
    {
      field: 'phone',
      headerName: 'Phone',
      flex: 1,
      cellClassName: 'phone-column--cell',
      renderCell: (params) => {
        return (
          <Link
            to={`https://wa.me/${params.value}`}
            style={{
              color: colors.greenAccent[300],
              textDecoration: 'none',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => (e.target.style.textDecoration = 'underline')}
            onMouseLeave={(e) => (e.target.style.textDecoration = 'none')}
          >
            Click open Whatsapp chat
          </Link>
        )
      },
    },
  ]

  return (
    <Box m="20px">
      <Header title="STUDENTS" subtitle="Lista de estudiantes" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          '& .MuiDataGrid-root': {
            border: 'none',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: 'none',
          },
          '& .name-column--cell': {
            color: colors.greenAccent[300],
          },
          '& .phone-column--cell': {
            color: colors.greenAccent[300],
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: colors.blueAccent[700],
            borderBottom: 'none',
          },
          '& .MuiDataGrid-virtualScroller': {
            backgroundColor: colors.primary[400],
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: 'none',
            backgroundColor: colors.blueAccent[700],
          },
          '& .MuiCheckbox-root': {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid
          rows={students || []}
          columns={columns}
          // onRowClick={(params) => navigate(`/students/${params.id}`)}
        />
      </Box>
    </Box>
  )
}

export default Students
