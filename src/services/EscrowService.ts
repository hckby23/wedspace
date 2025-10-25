"use client";

import { supabase } from '@/integrations/supabase/client';
import type { EscrowStatus, EscrowTransactionType, DisputeStatus } from '@/types/db';

export interface EscrowAccount {
  id: string;
  booking_id: string;
  user_id: string;
  vendor_id: string | null;
  total_amount: number;
  advance_amount: number;
  balance_amount: number;
  released_amount: number;
  refunded_amount: number;
  commission_amount: number;
  commission_percentage: number;
  status: EscrowStatus;
  currency: string;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  auto_release_date: string | null;
  manual_release_required: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
  funded_at: string | null;
  released_at: string | null;
}

export interface EscrowTransaction {
  id: string;
  escrow_account_id: string;
  transaction_type: EscrowTransactionType;
  amount: number;
  currency: string;
  from_user_id: string | null;
  to_user_id: string | null;
  status: string;
  description: string | null;
  created_at: string;
}

export interface CreateEscrowParams {
  booking_id: string;
  user_id: string;
  vendor_id: string;
  total_amount: number;
  advance_percentage?: number;
  commission_percentage?: number;
  auto_release_days?: number;
}

export interface ReleaseEscrowParams {
  escrow_id: string;
  amount: number;
  released_by: string;
  notes?: string;
}

export interface RefundEscrowParams {
  escrow_id: string;
  amount: number;
  refunded_by: string;
  reason: string;
}

export interface CreateDisputeParams {
  escrow_account_id: string;
  booking_id: string;
  raised_by: string;
  dispute_type: string;
  dispute_reason: string;
  dispute_amount?: number;
  evidence_documents?: string[];
  evidence_description?: string;
}

