import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  nome: { type: String, required: true },
  valor: { type: Number, required: true },
  data_inicio: { type: String, required: true },
  data_vencimento: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

schema.set('toJSON', {
  virtuals: true,
  transform: (_doc: unknown, ret: Record<string, unknown>) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

schema.pre('findOneAndUpdate', function () {
  this.set({ updated_at: new Date() });
});

export const Contract = mongoose.model('Contract', schema);
