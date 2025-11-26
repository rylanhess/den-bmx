declare module 'react-big-calendar' {
  import { Component, CSSProperties } from 'react';

  export type View = 'month' | 'week' | 'day' | 'agenda';
  export type Navigate = 'PREV' | 'NEXT' | 'TODAY' | 'DATE';

  export interface SlotInfo {
    start: Date;
    end: Date;
    slots: Date[];
    action: 'select' | 'click' | 'doubleClick';
  }

  export interface Event {
    id?: string;
    title?: string;
    start?: Date;
    end?: Date;
    resource?: any;
    allDay?: boolean;
    [key: string]: any; // Allow additional properties
  }

  export interface CalendarProps {
    localizer: any;
    events?: Event[];
    startAccessor?: string | ((event: Event) => Date);
    endAccessor?: string | ((event: Event) => Date);
    defaultDate?: Date;
    defaultView?: View;
    view?: View;
    onView?: (view: View) => void;
    date?: Date;
    onNavigate?: (date: Date | Navigate, view?: View) => void;
    scrollToTime?: Date;
    style?: CSSProperties;
    className?: string;
    eventPropGetter?: (event: Event) => { style?: CSSProperties; className?: string };
    components?: {
      toolbar?: React.ComponentType<any>;
      event?: React.ComponentType<{ event: Event }>;
    };
    formats?: {
      dayFormat?: string | ((date: Date) => string);
      dayHeaderFormat?: string | ((date: Date) => string);
      dayRangeHeaderFormat?: string | (({ start, end }: { start: Date; end: Date }) => string);
      monthHeaderFormat?: string | ((date: Date) => string);
      weekdayFormat?: string | ((date: Date) => string);
      timeGutterFormat?: string | ((date: Date) => string);
      eventTimeRangeFormat?: string | (({ start, end }: { start: Date; end: Date }) => string);
    };
    popup?: boolean;
    popupOffset?: { x: number; y: number };
    onSelectEvent?: (event: Event) => void;
    onSelectSlot?: (slotInfo: SlotInfo) => void;
    selectable?: boolean;
  }

  export class Calendar extends Component<CalendarProps> {}

  export function dateFnsLocalizer(config: {
    format: (date: Date, format: string, options?: any) => string;
    parse: (dateString: string, format: string, options?: any) => Date;
    startOfWeek: (date: Date, options?: any) => Date;
    getDay: (date: Date) => number;
    locales?: any;
  }): any;

  export default Calendar;
}

