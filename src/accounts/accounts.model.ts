import mongoose from 'mongoose';
import { CurrencyAmountMap } from 'src/types';

export const AccountsSchema = new mongoose.Schema({
  userId: { type: Number },
  username: { type: String, required: true },
  email: { type: String, required: true },
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

export interface Accounts extends mongoose.Document {
  userId?: number;
  username: string;
  email: string;
  password: string;
  balance: CurrencyAmountMap;
}
