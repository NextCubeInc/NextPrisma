import { supabase } from '@/lib/supabase'
import type { Lead } from '@/lib/supabase'

export class LeadService {
  // Buscar todos os leads de um workspace
  static async getWorkspaceLeads(workspaceId: string): Promise<Lead[]> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erro ao buscar leads:', error)
      throw error
    }
  }

  // Buscar lead específico
  static async getLead(leadId: string): Promise<Lead | null> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Erro ao buscar lead:', error)
      throw error
    }
  }

  // Criar novo lead
  static async createLead(lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>): Promise<Lead> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .insert(lead)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Erro ao criar lead:', error)
      throw error
    }
  }

  // Atualizar lead
  static async updateLead(leadId: string, updates: Partial<Lead>): Promise<Lead> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', leadId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Erro ao atualizar lead:', error)
      throw error
    }
  }

  // Deletar lead
  static async deleteLead(leadId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', leadId)

      if (error) throw error
    } catch (error) {
      console.error('Erro ao deletar lead:', error)
      throw error
    }
  }

  // Buscar leads por status
  static async getLeadsByStatus(workspaceId: string, status: 'hot' | 'warm' | 'cold'): Promise<Lead[]> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('workspace_id', workspaceId)
        .eq('status', status)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erro ao buscar leads por status:', error)
      throw error
    }
  }

  // Buscar leads por fonte
  static async getLeadsBySource(workspaceId: string, source: string): Promise<Lead[]> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('workspace_id', workspaceId)
        .eq('source', source)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erro ao buscar leads por fonte:', error)
      throw error
    }
  }

  // Buscar leads por score
  static async getLeadsByScore(workspaceId: string, minScore: number, maxScore: number): Promise<Lead[]> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('workspace_id', workspaceId)
        .gte('score', minScore)
        .lte('score', maxScore)
        .order('score', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erro ao buscar leads por score:', error)
      throw error
    }
  }

  // Estatísticas dos leads
  static async getLeadStats(workspaceId: string) {
    try {
      const { data: leads, error } = await supabase
        .from('leads')
        .select('status, score, value')
        .eq('workspace_id', workspaceId)

      if (error) throw error

      const stats = {
        total: leads?.length || 0,
        hot: leads?.filter(l => l.status === 'hot').length || 0,
        warm: leads?.filter(l => l.status === 'warm').length || 0,
        cold: leads?.filter(l => l.status === 'cold').length || 0,
        averageScore: leads?.reduce((acc, l) => acc + l.score, 0) / (leads?.length || 1) || 0,
        totalValue: leads?.reduce((acc, l) => acc + l.value, 0) || 0
      }

      return stats
    } catch (error) {
      console.error('Erro ao buscar estatísticas dos leads:', error)
      throw error
    }
  }
}
