/*
-> enriquecimento de dados

1. ler de um banco 
2. bater em uma API para pegar o resto das informações
3. submeter os dados para outra API
*/

import axios from 'axios'

const myDb = async () => Array.from({ length: 1000 }, (v, index) => `${index}-cellphone`)

const PRODUCT_URL = 'http://localhost:3000/products'
const CART_URL = 'http://localhost:4000/cart'

async function processDbData() {
  const products = await myDb()
  const responses = []

  for (const product of products) {
    const { data: productInfo } = await axios.get(`${PRODUCT_URL}?productName=${product}`)
    const { data: cartData } = await axios.post(`${CART_URL}`, productInfo)
    responses.push(cartData)
  }

  return responses
}

//console.table(await processDbData())

async function* processDbDataGen() {
  const products = await myDb()

  for (const product of products) {
    const { data: productInfo } = await axios.get(`${PRODUCT_URL}?productName=${product}`)
    const { data: cartData } = await axios.post(`${CART_URL}`, productInfo)
    yield cartData
  }
}

for await (const data of processDbDataGen()) {
  console.log(data)
}
