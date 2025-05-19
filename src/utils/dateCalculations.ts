import { addHours, addDays } from 'date-fns';

export const calculatePhases = (startDate: Date) => {
  const germinationEnd = addHours(startDate, 40);
  const nurseryEnd = addDays(germinationEnd, 15);
  const greenhouseEnd = addDays(nurseryEnd, 40);
  const harvestEnd = addDays(greenhouseEnd, 45);

  return {
    germinationEnd,
    nurseryEnd,
    greenhouseEnd,
    harvestEnd
  };
};