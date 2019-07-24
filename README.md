#### Application to display graph from Celligen Bioreactor datas

Clone the project.<br>
Install all dependencies.<br>
### `npm install`
<hr>
Add your configuration data in .env file at the root of the project.<br>
Structure : <br>
MONGODB_URI = <br>
MONGODB_USER = <br>
MONGODB_PASS = <br>
<hr>
Insert first admin account in your MondoDB :<br>
db.users.insert( { name: "admin" , password: "$2a$10$frAzPBXeg.av/yvgBfRvyeMuS1MTwHvb2kF3oii.vtxA7A.ZKdQTu", email: "admin@gmail.com" })<br><hr>

Run command line : 
### `npm run server`
and on another terminal window run command line :
### `npm start`

Your admin page is ready to use on [http://localhost:3000/](http://localhost:3000/)!!!<br>
Use 'admin@gmail.com' as email and 'admin' as password.<br>
If you go to the url : [http://localhost:3000/signup](http://localhost:3000/signup) , you can add another adminitrator account.
