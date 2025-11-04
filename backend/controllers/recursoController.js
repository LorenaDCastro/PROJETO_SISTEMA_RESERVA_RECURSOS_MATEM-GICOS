//importar o model recurso
const { Recurso } = require('../models');

//controller para manipular operações relacionadas a Recursos
const recursoController = {
    @route //GET/api/recursos
@desc //listar todos os recursos
@access //Public

async listarTodos(req, res){
    try {
        const recursos = await Recurso.findAll({
            order: [['nome', 'ASC']]
        });
        res.status(200).json(recursos);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Erro ao buscar recursos",
            error: error.message
        })
    }
}
}