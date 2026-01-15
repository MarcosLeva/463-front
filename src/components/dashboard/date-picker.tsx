"use client";

import * as React from "react";
import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, getYear, getMonth, isEqual } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  className?: string;
}

const CustomCalendar = ({ selectedDate, onDateSelect, setDisplayDate, displayDate }: { selectedDate: Date | undefined, onDateSelect: (date: Date) => void, displayDate: Date, setDisplayDate: (date: Date) => void }) => {
  
  const firstDayOfMonth = startOfMonth(displayDate);
  const lastDayOfMonth = endOfMonth(displayDate);
  const daysInMonth = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });
  
  // getDay returns 0 for Sunday, 6 for Saturday. We need to adjust for this.
  const startingDayIndex = getDay(firstDayOfMonth);

  const daysOfWeek = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"];

  return (
    <div className="p-3">
      <div className="flex justify-between items-center mb-2">
        <Button variant="outline" size="icon" onClick={() => setDisplayDate(subMonths(displayDate, 1))}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-sm font-medium">
          {format(displayDate, "MMMM yyyy", { locale: es })}
        </div>
        <Button variant="outline" size="icon" onClick={() => setDisplayDate(addMonths(displayDate, 1))}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-xs text-muted-foreground">
        {daysOfWeek.map(day => <div key={day}>{day}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1 mt-2">
        {Array.from({ length: startingDayIndex }).map((_, index) => (
          <div key={`empty-${index}`} />
        ))}
        {daysInMonth.map((day, index) => (
          <Button
            key={index}
            variant={selectedDate && isEqual(day, selectedDate) ? "default" : "ghost"}
            size="icon"
            className="h-8 w-8 text-sm"
            onClick={() => onDateSelect(day)}
          >
            {format(day, "d")}
          </Button>
        ))}
      </div>
    </div>
  );
};


export function DatePicker({ date, setDate, className }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [displayDate, setDisplayDate] = useState(date || new Date());

  const handleDateSelect = (selectedDate: Date) => {
    setDate(selectedDate);
    setDisplayDate(selectedDate);
    setIsOpen(false);
  }

  React.useEffect(() => {
    if (date) {
        setDisplayDate(date);
    }
  }, [date])

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP", { locale: es }) : <span>Elegir fecha</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <CustomCalendar selectedDate={date} onDateSelect={handleDateSelect} displayDate={displayDate} setDisplayDate={setDisplayDate} />
      </PopoverContent>
    </Popover>
  );
}
