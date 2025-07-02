import { Router } from 'express';
import { body } from 'express-validator';
import * as osCtrl from '../controllers/osController.js';
import { handleValidationErrors } from '../middlewares/validation.js';

const router = Router();

const osValidation = [
  body('cliente_id')
    .isUUID()
    .withMessage('ID do cliente deve ser um UUID válido'),
  body('servico_id')
    .isUUID()
    .withMessage('ID do serviço deve ser um UUID válido'),
  body('anotacoes')
    .optional()
    .trim(),
  handleValidationErrors
];

const statusValidation = [
  body('status')
    .isIn(['aberta', 'em_andamento', 'concluida', 'cancelada'])
    .withMessage('Status deve ser: aberta, em_andamento, concluida ou cancelada'),
  handleValidationErrors
];

router.get('/', osCtrl.listar);
router.get('/stats', osCtrl.obterEstatisticas);
router.get('/:id', osCtrl.obterPorId);
router.post('/', osValidation, osCtrl.criar);
router.put('/:id', osValidation, osCtrl.atualizar);
router.patch('/:id/status', statusValidation, osCtrl.atualizarStatus);
router.delete('/:id', osCtrl.remover);

export default router;