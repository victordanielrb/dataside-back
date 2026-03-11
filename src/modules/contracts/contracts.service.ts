import mongoose from 'mongoose';
import { Contract } from '../../models/Contract';
import { AdminUser } from '../../models/AdminUser';
import { ContractBody, ContractFilters } from './contracts.schema';

export async function listContracts(filters: ContractFilters) {
  const { nome, data_inicio, data_vencimento, page, limit, sort, order } = filters;
  const skip = (page - 1) * limit;

  const query: Record<string, unknown> = {};
  if (nome) query.nome = { $regex: nome, $options: 'i' };
  if (data_inicio) query.data_inicio = { ...((query.data_inicio as object) ?? {}), $gte: data_inicio };
  if (data_vencimento) query.data_vencimento = { ...((query.data_vencimento as object) ?? {}), $lte: data_vencimento };

  const sortObj: Record<string, 1 | -1> = { [sort]: order === 'asc' ? 1 : -1 };

  const [data, total] = await Promise.all([
    Contract.find(query).sort(sortObj).skip(skip).limit(limit).lean({ virtuals: true }),
    Contract.countDocuments(query),
  ]);

  return { data: data.map(toContract), total };
}

export async function getContract(id: string) {
  if (!mongoose.isValidObjectId(id)) return null;
  const doc = await Contract.findById(id).lean({ virtuals: true });
  return doc ? toContract(doc) : null;
}

export async function createContract(body: ContractBody) {
  const doc = await Contract.create(body);
  return toContract(doc.toJSON());
}

export async function updateContract(id: string, body: ContractBody) {
  if (!mongoose.isValidObjectId(id)) return null;
  const doc = await Contract.findByIdAndUpdate(id, body, { new: true }).lean({ virtuals: true });
  return doc ? toContract(doc) : null;
}

export async function deleteContract(id: string) {
  if (!mongoose.isValidObjectId(id)) return;
  await Contract.findByIdAndDelete(id);
}

export async function getExpiringSoon() {
  const today = new Date().toISOString().split('T')[0];
  const inFiveDays = new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0];

  const [contracts, admins] = await Promise.all([
    Contract.find({
      data_vencimento: { $gte: today, $lte: inFiveDays },
    })
      .sort({ data_vencimento: 1 })
      .lean({ virtuals: true }),
    AdminUser.find({}, 'email').lean(),
  ]);

  return {
    data: contracts.map(toContract),
    adminEmails: admins.map((a) => a.email as string),
  };
}

// Normalize _id → id for API responses
function toContract(doc: Record<string, unknown>) {
  const obj = { ...doc };
  if (!obj.id && obj._id) obj.id = String(obj._id);
  delete obj._id;
  delete obj.__v;
  return obj;
}
