import gql from 'graphql-tag'
import Link from 'next/link'
import { useQuery } from '@apollo/client'
import { initializeApollo } from '../apollo/client'
import styled from 'styled-components'
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react'

const Title = styled.h1`
  color: rgb(102, 178, 255);
`

const ViewerQuery = gql`
  query ViewerQuery {
    viewer {
      id
      name
      status
    }
  }
`

const DeleteBtn = styled.span`
  color: #000;
  position: absolute;
  right: 5px;
  top: 13px;
`


const Index = () => {
  let id = 0
  const {
    data: { viewer },
  } = useQuery(ViewerQuery)

  const [value, setValue] = useState('')
  const [todos, setTodos] = useState([])
  //  render 後都會執行 useEffect
  useEffect(() => {
    console.log('after render')
    console.log(todos)
  }, [])
  const submitInput = (e) => {
    id = Math.max(...todos.map(i => i.id)) + 1
    console.log(id)
    setTodos([
      { text: value, id },
      ...todos
    ])
    setValue('')
    id += 1
  };
  const changeInput = (e) => {
    setValue(e.target.value)
  };
  const deleteTodo = (index) => {
    console.log(index)
    setTodos(todos.filter((item, subindex) => subindex !== index))
  }
  const changeTodo = (index, text) => {
    console.log(id)
    setTodos(todos.map((i, subI) => {
      if (index === subI) {
        return {
          ...i,
          text
        }
      }
      return i
    }))
  }

  return (
    <div>
      <Title>Todo list</Title>
      <div>
        {todos.map((i, index) => (
          <div
            className='todo'
            key={`s${index}`}
          >
            <input
              type="text"
              value={i.text}
              onChange={(e) => changeTodo(index, e.target.value)}
            />
            <DeleteBtn onClick={() => {deleteTodo(index)}}>X</DeleteBtn>
          </div>
        ))}
      </div>
      <Stack spacing={0} direction="row">
        <input
          placeholder="add a new todo ..."
          value={value}
          onChange={changeInput}
        />
        <Button onClick={submitInput} variant="contained">Add</Button>
      </Stack>
    </div>
  )
}

export async function getStaticProps() {
  const apolloClient = initializeApollo()

  await apolloClient.query({
    query: ViewerQuery,
  })

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  }
}

export default Index
