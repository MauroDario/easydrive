myApp.service("SqlService",function($cordovaSQLite){
  
  var execute= new function(query, parameters){    
    if(parameters== null)
      parameters= [];
    return $cordovaSQLite.execute(db, query, parameters);  
}
  });