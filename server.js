const express =require('express');
const bodyParser = require('body-parser')
const bcrypt=require('bcrypt-nodejs');
const app =express();
const cors=require('cors');
const knex =require('knex');







 const db=knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'Database2020',
    database : 'smartbrain'
  }
});


app.use(bodyParser.json());
app.use(cors());





/*const database ={


users:[

{
	id:'123',
	name:'Gaurav',
	email:'gauravchd138@gmail.com',
	password:'cookies',
	entries:0,
	joined:new Date()
},
{

	id:'124',
	name:'Aarti',
	email:'Aartichd138@gmail.com',
	password:'Jam',
	entries:0,
	joined:new Date()


}

]

}

*/




app.get('/',(req,res)=>{


res.send(database.users);


})

app.post('/register',(req,res)=>{
const {email,name,password}=req.body;
const hash = bcrypt.hashSync(password);
db.transaction(trx=>{
trx.insert({
hash:hash,
email:email
})
.into('login')
.returning('email')
.then(loginemail=>{
return trx('users')
.returning('*')
.insert({
email:loginemail[0],
name:name,
joined:new Date()
})
.then(user=>{
res.json(user[0]);
})
})
.then(trx.commit)
.catch(trx.rollback)
})
.catch(err=>res.status(400).json('Unable to register'))
//end of transaction
})

app.get('/profile/:id',(req,res)=>{

const {id} =req.params;

db.select('*').from('users').
where({id})

.then(user=>{
if(user.length){

	res.json(user[0]);
}
else{

	res.status(400).json('Not Found');
}



}).catch(err=>res.status(400).json('error getting user'))



/*
database.users.forEach(users=>{
if(users.id===id){

found =true;
return res.send('exist');



}})


if(!found){


return res.status(400).json('not found');


}

*/





})






app.put('/image',(req,res)=>{

const {id} =req.body;

db('users').where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
.then(entries=>{
res.json(entries[0]);

}).catch(err=>res.status(400).json('Unable to get entries'))

  
  })





/*
let found =false;
database.users.forEach(users=>{

if(users.id===id){

found =true;
users.entries++;
return res.json(users.entries);



}})

if(!found){


return res.status(400).json('not found');


}

*/



//bcrypt.compareSync(myPlaintextPassword, hash); // true
//bcrypt.compareSync(someOtherPlaintextPassword, hash); // false


app.post('/signin',(req,res)=>{


db.select('email','hash').from('login')
.where('email','=',req.body.email)
.then(data=>{

console.log(data);
const isvalid=bcrypt.compareSync(req.body.password, data[0].hash); 
if(isvalid){
return db.select('*').from('users')
.where('email','=',req.body.email)
.then(users=>
res.json(users[0])
	)
.catch(err=>res.status(400).json('unable to get user'))

}

else{
res.status(400).json('Wrong Credentials!');
}



}) 
.catch(err=>res.status(400).json('Wrong Credentials!'))


})







app.listen(3000,()=>{



console.log('app is running on port 300');




})

