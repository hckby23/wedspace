"use client";

import { supabase } from '@/integrations/supabase/client';

export interface Contract {
  id: string;
  booking_id: string;
  customer_id: string;
  vendor_id: string;
  contract_number: string;
  contract_type: string;
  title: string;
  terms_and_conditions: string;
  total_amount: number;
  status: string;
  customer_signed: boolean;
  vendor_signed: boolean;
  event_date: string;
  created_at: string;
}

export interface ContractMilestone {
  id: string;
  contract_id: string;
  milestone_number: number;
  title: string;
  description: string;
  payment_percentage: number;
  payment_amount: number;
  status: string;
  due_date: string;
  refund_eligible: boolean;
}

export interface RefundRequest {
  id: string;
  contract_id: string;
  booking_id: string;
  refund_type: string;
  refund_reason: string;
  refund_amount: number;
  status: string;
  milestone_refund_breakdown: any;
}

export interface ServiceResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export class ContractService {
  /**
   * Generate contract from template
   */
  static async generateContract(params: {
    template_id: string;
    booking_id: string;
    variables: Record<string, any>;
  }): Promise<ServiceResponse<Contract>> {
    try {
      const { data, error } = await supabase.rpc('generate_contract_from_template', {
        p_template_id: params.template_id,
        p_booking_id: params.booking_id,
        p_variables: params.variables
      });

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      // Fetch the generated contract
      const { data: contract, error: fetchError } = await supabase
        .from('contracts')
        .select('*')
        .eq('id', data)
        .single();

      if (fetchError) {
        return { data: null, error: fetchError.message, success: false };
      }

      return { data: contract, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to generate contract',
        success: false
      };
    }
  }

