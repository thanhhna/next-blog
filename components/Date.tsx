import React from 'react';
import { parseISO, format } from 'date-fns';

export default function Date({
  dateString
}: {
  dateString: string;
}): React.ReactNode {
  const date = parseISO(dateString);
  return <time dateTime={dateString}>{format(date, 'yyyy-MM-dd')}</time>;
}
