import { supabase } from '@/lib/supabase'
import type { Workspace, WorkspaceMember } from '@/lib/supabase'

export class WorkspaceService {
  // Buscar todos os workspaces do usuário
  static async getUserWorkspaces(userId: string): Promise<Workspace[]> {
    try {
      const { data: memberships, error } = await supabase
        .from('workspace_members')
        .select(`
          workspace_id,
          workspaces (*)
        `)
        .eq('user_id', userId)

      if (error) throw error

      return memberships?.map(membership => membership.workspaces) || []
    } catch (error) {
      console.error('Erro ao buscar workspaces:', error)
      throw error
    }
  }

  // Buscar workspace específico
  static async getWorkspace(workspaceId: string): Promise<Workspace | null> {
    try {
      const { data, error } = await supabase
        .from('workspaces')
        .select('*')
        .eq('id', workspaceId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Erro ao buscar workspace:', error)
      throw error
    }
  }

  // Criar novo workspace
  static async createWorkspace(workspace: Omit<Workspace, 'id' | 'created_at' | 'updated_at'>): Promise<Workspace> {
    try {
      const { data, error } = await supabase
        .from('workspaces')
        .insert(workspace)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Erro ao criar workspace:', error)
      throw error
    }
  }

  // Atualizar workspace
  static async updateWorkspace(workspaceId: string, updates: Partial<Workspace>): Promise<Workspace> {
    try {
      const { data, error } = await supabase
        .from('workspaces')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', workspaceId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Erro ao atualizar workspace:', error)
      throw error
    }
  }

  // Deletar workspace
  static async deleteWorkspace(workspaceId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('workspaces')
        .delete()
        .eq('id', workspaceId)

      if (error) throw error
    } catch (error) {
      console.error('Erro ao deletar workspace:', error)
      throw error
    }
  }

  // Adicionar membro ao workspace
  static async addMember(workspaceId: string, userId: string, role: 'owner' | 'admin' | 'member'): Promise<WorkspaceMember> {
    try {
      const { data, error } = await supabase
        .from('workspace_members')
        .insert({
          workspace_id: workspaceId,
          user_id: userId,
          role
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Erro ao adicionar membro:', error)
      throw error
    }
  }

  // Remover membro do workspace
  static async removeMember(workspaceId: string, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('workspace_members')
        .delete()
        .eq('workspace_id', workspaceId)
        .eq('user_id', userId)

      if (error) throw error
    } catch (error) {
      console.error('Erro ao remover membro:', error)
      throw error
    }
  }

  // Buscar membros do workspace
  static async getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMember[]> {
    try {
      const { data, error } = await supabase
        .from('workspace_members')
        .select(`
          *,
          users (*)
        `)
        .eq('workspace_id', workspaceId)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erro ao buscar membros:', error)
      throw error
    }
  }
}
