const { Pokemon } = require('../db/sequelize');
const { Op } = require('sequelize');
const auth = require('../auth/auth')

module.exports = (app) => {
    app.get('/api/pokemons', auth, (req, res) => {
        if(req.query.name) {
            const name = req.query.name
            if (name.length < 2) {
                const message = `Le terme de recherche doit contenir au minimum 2 caractères`
                return res.status(400).json({ message })
            }
            return Pokemon.findAndCountAll({ where : {
                name: {
                    [Op.like]: `%${name}%`
                }
            },
            order: ['name'],
            limit: req.query.limit ? parseInt(req.query.limit) : 5 
        })
            .then(({count, rows}) => {
                const message = `Il y a ${count} pokemons qui correspondent au terme de recherche ${name}`
                res.json({ message, data:rows })
            })
        } else {
            Pokemon.findAll({ order:['name'] })
            .then(pokemons => {
                const message = "La liste des pokemons a bien été récupérée"
                res.json({ message, data : pokemons })
            })
            .catch(error => {
                const message = `La liste des pokemons n'a pas pu être récupérée. Réessayez dans quelques instants.`
                res.status(500).json({ message, data:error })
            })
        }

    })
}