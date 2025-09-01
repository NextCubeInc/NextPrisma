import { useState, useEffect, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { WorkspaceService } from '@/services/workspaceService'
import type { Workspace } from '@/lib/supabase'

export function useWorkspaces(userId: string) {
  const queryClient = useQueryClient()

  // Buscar workspaces do usuário
  const {
    data: workspaces = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['workspaces', userId],
    queryFn: () => WorkspaceService.getUserWorkspaces(userId),
    enabled: !!userId
  })

  // Criar workspace
  const createWorkspaceMutation = useMutation({
    mutationFn: (workspace: Omit<Workspace, 'id' | 'created_at' | 'updated_at'>) =>
      WorkspaceService.createWorkspace(workspace),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces', userId] })
    }
  })

  // Atualizar workspace
  const updateWorkspaceMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Workspace> }) =>
      WorkspaceService.updateWorkspace(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces', userId] })
    }
  })

  // Deletar workspace
  const deleteWorkspaceMutation = useMutation({
    mutationFn: (workspaceId: string) => WorkspaceService.deleteWorkspace(workspaceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces', userId] })
    }
  })

  // Adicionar membro
  const addMemberMutation = useMutation({
    mutationFn: ({ workspaceId, userId, role }: { workspaceId: string; userId: string; role: 'owner' | 'admin' | 'member' }) =>
      WorkspaceService.addMember(workspaceId, userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces', userId] })
    }
  })

  // Remover membro
  const removeMemberMutation = useMutation({
    mutationFn: ({ workspaceId, userId }: { workspaceId: string; userId: string }) =>
      WorkspaceService.removeMember(workspaceId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces', userId] })
    }
  })

  return {
    workspaces,
    isLoading,
    error,
    refetch,
    createWorkspace: createWorkspaceMutation.mutate,
    updateWorkspace: updateWorkspaceMutation.mutate,
    deleteWorkspace: deleteWorkspaceMutation.mutate,
    addMember: addMemberMutation.mutate,
    removeMember: removeMemberMutation.mutate,
    isCreating: createWorkspaceMutation.isPending,
    isUpdating: updateWorkspaceMutation.isPending,
    isDeleting: deleteWorkspaceMutation.isPending
  }
}

// Hook para workspace específico
export function useWorkspace(workspaceId: string) {
  const queryClient = useQueryClient()

  const {
    data: workspace,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['workspace', workspaceId],
    queryFn: () => WorkspaceService.getWorkspace(workspaceId),
    enabled: !!workspaceId
  })

  const updateWorkspaceMutation = useMutation({
    mutationFn: (updates: Partial<Workspace>) =>
      WorkspaceService.updateWorkspace(workspaceId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace', workspaceId] })
      queryClient.invalidateQueries({ queryKey: ['workspaces'] })
    }
  })

  return {
    workspace,
    isLoading,
    error,
    refetch,
    updateWorkspace: updateWorkspaceMutation.mutate,
    isUpdating: updateWorkspaceMutation.isPending
  }
}
