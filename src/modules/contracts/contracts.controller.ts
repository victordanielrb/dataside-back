import { Request, Response, NextFunction } from 'express';
import { contractBodySchema, contractFiltersSchema } from './contracts.schema';
import * as service from './contracts.service';

export async function listContracts(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = contractFiltersSchema.safeParse(req.query);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten().fieldErrors });
      return;
    }
    const { data, total } = await service.listContracts(parsed.data);
    const { page, limit } = parsed.data;
    res.json({ data, meta: { page, limit, total } });
  } catch (err) {
    next(err);
  }
}

export async function getContract(req: Request, res: Response, next: NextFunction) {
  try {
    const contract = await service.getContract(req.params.id);
    if (!contract) {
      res.status(404).json({ error: 'Contract not found' });
      return;
    }
    res.json(contract);
  } catch (err) {
    next(err);
  }
}

export async function createContract(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = contractBodySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten().fieldErrors });
      return;
    }
    const contract = await service.createContract(parsed.data);
    res.status(201).json(contract);
  } catch (err) {
    next(err);
  }
}

export async function updateContract(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = contractBodySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten().fieldErrors });
      return;
    }
    const contract = await service.updateContract(req.params.id, parsed.data);
    if (!contract) {
      res.status(404).json({ error: 'Contract not found' });
      return;
    }
    res.json(contract);
  } catch (err) {
    next(err);
  }
}

export async function deleteContract(req: Request, res: Response, next: NextFunction) {
  try {
    await service.deleteContract(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function getExpiringSoon(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await service.getExpiringSoon();
    res.json({ data });
  } catch (err) {
    next(err);
  }
}
