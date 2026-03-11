import { z } from 'zod';

export const contractBodySchema = z.object({
  nome: z.string().min(1),
  valor: z.number().positive(),
  data_inicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  data_vencimento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
}).refine((d) => d.data_vencimento >= d.data_inicio, {
  message: 'data_vencimento must be after data_inicio',
  path: ['data_vencimento'],
});

export const contractFiltersSchema = z.object({
  nome: z.string().optional(),
  data_inicio: z.string().optional(),
  data_vencimento: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sort: z.enum(['nome', 'valor', 'data_inicio', 'data_vencimento', 'created_at']).default('created_at'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export type ContractBody = z.infer<typeof contractBodySchema>;
export type ContractFilters = z.infer<typeof contractFiltersSchema>;
