'use client'
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material'
import { firestore } from '@/firebase'
import { collection, doc, query, getDocs, setDoc, deleteDoc, getDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { Unstable_NumberInput as NumberInput } from '@mui/base/Unstable_NumberInput';



const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  gap: 2,
  display: 'flex',
  flexDirection: 'column',
}

export default function Home() {
  const [pantry, setPantry] = useState([])
  const [currQuery, setCurrQuery] = useState('')

  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const [itemName, setItemName] = useState('')

  const updatePantry = async (...searched) => {
    const snapshot = query(collection(firestore, 'pantry'))
    const docs = await getDocs(snapshot)
    const pantryList = []
    docs.forEach((doc) => {
      let searchedStr=''
      if (searched.length!=0){
        searchedStr=searched[0].toLowerCase()
      }
      if (doc.id.toLowerCase().includes(searchedStr)){
        pantryList.push({name: doc.id, ...doc.data()})
      }
    })
    setPantry(pantryList)
  }

  useEffect(() => {
    updatePantry()
  }, [])

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item)
    await setDoc(docRef, {count: 1})
    await updatePantry()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item)
    await deleteDoc(docRef)
    await updatePantry()
  }

  const itemChange = async (item, newCount) => {
    const docRef = doc(collection(firestore, 'pantry'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()){
      if (newCount<=0){
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, {count: newCount})
      }
    }
    await updatePantry()
  }

  return (
    <Box
    width="100vw" height="100vh"
    display={'flex'}
    justifyContent={'center'}
    alignItems={'center'}
    flexDirection={'column'}
    overflow={'hidden'}
    gap={2}
    >
      <Stack
        direction={'row'}
      >
        <TextField
          id="outlined-basic"
          label="Filter"
          variant="outlined"
          fullWidth
          value={currQuery}
          onChange={
            (e) => {
              setCurrQuery(e.target.value)
              updatePantry(e.target.value)
            }
          }
        />
      </Stack>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={style}
        >
          <Typography>
            Add Item
          </Typography>
          <Stack
            direction={'row'} spacing={2}
          >
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={() => {
                addItem(itemName)
                handleClose()
                setItemName('')
              }}
            >Add</Button>
          </Stack>
        </Box>
      </Modal>
      <Button
        variant="contained"
        onClick={handleOpen}
      >Add Items</Button>
      <Box
        border={'1px solid #333'}
      >
        <Box 
          width="800px"
          height="100px"
          bgcolor={'#add8e6'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          boxShadow={'0 10px 10px -1px #bbb'}
          zIndex={1}>
          <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
            Pantry Items
          </Typography>
        </Box>
        <Stack
          width="800px"
          height="600px"
          spacing={2}
          overflow={'scroll'}
          paddingTop={'10px'}>
          {pantry.map(({name, count}) => (
            <Stack
              key={name}
              direction={'row'}
              spacing={2}
              justifyContent={'center'}
              alignContent={'space-between'}
              bgcolor={'#f0f0f0'}
            >
              <Box
                key={name}
                width="100%"
                height="100px"
                display={'flex'}
                justifyContent={'space-between'}
                alignItems={'center'}
                gap={2}
              >
                <Typography
                  variant={'h4'}
                  color={'#333'}
                  textAlign={'center'}
                  fontWeight={'bold'}
                >
                  {name.charAt(0).toUpperCase()+name.slice(1)}
                </Typography>
                <NumberInput
                  aria-label="Demo number input"
                  placeholder="Type a number…"
                  value={count}
                  onChange={(event, val) => itemChange(name, val)}
                />
              </Box>
              <Box
                display={'flex'}
                justifyContent={'center'}
                alignItems={'center'}
              >
                <Button
                  variant="contained"
                  onClick={() => removeItem(name)}
                  sx={{
                    width: 64,
                    height: 64,
                    padding: 0,
                  }}
                >
                  <CloseIcon></CloseIcon>
                </Button>
              </Box>
            </Stack>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
