function authUser(req, res, next){
    if(req.body.user === null)
        return res.status(401).send({message: 'You need to sign in'})
    next()
}

function authRole(role){
    return (req, res, next) => {
        if(req.body.user.role !== role)
            return res.status(403).send({message: 'Not allowed'})

        next()
    }
}

module.exports = {
    authUser,
    authRole
}