  /**
   * Create contract with milestones
   */
  static async createContractWithMilestones(params: {
    booking_id: string;
    customer_id: string;
    vendor_id: string;
    total_amount: number;
    event_date: string;
    milestones: Array<{
      title: string;
      description: string;
      payment_percentage: number;
      due_date: string;
    }>;
  }): Promise<ServiceResponse<{ contract: Contract; milestones: ContractMilestone[] }>> {
    try {
      // Generate contract number
      const contractNumber = `WS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Create contract
      const { data: contract, error: contractError } = await supabase
        .from('contracts')
        .insert({
          booking_id: params.booking_id,
          customer_id: params.customer_id,
          vendor_id: params.vendor_id,
          contract_number: contractNumber,
          contract_type: 'venue',
          title: `Wedding Service Contract - ${contractNumber}`,
          terms_and_conditions: 'Standard terms and conditions apply.',
          total_amount: params.total_amount,
          start_date: new Date().toISOString().split('T')[0],
          end_date: params.event_date,
          event_date: params.event_date,
          status: 'draft'
        })
        .select()
        .single();

      if (contractError) {
        return { data: null, error: contractError.message, success: false };
      }

      // Create milestones
      const milestonesData = params.milestones.map((m, index) => ({
        contract_id: contract.id,
        milestone_number: index + 1,
        title: m.title,
        description: m.description,
        payment_percentage: m.payment_percentage,
        payment_amount: params.total_amount * (m.payment_percentage / 100),
        due_date: m.due_date,
        status: 'pending',
        refund_eligible: true
      }));

      const { data: milestones, error: milestonesError } = await supabase
        .from('contract_milestones')
        .insert(milestonesData)
        .select();

      if (milestonesError) {
        return { data: null, error: milestonesError.message, success: false };
      }

      return { data: { contract, milestones }, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to create contract',
        success: false
      };
    }
  }

  /**
   * Sign contract
   */
  static async signContract(params: {
    contract_id: string;
    user_id: string;
    signature_data: string;
    ip_address?: string;
  }): Promise<ServiceResponse<Contract>> {
    try {
      // Get contract to determine if user is customer or vendor
      const { data: contract, error: fetchError } = await supabase
        .from('contracts')
        .select('*')
        .eq('id', params.contract_id)
        .single();

      if (fetchError) {
        return { data: null, error: fetchError.message, success: false };
      }

      const isCustomer = contract.customer_id === params.user_id;
      const isVendor = contract.vendor_id === params.user_id;

      if (!isCustomer && !isVendor) {
        return { data: null, error: 'Unauthorized to sign this contract', success: false };
      }

      // Update signature
      const updateData: any = {
        updated_at: new Date().toISOString()
      };

      if (isCustomer) {
        updateData.customer_signed = true;
        updateData.customer_signed_at = new Date().toISOString();
        updateData.customer_signature_data = params.signature_data;
        updateData.customer_ip_address = params.ip_address;
      } else {
        updateData.vendor_signed = true;
        updateData.vendor_signed_at = new Date().toISOString();
        updateData.vendor_signature_data = params.signature_data;
        updateData.vendor_ip_address = params.ip_address;
      }

      // Check if both parties have signed
      const bothSigned = (isCustomer && contract.vendor_signed) || (isVendor && contract.customer_signed);
      
      if (bothSigned) {
        updateData.status = 'fully_signed';
        updateData.signed_at = new Date().toISOString();
        updateData.activated_at = new Date().toISOString();
      } else {
        updateData.status = 'partially_signed';
      }

      const { data: updatedContract, error: updateError } = await supabase
        .from('contracts')
        .update(updateData)
        .eq('id', params.contract_id)
        .select()
        .single();

      if (updateError) {
        return { data: null, error: updateError.message, success: false };
      }

      // Create audit log
      await supabase.from('contract_audit_log').insert({
        contract_id: params.contract_id,
        action: 'signed',
        action_by: params.user_id,
        action_description: `Contract signed by ${isCustomer ? 'customer' : 'vendor'}`,
        ip_address: params.ip_address
      });

      return { data: updatedContract, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to sign contract',
        success: false
      };
    }
  }

  /**
   * Calculate milestone-based refund
   */
  static async calculateMilestoneRefund(params: {
    contract_id: string;
    cancellation_date: string;
  }): Promise<ServiceResponse<{ refundable_amount: number; refund_breakdown: any }>> {
    try {
      const { data, error } = await supabase.rpc('calculate_milestone_refund', {
        p_contract_id: params.contract_id,
        p_cancellation_date: params.cancellation_date
      });

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data: data[0], error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to calculate refund',
        success: false
      };
    }
  }

  /**
   * Request refund
   */
  static async requestRefund(params: {
    contract_id: string;
    booking_id: string;
    requested_by: string;
    refund_type: string;
    refund_reason: string;
    refund_amount: number;
    milestone_refund_breakdown?: any;
  }): Promise<ServiceResponse<RefundRequest>> {
    try {
      const { data, error } = await supabase
        .from('refund_requests')
        .insert({
          contract_id: params.contract_id,
          booking_id: params.booking_id,
          requested_by: params.requested_by,
          refund_type: params.refund_type,
          refund_reason: params.refund_reason,
          refund_amount: params.refund_amount,
          milestone_refund_breakdown: params.milestone_refund_breakdown,
          status: 'pending'
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
        error: error instanceof Error ? error.message : 'Failed to request refund',
        success: false
      };
    }
  }

  /**
   * Get contract by booking
   */
  static async getContractByBooking(booking_id: string): Promise<ServiceResponse<Contract>> {
    try {
      const { data, error } = await supabase
        .from('contracts')
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
        error: error instanceof Error ? error.message : 'Failed to fetch contract',
        success: false
      };
    }
  }

  /**
   * Get contract milestones
   */
  static async getContractMilestones(contract_id: string): Promise<ServiceResponse<ContractMilestone[]>> {
    try {
      const { data, error } = await supabase
        .from('contract_milestones')
        .select('*')
        .eq('contract_id', contract_id)
        .order('milestone_number');

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to fetch milestones',
        success: false
      };
    }
  }

  /**
   * Update milestone status
   */
  static async updateMilestoneStatus(params: {
    milestone_id: string;
    status: string;
    verified_by?: string;
    verification_notes?: string;
  }): Promise<ServiceResponse<ContractMilestone>> {
    try {
      const updateData: any = {
        status: params.status,
        updated_at: new Date().toISOString()
      };

      if (params.status === 'verified') {
        updateData.verified_by = params.verified_by;
        updateData.verified_at = new Date().toISOString();
        updateData.verification_notes = params.verification_notes;
      }

      if (params.status === 'completed') {
        updateData.completion_date = new Date().toISOString().split('T')[0];
      }

      const { data, error } = await supabase
        .from('contract_milestones')
        .update(updateData)
        .eq('id', params.milestone_id)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to update milestone',
        success: false
      };
    }
  }

  /**
   * Get user contracts
   */
  static async getUserContracts(user_id: string): Promise<ServiceResponse<Contract[]>> {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .or(`customer_id.eq.${user_id},vendor_id.eq.${user_id}`)
        .order('created_at', { ascending: false });

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to fetch contracts',
        success: false
      };
    }
  }
}
