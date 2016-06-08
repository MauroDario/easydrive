myApp.service("SqlService",function($cordovaSQLite){
  
  this.execute= new function(query, parameters){    
    if(parameters== null)
      parameters= [];
    return $cordovaSQLite.execute(db, query, parameters);  
}
  });