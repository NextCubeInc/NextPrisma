import React, { useState, useCallback, ReactNode } from 'react';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { Check, ChevronRight } from 'lucide-react';

interface StepProps {
  title: string;
  description?: string;
  children: ReactNode;
  isOptional?: boolean;
}

interface StepperProps {
  children: ReactNode;
  initialStep?: number;
  onStepChange?: (step: number) => void;
  onFinalStepCompleted?: () => void;
  stepCircleContainerClassName?: string;
  stepContainerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  backButtonProps?: any;
  nextButtonProps?: any;
  backButtonText?: string;
  nextButtonText?: string;
  completeButtonText?: string;
  disableStepIndicators?: boolean;
  renderStepIndicator?: (step: number, isActive: boolean, isCompleted: boolean) => ReactNode;
}

export const Step: React.FC<StepProps> = ({ children }) => {
  return <div>{children}</div>;
};

export const Stepper: React.FC<StepperProps> = ({
  children,
  initialStep = 1,
  onStepChange = () => {},
  onFinalStepCompleted = () => {},
  stepCircleContainerClassName = '',
  stepContainerClassName = '',
  contentClassName = '',
  footerClassName = '',
  backButtonProps = {},
  nextButtonProps = {},
  backButtonText = 'Voltar',
  nextButtonText = 'Continuar',
  completeButtonText = 'Finalizar',
  disableStepIndicators = false,
  renderStepIndicator,
}) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  
  const steps = React.Children.toArray(children).filter(
    (child): child is React.ReactElement<StepProps> =>
      React.isValidElement(child) && child.type === Step
  );

  const totalSteps = steps.length;
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  const handleStepChange = useCallback((step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
      onStepChange(step);
    }
  }, [totalSteps, onStepChange]);

  const handleNext = useCallback(() => {
    if (isLastStep) {
      onFinalStepCompleted();
    } else {
      handleStepChange(currentStep + 1);
    }
  }, [currentStep, isLastStep, handleStepChange, onFinalStepCompleted]);

  const handleBack = useCallback(() => {
    handleStepChange(currentStep - 1);
  }, [currentStep, handleStepChange]);

  const handleStepClick = useCallback((step: number) => {
    if (!disableStepIndicators && step <= currentStep) {
      handleStepChange(step);
    }
  }, [disableStepIndicators, currentStep, handleStepChange]);

  const defaultStepIndicator = (step: number, isActive: boolean, isCompleted: boolean) => (
    <div
      className={cn(
        'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 cursor-pointer',
        {
          'bg-primary border-primary text-primary-foreground': isActive,
          'bg-green-500 border-green-500 text-white': isCompleted && !isActive,
          'border-gray-300 text-gray-500 hover:border-primary/50': !isActive && !isCompleted,
          'cursor-not-allowed': disableStepIndicators,
        }
      )}
      onClick={() => handleStepClick(step)}
    >
      {isCompleted && !isActive ? (
        <Check className="w-5 h-5" />
      ) : (
        <span className="text-sm font-semibold">{step}</span>
      )}
    </div>
  );

  const currentStepData = steps[currentStep - 1];

  return (
    <div className="w-full">
      {/* Step Indicators */}
      <div className={cn('mb-8', stepContainerClassName)}>
        <div className={cn('flex items-center justify-between', stepCircleContainerClassName)}>
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === currentStep;
            const isCompleted = stepNumber < currentStep;
            const stepProps = step.props as StepProps;

            return (
              <div key={stepNumber} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  {renderStepIndicator
                    ? renderStepIndicator(stepNumber, isActive, isCompleted)
                    : defaultStepIndicator(stepNumber, isActive, isCompleted)
                  }
                  <div className="mt-2 text-center">
                    <div className={cn(
                      'text-sm font-medium',
                      {
                        'text-primary': isActive,
                        'text-green-600': isCompleted && !isActive,
                        'text-gray-500': !isActive && !isCompleted,
                      }
                    )}>
                      {stepProps.title}
                    </div>
                    {stepProps.description && (
                      <div className="text-xs text-gray-400 mt-1">
                        {stepProps.description}
                      </div>
                    )}
                    {stepProps.isOptional && (
                      <div className="text-xs text-gray-400 mt-1">
                        (Opcional)
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Connector Line */}
                {stepNumber < totalSteps && (
                  <div className="flex-1 mx-4">
                    <div className={cn(
                      'h-0.5 transition-colors duration-200',
                      {
                        'bg-green-500': stepNumber < currentStep,
                        'bg-primary': stepNumber === currentStep - 1,
                        'bg-gray-300': stepNumber >= currentStep,
                      }
                    )} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className={cn('min-h-[400px]', contentClassName)}>
        {currentStepData}
      </div>

      {/* Navigation Footer */}
      <div className={cn('flex justify-between items-center mt-8 pt-6 border-t', footerClassName)}>
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={isFirstStep}
          className={cn('min-w-[100px]', {
            'invisible': isFirstStep
          })}
          {...backButtonProps}
        >
          {backButtonText}
        </Button>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>{currentStep}</span>
          <span>de</span>
          <span>{totalSteps}</span>
        </div>

        <Button
          onClick={handleNext}
          className="min-w-[100px]"
          {...nextButtonProps}
        >
          {isLastStep ? completeButtonText : nextButtonText}
          {!isLastStep && <ChevronRight className="w-4 h-4 ml-1" />}
        </Button>
      </div>
    </div>
  );
};

export default Stepper;