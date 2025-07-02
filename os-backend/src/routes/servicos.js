import { Router } from 'express';
import { body } from 'express-validator';
import * as servicoCtrl from '../controllers/servicoController.js';
import { handleValidationErrors } from '../middlewares/validation.js';

const router = Router();

const servicoValidation = [
  body('descricao')
    .trim()
    .isLength({ min: 5 })
    .withMessage('Descrição deve ter pelo menos 5 caracteres'),
  body('preco_base')
    .isNumeric({ min: 0 })
    .withMessage('Preço base deve ser um número positivo'),
  handleValidationErrors
];

router.get('/', servicoCtrl.listar);
router.get('/:id', servicoCtrl.obterPorId);
router.post('/', servicoValidation, servicoCtrl.criar);
router.put('/:id', servicoValidation, servicoCtrl.atualizar);
router.delete('/:id', servicoCtrl.remover);

export default router;