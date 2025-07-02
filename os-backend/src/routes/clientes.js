import { Router } from 'express';
import { body } from 'express-validator';
import * as clienteCtrl from '../controllers/clienteController.js';
import { handleValidationErrors } from '../middlewares/validation.js';

const router = Router();

const clienteValidation = [
  body('nome')
    .trim()
    .isLength({ min: 2, max: 120 })
    .withMessage('Nome deve ter entre 2 e 120 caracteres'),
  body('telefone')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Telefone deve ter no máximo 20 caracteres'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .isLength({ max: 120 })
    .withMessage('Email deve ser válido e ter no máximo 120 caracteres'),
  handleValidationErrors
];

router.get('/', clienteCtrl.listar);
router.get('/:id', clienteCtrl.obterPorId);
router.post('/', clienteValidation, clienteCtrl.criar);
router.put('/:id', clienteValidation, clienteCtrl.atualizar);
router.delete('/:id', clienteCtrl.remover);

export default router;