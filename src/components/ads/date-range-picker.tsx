import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, Clock, TrendingUp } from 'lucide-react';
import { format, subDays, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export interface DateRange {
  startDate: string;
  endDate: string;
  label: string;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  presets?: boolean;
  comparison?: boolean;
  onComparisonChange?: (range: DateRange | null) => void;
  comparisonValue?: DateRange | null;
  className?: string;
}

const PRESET_RANGES = [
  {
    label: 'Hoje',
    getValue: () => {
      const today = new Date();
      return {
        startDate: format(startOfDay(today), 'yyyy-MM-dd'),
        endDate: format(endOfDay(today), 'yyyy-MM-dd'),
        label: 'Hoje'
      };
    }
  },
  {
    label: 'Ontem',
    getValue: () => {
      const yesterday = subDays(new Date(), 1);
      return {
        startDate: format(startOfDay(yesterday), 'yyyy-MM-dd'),
        endDate: format(endOfDay(yesterday), 'yyyy-MM-dd'),
        label: 'Ontem'
      };
    }
  },
  {
    label: 'Últimos 7 dias',
    getValue: () => {
      const today = new Date();
      const sevenDaysAgo = subDays(today, 6);
      return {
        startDate: format(startOfDay(sevenDaysAgo), 'yyyy-MM-dd'),
        endDate: format(endOfDay(today), 'yyyy-MM-dd'),
        label: 'Últimos 7 dias'
      };
    }
  },
  {
    label: 'Últimos 14 dias',
    getValue: () => {
      const today = new Date();
      const fourteenDaysAgo = subDays(today, 13);
      return {
        startDate: format(startOfDay(fourteenDaysAgo), 'yyyy-MM-dd'),
        endDate: format(endOfDay(today), 'yyyy-MM-dd'),
        label: 'Últimos 14 dias'
      };
    }
  },
  {
    label: 'Últimos 30 dias',
    getValue: () => {
      const today = new Date();
      const thirtyDaysAgo = subDays(today, 29);
      return {
        startDate: format(startOfDay(thirtyDaysAgo), 'yyyy-MM-dd'),
        endDate: format(endOfDay(today), 'yyyy-MM-dd'),
        label: 'Últimos 30 dias'
      };
    }
  },
  {
    label: 'Esta semana',
    getValue: () => {
      const today = new Date();
      return {
        startDate: format(startOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd'),
        endDate: format(endOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd'),
        label: 'Esta semana'
      };
    }
  },
  {
    label: 'Semana passada',
    getValue: () => {
      const lastWeek = subDays(new Date(), 7);
      return {
        startDate: format(startOfWeek(lastWeek, { weekStartsOn: 1 }), 'yyyy-MM-dd'),
        endDate: format(endOfWeek(lastWeek, { weekStartsOn: 1 }), 'yyyy-MM-dd'),
        label: 'Semana passada'
      };
    }
  },
  {
    label: 'Este mês',
    getValue: () => {
      const today = new Date();
      return {
        startDate: format(startOfMonth(today), 'yyyy-MM-dd'),
        endDate: format(endOfMonth(today), 'yyyy-MM-dd'),
        label: 'Este mês'
      };
    }
  },
  {
    label: 'Mês passado',
    getValue: () => {
      const lastMonth = subDays(startOfMonth(new Date()), 1);
      return {
        startDate: format(startOfMonth(lastMonth), 'yyyy-MM-dd'),
        endDate: format(endOfMonth(lastMonth), 'yyyy-MM-dd'),
        label: 'Mês passado'
      };
    }
  },
  {
    label: 'Este ano',
    getValue: () => {
      const today = new Date();
      return {
        startDate: format(startOfYear(today), 'yyyy-MM-dd'),
        endDate: format(endOfYear(today), 'yyyy-MM-dd'),
        label: 'Este ano'
      };
    }
  }
];

export function DateRangePicker({
  value,
  onChange,
  presets = true,
  comparison = false,
  onComparisonChange,
  comparisonValue,
  className
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: value.startDate ? new Date(value.startDate) : undefined,
    to: value.endDate ? new Date(value.endDate) : undefined
  });

  const handleRangeSelect = (range: { from: Date | undefined; to: Date | undefined } | undefined) => {
    if (!range) return;
    
    setSelectedRange(range);
    
    if (range.from && range.to) {
      const newRange: DateRange = {
        startDate: format(range.from, 'yyyy-MM-dd'),
        endDate: format(range.to, 'yyyy-MM-dd'),
        label: 'Período personalizado'
      };
      onChange(newRange);
      setIsOpen(false);
    }
  };

  const handlePresetSelect = (preset: typeof PRESET_RANGES[0]) => {
    const range = preset.getValue();
    onChange(range);
    setIsOpen(false);
  };

  const handleComparisonPresetSelect = (preset: typeof PRESET_RANGES[0]) => {
    if (onComparisonChange) {
      const range = preset.getValue();
      onComparisonChange(range);
      setIsComparisonOpen(false);
    }
  };

  const formatDisplayDate = (range: DateRange) => {
    if (range.label !== 'Período personalizado') {
      return range.label;
    }
    
    const start = new Date(range.startDate);
    const end = new Date(range.endDate);
    
    return `${format(start, 'dd/MM/yyyy', { locale: ptBR })} - ${format(end, 'dd/MM/yyyy', { locale: ptBR })}`;
  };

  return (
    <div className={cn('space-y-4', className)}>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Período de Análise
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Período Principal</label>
              <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !value && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {value ? formatDisplayDate(value) : 'Selecionar período'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="flex">
                    {presets && (
                      <div className="border-r p-4 space-y-2 min-w-[200px]">
                        <h4 className="font-medium text-sm">Períodos Rápidos</h4>
                        <div className="space-y-1">
                          {PRESET_RANGES.map((preset) => (
                            <Button
                              key={preset.label}
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start text-sm"
                              onClick={() => handlePresetSelect(preset)}
                            >
                              {preset.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="p-4">
                      <Calendar
                        mode="range"
                        selected={selectedRange}
                        onSelect={handleRangeSelect}
                        numberOfMonths={2}
                        locale={ptBR}
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {comparison && (
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Período de Comparação</label>
                  {comparisonValue && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onComparisonChange?.(null)}
                      className="text-xs"
                    >
                      Remover
                    </Button>
                  )}
                </div>
                <Popover open={isComparisonOpen} onOpenChange={setIsComparisonOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !comparisonValue && 'text-muted-foreground'
                      )}
                    >
                      <TrendingUp className="mr-2 h-4 w-4" />
                      {comparisonValue ? formatDisplayDate(comparisonValue) : 'Comparar com...'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <div className="p-4 space-y-2 min-w-[200px]">
                      <h4 className="font-medium text-sm">Períodos de Comparação</h4>
                      <div className="space-y-1">
                        {PRESET_RANGES.map((preset) => (
                          <Button
                            key={preset.label}
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-sm"
                            onClick={() => handleComparisonPresetSelect(preset)}
                          >
                            {preset.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>

          {/* Resumo dos períodos selecionados */}
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            <Badge variant="secondary" className="flex items-center gap-1">
              <CalendarIcon className="w-3 h-3" />
              {formatDisplayDate(value)}
            </Badge>
            {comparisonValue && (
              <Badge variant="outline" className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                vs {formatDisplayDate(comparisonValue)}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Hook para gerenciar estado do date range picker
export function useDateRangePicker(initialRange?: DateRange) {
  const [dateRange, setDateRange] = useState<DateRange>(
    initialRange || PRESET_RANGES[2].getValue() // Últimos 7 dias como padrão
  );
  const [comparisonRange, setComparisonRange] = useState<DateRange | null>(null);

  const setPreset = (presetLabel: string) => {
    const preset = PRESET_RANGES.find(p => p.label === presetLabel);
    if (preset) {
      setDateRange(preset.getValue());
    }
  };

  const setComparisonPreset = (presetLabel: string) => {
    const preset = PRESET_RANGES.find(p => p.label === presetLabel);
    if (preset) {
      setComparisonRange(preset.getValue());
    }
  };

  const clearComparison = () => {
    setComparisonRange(null);
  };

  return {
    dateRange,
    setDateRange,
    comparisonRange,
    setComparisonRange,
    setPreset,
    setComparisonPreset,
    clearComparison
  };
}