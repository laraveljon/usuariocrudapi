import React,{useEffect,useState} from 'react';
import './App.css';
import axios from 'axios'; // se importa axios
import {makeStyles} from '@material-ui/core/styles';
import {Table,TableContainer,TableHead,TableCell,TableBody,TableRow,Modal,Button,TextField}  from '@material-ui/core';
import {Edit,Delete} from '@material-ui/icons';
// se escibe la url que la tengo en json de la api http://localhost:3001/usuarios
const baseUrl ='http://localhost:3001/usuarios/';

const useStyles = makeStyles((theme) => ({
  modal: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },
  iconos:{
    cursor: 'pointer'
  }, 
  inputMaterial:{
    width: '100%'
  }
}));

function App() {
  const styles= useStyles();
  const [data, setData]=useState([]);
  const [modalInsertar, setModalInsertar]=useState(false);
  const [modalEditar, setModalEditar]=useState(false);
  const [modalEliminar, setModalEliminar]=useState(false);

  const [consolaSeleccionada, setConsolaSeleccionada]=useState({
    nombre: '',
    password:'',
    ApellidoP: '',
    ApellidoM: ''
  })

  const handleChange=e=>{
    const {name, value}=e.target;
    setConsolaSeleccionada(prevState=>({
      ...prevState,
      [name]: value
    }))
    console.log(consolaSeleccionada);
  }

  const peticionGet=async()=>{
    await axios.get(baseUrl)
    .then(response=>{
      setData(response.data);
    })
  }

  const peticionPost=async()=>{
    await axios.post(baseUrl, consolaSeleccionada)
    .then(response=>{
      setData(data.concat(response.data))
      abrirCerrarModalInsertar()
    })
  }

  const peticionPut=async()=>{
    await axios.put(baseUrl+consolaSeleccionada.id, consolaSeleccionada)
    .then(response=>{
      var dataNueva=data;
      dataNueva.map(consola=>{
        if(consolaSeleccionada.id===consola.id){
          consola.nombre=consolaSeleccionada.nombre;
          consola.password=consolaSeleccionada.password;
          consola.ApellidoP=consolaSeleccionada.ApellidoP;
          consola.ApellidoM=consolaSeleccionada.ApellidoM;
        }
      })
      setData(dataNueva);
      abrirCerrarModalEditar();
    })
  }

  const peticionDelete=async()=>{
    await axios.delete(baseUrl+consolaSeleccionada.id)
    .then(response=>{
      setData(data.filter(consola=>consola.id!==consolaSeleccionada.id));
      abrirCerrarModalEliminar();
    })
  }

  const abrirCerrarModalInsertar=()=>{
    setModalInsertar(!modalInsertar);
  }

  const abrirCerrarModalEditar=()=>{
    setModalEditar(!modalEditar);
  }

  const abrirCerrarModalEliminar=()=>{
    setModalEliminar(!modalEliminar);
  }

  const seleccionarConsola=(consola, caso)=>{
    setConsolaSeleccionada(consola);
    (caso==='Editar')?abrirCerrarModalEditar():abrirCerrarModalEliminar()
  }

  useEffect(async()=>{
    await peticionGet();
  },[])

  const bodyInsertar=(
    <div className={styles.modal}>
      <h3>Agregar Nueva Consola</h3>
      <TextField name="nombre" className={styles.inputMaterial} label="Nombre" onChange={handleChange}/>
      <br />
      <TextField name="password" className={styles.inputMaterial} label="Password" onChange={handleChange}/>
      <br />
      <TextField name="ApellidoP" className={styles.inputMaterial} label="Apellido Paterno" onChange={handleChange}/>
      <br />
      <TextField name="ApellidoM" className={styles.inputMaterial} label="Apellido Materno" onChange={handleChange}/>
      <br /><br />
      <div align="right">
        <Button color="primary" onClick={()=>peticionPost()}>Insertar</Button>
        <Button onClick={()=>abrirCerrarModalInsertar()}>Cancelar</Button>
      </div>
    </div>
  )

  const bodyEditar=(
    <div className={styles.modal}>
      <h3>Editar Consola</h3>
      <TextField name="nombre" className={styles.inputMaterial} label="Nombre" onChange={handleChange} value={consolaSeleccionada && consolaSeleccionada.nombre}/>
      <br />
      <TextField name="password" className={styles.inputMaterial} label="Password" onChange={handleChange} value={consolaSeleccionada && consolaSeleccionada.password}/>
      <br />
      <TextField name="ApellidoP" className={styles.inputMaterial} label="Apellido Paterno" onChange={handleChange} value={consolaSeleccionada && consolaSeleccionada.ApellidoP}/>
      <br />
      <TextField name="ApellidoM" className={styles.inputMaterial} label="Apellido Materno" onChange={handleChange} value={consolaSeleccionada && consolaSeleccionada.ApellidoM}/>
      <br /><br />
      <div align="right">
        <Button color="primary" onClick={()=>peticionPut()}>Editar</Button>
        <Button onClick={()=>abrirCerrarModalEditar()}>Cancelar</Button>
      </div>
    </div>
  )

  const bodyEliminar=(
    <div className={styles.modal}>
      <p>Estás seguro que deseas eliminar el Usuario <b>{consolaSeleccionada && consolaSeleccionada.nombre}</b> ? </p>
      <div align="right">
        <Button color="secondary" onClick={()=>peticionDelete()} >Sí</Button>
        <Button onClick={()=>abrirCerrarModalEliminar()}>No</Button>

      </div>

    </div>
  )

  return (
    <div className="App">
    <br />
     <Button onClick={()=>abrirCerrarModalInsertar()}>Insertar</Button>
    <br/><br/>
      <TableContainer>
       <Table>
        <TableHead>
         <TableRow>
          <TableCell>Nombre </TableCell>
          <TableCell>Apellido Paterno</TableCell>
          <TableCell>Apellido Materno</TableCell>
          <TableCell>Acciones</TableCell>
         </TableRow>
        </TableHead>
        <TableBody>
         {
           data.map(consola=>(
             <TableRow key={consola.id}>
              <TableCell>{consola.nombre}</TableCell>
              <TableCell>{consola.ApellidoP}</TableCell>
              <TableCell>{consola.ApellidoM}</TableCell>
              <TableCell>
              <Edit className={styles.iconos} onClick={()=>seleccionarConsola(consola, 'Editar')}/>
               &nbsp;&nbsp;&nbsp;
               <Delete  className={styles.iconos} onClick={()=>seleccionarConsola(consola, 'Eliminar')}/>
              </TableCell>
             </TableRow>
           ))
         }
        </TableBody>
       </Table>
      </TableContainer>
      <Modal
        open={modalInsertar}
        onClose={abrirCerrarModalInsertar}>
            {bodyInsertar}
        </Modal>

        <Modal
        open={modalEditar}
        onClose={abrirCerrarModalEditar}>
            {bodyEditar}
        </Modal>

        <Modal
        open={modalEliminar}
        onClose={abrirCerrarModalEliminar}>
            {bodyEliminar}
        </Modal>
    </div>
  );
}

export default App;
