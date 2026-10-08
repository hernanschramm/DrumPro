// ============================================================
// DrumPro Academy - Componente de Calendario Visual
// Fase 3: Clases y Calendario
// ============================================================

import React, { useState } from 'react';
import { Clase } from '../../../types/academy';

interface CalendarViewProps {
  clases: Clase[];
  onClassClick: (clase: Clase) => void;
  currentMonth?: Date;
}

export default function CalendarView({ clases, onClassClick, currentMonth }: CalendarViewProps) {
  const [viewDate, setViewDate] = useState(currentMonth || new Date());

  // Obtener días del mes
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];
    
    // Días vacíos antes del primer día del mes
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Días del mes
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const days = getDaysInMonth(viewDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Obtener clases para un día específico
  const getClasesForDay = (date: Date) => {
    return clases.filter(clase => {
      const claseDate = new Date(clase.fechaInicio);
      return (
        claseDate.getDate() === date.getDate() &&
        claseDate.getMonth() === date.getMonth() &&
        claseDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(viewDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setViewDate(newDate);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header del calendario */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          ←
        </button>
        <h3 className="text-lg font-bold text-gray-800">
          {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
        </h3>
        <button
          onClick={() => navigateMonth('next')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          →
        </button>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 border-b border-gray-200">
        {dayNames.map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
            {day}
          </div>
        ))}
      </div>

      {/* Días del mes */}
      <div className="grid grid-cols-7">
        {days.map((date, index) => {
          if (!date) {
            return <div key={index} className="p-2 min-h-[80px] bg-gray-50" />;
          }

          const dayClases = getClasesForDay(date);
          const isToday = date.getTime() === today.getTime();
          const isPast = date < today;

          return (
            <div
              key={index}
              className={`p-2 min-h-[80px] border-r border-b border-gray-100 ${
                isToday ? 'bg-blue-50' : isPast ? 'bg-gray-50' : 'bg-white'
              }`}
            >
              <div className={`text-sm font-medium mb-1 ${
                isToday ? 'text-blue-600' : isPast ? 'text-gray-400' : 'text-gray-700'
              }`}>
                {date.getDate()}
              </div>
              
              {/* Clases del día */}
              <div className="space-y-1">
                {dayClases.slice(0, 2).map(clase => (
                  <button
                    key={clase.id}
                    onClick={() => onClassClick(clase)}
                    className={`w-full text-left px-2 py-1 rounded text-xs truncate transition-colors ${
                      clase.estado === 'programada'
                        ? 'bg-green-100 hover:bg-green-200 text-green-800'
                        : clase.estado === 'finalizada'
                        ? 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                        : clase.estado === 'cancelada'
                        ? 'bg-red-100 hover:bg-red-200 text-red-800'
                        : 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800'
                    }`}
                  >
                    {clase.titulo}
                  </button>
                ))}
                {dayClases.length > 2 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{dayClases.length - 2} más
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
