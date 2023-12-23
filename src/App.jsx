import { useState } from 'react'
import { QueryClient, useQuery, useMutation } from '@tanstack/react-query'
import axios from 'axios'

const createCabin = async () => {
  return await axios.post(`http://127.0.0.1:8000/api/cabins/`)
}

const getCabins = async () => {
  return await axios.get(`http://127.0.0.1:8000/api/cabins/`)
}

const Cabins = ({ cabins }) => {
  return (
    <>
      {cabins.map(cabin => (
        <Cabin 
          key={cabin.id}
          cabin={cabin}
        />))}
    </>
  )
}

const Cabin = ({ cabin }) => {

  const [edit, setEdit] = useState(false)
  const [name, setName] = useState(cabin.name)

  const updateCabin = useMutation({
    mutationFn: cabinId => axios.put(`http://127.0.0.1:8000/api/cabins/${cabinId}/`, ({ name }))
  })

  const deleteCabin = useMutation({
    mutationFn: cabinId => axios.delete(`http://127.0.0.1:8000/api/cabins/${cabinId}`)
  })

  const handleUpdate = () => {
    setEdit(prev => !prev)
    updateCabin.mutate(cabin.id)
  }

  return (
    <div>
      {edit ? <input value={name} onChange={e => setName(e.target.value)}/> : <span>{name}</span>}
      <button disabled={edit} onClick={() => setEdit(prev => !prev)}>Edt</button>
      <button onClick={() => deleteCabin.mutate(cabin.id)}>Delete</button>
      <button onClick={handleUpdate}>Update</button>
    </div>
  )
}

const App = () => {

  const [name, setName] = useState("")

  const {data: cabins, isLoading, isError, error} = useQuery({
    queryKey: ["cabins"],
    queryFn: () => getCabins()
  })

  const createCabin = useMutation({
    mutationFn: (name) => axios.post(`http://127.0.0.1:8000/api/cabins/`, {name}),
  })

  const handleSubmit = e => {
    e.preventDefault()
    createCabin.mutate(name)
    setName("")
  }
 
  if (isLoading) return <h1>Loading ...</h1>
  if (isError) return <h1>{error.toString}</h1>

  return (
    <>
      <h1>CRUD Operations</h1>
      <Cabins 
        cabins={cabins.data}
      />
      <form onSubmit={handleSubmit}>
        <input 
          type='text'
          placeholder='name'
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <button type='submit'>Add Cabin</button>
      </form>
    </>
  )
}

export default App
