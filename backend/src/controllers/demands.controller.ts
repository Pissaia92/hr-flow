import { Request, Response } from 'express';
import { DemandModel } from '../models/demand.model';
import { PriorityUtils } from '../utils/priority.utils';

export class DemandsController {
  // Criar nova demanda
  static async create(req: Request, res: Response): Promise<Response> {
    try {
      const { type, description, priority, status } = req.body;
      const userId = req.user?.id;

      // Validação básica
      if (!type || !description) {
        return res.status(400).json({
          error: 'Tipo e descrição são obrigatórios'
        });
      }

      // Calcular prioridade automática se não for fornecida
      const calculatedPriority = priority || PriorityUtils.calculatePriority(description);

      // Criar demanda
      const demand = await DemandModel.create({
        type,
        description,
        priority: calculatedPriority,
        status: status || 'open',
        user_id: userId
      });

      if (!demand) {
        return res.status(500).json({
          error: 'Erro ao criar demanda'
        });
      }

      return res.status(201).json({
        message: 'Demanda criada com sucesso',
        demand
      });

    } catch (error) {
      console.error('Erro ao criar demanda:', error);
      return res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Listar todas as demandas (apenas para HR)
  static async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const demands = await DemandModel.findAll();
      
      return res.status(200).json({
        demands
      });

    } catch (error) {
      console.error('Erro ao buscar demandas:', error);
      return res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Listar demandas do usuário logado
  static async getByUser(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      const demands = await DemandModel.findByUserId(userId);
      
      return res.status(200).json({
        demands
      });

    } catch (error) {
      console.error('Erro ao buscar demandas do usuário:', error);
      return res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Buscar demanda por ID
  static async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const demand = await DemandModel.findById(id);
      
      if (!demand) {
        return res.status(404).json({
          error: 'Demanda não encontrada'
        });
      }
      
      return res.status(200).json({
        demand
      });

    } catch (error) {
      console.error('Erro ao buscar demanda:', error);
      return res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Atualizar demanda
  static async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      // Remover campos que não devem ser atualizados
      delete updates.id;
      delete updates.user_id;
      delete updates.created_at;
      
      // Recalcular prioridade se a descrição foi atualizada
      if (updates.description && !updates.priority) {
        updates.priority = PriorityUtils.calculatePriority(updates.description);
      }
      
      const demand = await DemandModel.update(id, updates);
      
      if (!demand) {
        return res.status(404).json({
          error: 'Demanda não encontrada'
        });
      }
      
      return res.status(200).json({
        message: 'Demanda atualizada com sucesso',
        demand
      });

    } catch (error) {
      console.error('Erro ao atualizar demanda:', error);
      return res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Deletar demanda
  static async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      
      const demand = await DemandModel.update(id, { status: 'closed' });
      
      if (!demand) {
        return res.status(404).json({
          error: 'Demanda não encontrada'
        });
      }
      
      return res.status(200).json({
        message: 'Demanda fechada com sucesso'
      });

    } catch (error) {
      console.error('Erro ao deletar demanda:', error);
      return res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }
}