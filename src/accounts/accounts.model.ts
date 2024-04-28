import mongoose from 'mongoose';
import { CurrencyAmountMap } from 'src/types';

export const AccountsSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  balance: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
    validate: {
      validator: function(value: any) {
        // Validate that each key is a string (currency) and each value is a number (amount)
        for (const currency in value) {
          if (typeof currency !== 'string' || typeof value[currency] !== 'number') {
            return false;
          }
        }
        return true;
      },
      message: props => `${props.value} is not a valid balance object`,
    },
  },
});
/**
 * Indexing the email to reduce response time, this will help more when there will be millions of data in the DB.
 */
AccountsSchema.index({ email: 1 }, { unique: true }); 

export const Accounts = mongoose.model('Accounts', AccountsSchema);

export interface Accounts extends mongoose.Document {
  username: string;
  email: string;
  password: string;
  balance: CurrencyAmountMap;
}
