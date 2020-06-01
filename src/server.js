const express = require('express');

const app = express();

const connection = require('./database/connection');

const user = require('./user');
const md5 = require('md5'); //NÃO USAR md5() - usar js-sha1


app.set('views','./src/views');
app.set('view-engine','ejs');
app.use(express.urlencoded({ extended:false }));

function session(bool){
    user.auth = bool;
}

//Pages requests
app.get('/', (request, response)=>{
    session(false);
    response.redirect('/login');
});

app.get('/login', (request, response)=>{
    session(false);
    response.render('login.ejs');
});

app.get('/register', (request, response)=>{
    session(false);
    response.render('register.ejs');
});

app.get('/painel',(req, res) =>{
    if(user.auth){

        console.log(street)
        res.render('index.ejs',{ name: user.name, mail: user.mail, rua: street });
    }else{
        session(false);
        res.redirect('/login');
    }
})

//Register request
app.post('/register',(request, response)=>{
    //os campos / fields estão no corpo da requisição
    let name = request.body.name;
    let mail = request.body.name;
    let pass = md5(request.body.name);
    const query = `INSERT INTO user(name_user, mail_user, pass)values('${name}', '${mail}', '${pass}');`;
    try{
        connection.query(query, (err, result, field)=>{
            if(err) throw err;
            response.redirect('/login')
        })
    }catch(e){
        console.error(e);
    }
        

    
});

app.post('/login',(request, response)=>{

    let mail = request.body.mail;
    let pass = md5(request.body.pass);
    const query = `SELECT * FROM user WHERE mail_user="${mail}" AND pass="${pass}"`;
    connection.query(query, (error, results, fields) =>{
        if(error) throw error;
        
        user.name = results[0].name_user;
        user.mail = results[0].mail_user;
        session(true)
        response.redirect('/painel');

    });
});
 
app.listen(3333,()=>{
    console.log('Server running at http://localhost:3333/');
});
