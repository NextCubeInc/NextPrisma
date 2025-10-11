import React from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'

interface NavigationButtonsProps {
  currentStep: number
  totalSteps: number
  onPrevious: () => void
  onNext: () => void
  canAdvance?: boolean
  isFirstStep?: boolean
  isLastStep?: boolean
  nextButtonText?: string
  nextButtonVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  nextButtonClassName?: string
  showStepIndicator?: boolean
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  canAdvance = false,
  isFirstStep = false,
  isLastStep = false,
  nextButtonText = isLastStep ? 'Finalizar' : 'Próximo',
  nextButtonVariant = isLastStep ? 'default' : 'default',
  nextButtonClassName = isLastStep ? 'bg-green-600 hover:bg-green-700' : '',
  showStepIndicator = true
}) => {
  return (
    <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstStep}
        className="flex items-center gap-2"
      >
        <ChevronLeft className="w-4 h-4" />
        Voltar
      </Button>
      
      {showStepIndicator && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          Passo {currentStep} de {totalSteps}
        </div>
      )}

      <Button
        onClick={onNext}
        disabled={isLastStep ? false : !canAdvance}
        variant={nextButtonVariant}
        className={`flex items-center gap-2 ${nextButtonClassName}`}
      >
        {nextButtonText}
        {isLastStep ? <Plus className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </Button>
    </div>
  )
}