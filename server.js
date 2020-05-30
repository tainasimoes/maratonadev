const express = require("express")
const server = express()

// config server static files
server.use(express.static("public"))

// config body form
server.use(express.urlencoded({ extended: true }))

// config conection with database
const Pool = require('pg').Pool
const db = new Pool({
  user: 'postgres',
  password: '1234',
  host: 'localhost',
  port: 5432,
  database: 'doe'
})

// config template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
  express: server,
  noCache: true
})

// Donors list: vector or array
// const donors = [
//   {
//     name: "Diego Fernandes",
//     blood: "AB+"
//   },
//   {
//     name: "Cleiton Souza",
//     blood: "B+"
//   },
//   {
//     name: "Robson Marques",
//     blood: "A+"
//   },
//   {
//     name: "Mayk Brito",
//     blood: "O-"
//   }
// ]

// config page
server.get("/", function(require, response){
  db.query("SELECT * FROM donors", function(error, result) {
    if(error) {
      console.log(error)
      return response.send("Erro no banco de dados")
    }

    const donors = result.rows
    return response.render("index.html", { donors })
  })
  
})

server.post("/", function(require, response){
  // get data from form
  const name = require.body.name
  const email = require.body.email
  const blood = require.body.blood
  
  if (name == "" || email == "" || blood == "") {
    return response.send("Todos os campos são obrigatório.")
  } 

  // put value in array
  // donors.push({
  //   name: name,
  //   blood: blood
  // })

  // put value in database
  const query = `
    INSERT INTO donors ("name", "email", "blood")
    VALUES ($1, $2, $3)
  `
  const values = [name, email, blood]

  db.query(query, values, function(error) {
    // Error flow
    if(error) {
      console.log(error)
      return response.send("Erro no banco de dados")
    }
    
    // Correct flow
    return response.redirect("/")
  })
})

// turn on the server and alow access on 3000 port
server.listen(3000, function(){
  console.log('✨ Start server =)')
})