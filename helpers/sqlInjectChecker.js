function sqlInjectFormChecker (value,res){
    console.log(value)
    var regexsqlinject = /^([a-z]|[A-Z]|[0-9])[^$#%&*]{4,45}$/
    if(!value.match(regexsqlinject)){
        res.status(409).send({status: "error", message: `Format data tidak boleh mengandung karakter special sperti ($, #, %, &, dan *), minimal 4 karakter dan maksimal 45 karakter`})
    }else{
        return value
    }
}
function sqlInjectEmailChecker (email,res) {
    console.log(email)
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if(!email.match(regex)){
        res.status(409).send({status: "error", message: `Format emailmu salah, contoh format yang benar namakamu@gmail.com atau namakamu@yahoo.com`})
      }else{
          return email
    }
}
module.exports = {
    sqlInjectFormChecker,sqlInjectEmailChecker
}