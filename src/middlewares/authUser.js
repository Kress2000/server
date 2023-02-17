
const authUser =(req, res, next)=>{
    console.log(req.body.email)
    if(!req.body.email){
        res.status(403)
        return res.json({error: "Sign in first"})
    }
    next();
}
module.exports={authUser}