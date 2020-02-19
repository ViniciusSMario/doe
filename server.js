//configurando o servidor
const express = require("express")
const server = express()

//configurar o servidor para apresentar arquivos estaticos
server.use(express.static('public'))

//Habilitar body do formulário
server.use(express.urlencoded({extended: true}))

//configurar a conexao com o BD
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: 'admin',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})

//configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true,

})


//configurar a apresentação da página
server.get("/", function(req, res){

    db.query("SELECT * from donors", function(err, result){
        if(err) return res.send("Erro no banco de dados")

        const donors = result.rows
        return res.render("index.html", {donors})
    } )
   
    //req requisições
    //res respostas do servidor
   
})

server.post("/", function(req, res){
    //pegar dados do formulário
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if(name == "" || email== "" || blood== ""){
        return res.send("Todos os campos são obrigatórios.")
    }

    //colocar valores no BD
    const query = `INSERT INTO donors 
    ("name", "email", "blood") 
    values($1, $2, $3)`

    db.query(query, [name, email, blood], function(err){
        //fluxo de erro
        if(err) return res.send("Erro no banco de dados.")

        //fluxo ideal
        return res.redirect("/")
    })    

    
})

//ligar o servidor e permitir acesso a porta 3000
server.listen(3000, function(){
    console.log("iniciei o servidor.")
})