export interface ServiceResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export class EscrowService {
  /**
   * Create a new escrow account for a booking
   */
  static async createEscrow(params: CreateEscrowParams): Promise<ServiceResponse<EscrowAccount>> {
    try {
      const {
        booking_id,
        user_id,
        vendor_id,
        total_amount,
        advance_percentage = 30,
        commission_percentage = 10,
        auto_release_days = 7
      } = params;

      // Calculate amounts
      const advance_amount = total_amount * (advance_percentage / 100);
      const balance_amount = total_amount - advance_amount;
      const commission_amount = total_amount * (commission_percentage / 100);

      // Calculate auto-release date
      const auto_release_date = new Date();
      auto_release_date.setDate(auto_release_date.getDate() + auto_release_days);

      // Create escrow account
      const { data, error } = await supabase
        .from('escrow_accounts')
        .insert({
          booking_id,
          user_id,
          vendor_id,
          total_amount,
          advance_amount,
          balance_amount,
          commission_amount,
          commission_percentage,
          auto_release_date: auto_release_date.toISOString(),
          status: 'pending',
          currency: 'INR'
        })
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to create escrow',
        success: false
      };
    }
  }

  /**
   * Get escrow account by ID
   */
  static async getEscrowAccount(escrow_id: string): Promise<ServiceResponse<EscrowAccount>> {
    try {
      const { data, error } = await supabase
        .from('escrow_accounts')
        .select('*')
        .eq('id', escrow_id)
        .single();

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to fetch escrow',
        success: false
      };
    }
  }

  /**
   * Get escrow account by booking ID
   */
  static async getEscrowByBooking(booking_id: string): Promise<ServiceResponse<EscrowAccount>> {
    try {
      const { data, error } = await supabase
        .from('escrow_accounts')
        .select('*')
        .eq('booking_id', booking_id)
        .single();

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to fetch escrow',
        success: false
      };
    }
  }

  /**
   * Update escrow status after payment
   */
  static async markEscrowAsFunded(
    escrow_id: string,
    razorpay_payment_id: string
  ): Promise<ServiceResponse<EscrowAccount>> {
    try {
      const { data, error } = await supabase
        .from('escrow_accounts')
        .update({
          status: 'funded',
          razorpay_payment_id,
          funded_at: new Date().toISOString()
        })
        .eq('id', escrow_id)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      // Create deposit transaction
      await supabase.from('escrow_transactions').insert({
        escrow_account_id: escrow_id,
        transaction_type: 'deposit',
        amount: data.advance_amount,
        status: 'completed',
        description: 'Advance payment deposited to escrow',
        razorpay_payment_id,
        processed_at: new Date().toISOString()
      });

      return { data, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to update escrow',
        success: false
      };
    }
  }

  /**
   * Release funds from escrow to vendor
   */
  static async releaseEscrowFunds(params: ReleaseEscrowParams): Promise<ServiceResponse<boolean>> {
    try {
      const { escrow_id, amount, released_by, notes } = params;

      // Call the database function
      const { data, error } = await supabase.rpc('release_escrow_funds', {
        p_escrow_id: escrow_id,
        p_amount: amount,
        p_released_by: released_by,
        p_notes: notes || null
      });

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data: true, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to release funds',
        success: false
      };
    }
  }

  /**
   * Refund funds from escrow to customer
   */
  static async refundEscrowFunds(params: RefundEscrowParams): Promise<ServiceResponse<boolean>> {
    try {
      const { escrow_id, amount, refunded_by, reason } = params;

      // Call the database function
      const { data, error } = await supabase.rpc('refund_escrow_funds', {
        p_escrow_id: escrow_id,
        p_amount: amount,
        p_refunded_by: refunded_by,
        p_reason: reason
      });

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data: true, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to refund funds',
        success: false
      };
    }
  }

  /**
   * Get escrow transactions
   */
  static async getEscrowTransactions(escrow_id: string): Promise<ServiceResponse<EscrowTransaction[]>> {
    try {
      const { data, error } = await supabase
        .from('escrow_transactions')
        .select('*')
        .eq('escrow_account_id', escrow_id)
        .order('created_at', { ascending: false });

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to fetch transactions',
        success: false
      };
    }
  }

  /**
   * Create a dispute
   */
  static async createDispute(params: CreateDisputeParams): Promise<ServiceResponse<any>> {
    try {
      const { data, error } = await supabase
        .from('escrow_disputes')
        .insert({
          ...params,
          status: 'open',
          priority: 'medium'
        })
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      // Update escrow status to disputed
      await supabase
        .from('escrow_accounts')
        .update({ status: 'disputed' })
        .eq('id', params.escrow_account_id);

      return { data, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to create dispute',
        success: false
      };
    }
  }

  /**
   * Get user's escrow accounts
   */
  static async getUserEscrows(user_id: string): Promise<ServiceResponse<EscrowAccount[]>> {
    try {
      const { data, error } = await supabase
        .from('escrow_accounts')
        .select('*')
        .or(`user_id.eq.${user_id},vendor_id.eq.${user_id}`)
        .order('created_at', { ascending: false });

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to fetch escrows',
        success: false
      };
    }
  }

  /**
   * Check if escrow can be released (auto-release date passed)
   */
  static async checkAutoRelease(escrow_id: string): Promise<ServiceResponse<boolean>> {
    try {
      const { data: escrow, error } = await supabase
        .from('escrow_accounts')
        .select('auto_release_date, status, manual_release_required')
        .eq('id', escrow_id)
        .single();

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      if (escrow.manual_release_required) {
        return { data: false, error: 'Manual release required', success: true };
      }

      if (escrow.status !== 'funded') {
        return { data: false, error: 'Escrow not funded', success: true };
      }

      const canRelease = escrow.auto_release_date && 
        new Date(escrow.auto_release_date) <= new Date();

      return { data: canRelease, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to check auto-release',
        success: false
      };
    }
  }

  /**
   * Get escrow statistics for dashboard
   */
  static async getEscrowStats(user_id: string): Promise<ServiceResponse<{
    total_in_escrow: number;
    pending_release: number;
    total_released: number;
    total_refunded: number;
    active_disputes: number;
  }>> {
    try {
      const { data: escrows, error } = await supabase
        .from('escrow_accounts')
        .select('*')
        .or(`user_id.eq.${user_id},vendor_id.eq.${user_id}`);

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      const stats = {
        total_in_escrow: escrows
          .filter(e => e.status === 'funded' || e.status === 'partial_released')
          .reduce((sum, e) => sum + (e.total_amount - e.released_amount - e.refunded_amount), 0),
        pending_release: escrows
          .filter(e => e.status === 'funded')
          .reduce((sum, e) => sum + e.balance_amount, 0),
        total_released: escrows.reduce((sum, e) => sum + e.released_amount, 0),
        total_refunded: escrows.reduce((sum, e) => sum + e.refunded_amount, 0),
        active_disputes: escrows.filter(e => e.status === 'disputed').length
      };

      return { data: stats, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to fetch stats',
        success: false
      };
    }
  }
}
