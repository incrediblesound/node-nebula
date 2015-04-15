Node Nebula
===========
This is the Node.js module for interfacing with the NebulaDB server. More detailed information about NebulaDB can be found [here](https://github.com/incrediblesound/nebulaDB).

Use
---
Install:    
```shell
npm install node_nebula
```
Require:
```javascript
var nebula = require('node_nebula');

// calling open will initilialize a new db
nebula.open({name:'testdb', isNew: true});

// for doing multiple processes in a series, use a callback on open
nebula.open({name:'testdb', isNew: true}, function(){
  nebula.save(['john','->','user']);
})
```
Save data:
```javascript
nebula.save(['john','->','user']);
nebula.saveAll([
  ['john','first_name','John'],
  ['john','last_name','Doe'],
  ['john','password','omg!lol1']
]);
````
Query data:
```javascript
nebula.query(['john','->','admin'], function(result){
  if(result.hasState) { router.route('admin'); }
});
```
