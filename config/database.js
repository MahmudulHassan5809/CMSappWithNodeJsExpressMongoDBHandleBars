if(process.env.NODE_ENV === 'production'){
 module.exports = {
 	mongoURI : 'mongodb://Mahmudul:Mahmudul5809@ds125932.mlab.com:25932/cms'
 }
}else{
  module.exports = {
  	mongoURI : 'mongodb://localhost:27017/cms'
  }
}
