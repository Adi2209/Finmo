import mongoose from 'mongoose';
import { CurrencyAmountMap } from 'src/types';

/**
 * Mongoose schema for accounts.
 */
export const AccountsSchema = new mongoose.Schema({
  // Username of the account holder
  username: { type: String, required: true },
  // Email of the account holder (must be unique)
  email: { type: String, required: true, unique: true },
  // Password of the account holder
  password: { type: String, required: true },
  // Balance of the account, stored as a map of currency and amount
  balance: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
    // Validate that each key is a string (currency) and each value is a number (amount)
    validate: {
      validator: function(value: any) {
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

/**
 * Mongoose model for accounts.
 */
export const Accounts = mongoose.model('Accounts', AccountsSchema);

/**
 * Interface representing an account document.
 */
export interface Accounts extends mongoose.Document {
  username: string;
  email: string;
  password: string;
  balance: CurrencyAmountMap;
}
