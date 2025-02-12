import { PredictionSetStatus } from '../types/prediction-set';

/**
 *
 * @param status
 * @param endTime
 * @returns
 */
export function getStatusName(status: PredictionSetStatus, endTime: string | Date) {
  switch (status) {
    case PredictionSetStatus.ACTIVE:
      if (Number(new Date()) > Number(new Date(endTime))) {
        return 'Resolving...';
      }

      return 'Active';

    case PredictionSetStatus.FUNDING:
      return 'Funding';

    case PredictionSetStatus.VOTING:
      return 'Voting...';

    case PredictionSetStatus.FINALIZED:
      return 'Closed';

    default:
      break;
  }
}

export function getStatusClass(status: PredictionSetStatus, endTime: string | Date) {
  switch (status) {
    case PredictionSetStatus.ACTIVE:
      if (Number(new Date()) > Number(new Date(endTime))) {
        return 'bg-statusYellow/20 text-statusYellow';
      }

      return 'bg-statusGreen/20 text-statusGreen';

    case PredictionSetStatus.FUNDING:
      return 'bg-statusBlue/20 text-statusBlue';

    case PredictionSetStatus.VOTING:
      return 'bg-statusYellow/20 text-statusYellow';

    case PredictionSetStatus.FINALIZED:
      return 'bg-white/25 text-white';

    default:
      break;
  }
}

export function getDisplayDate(status: PredictionSetStatus, endTime: string, resolutionTime: string | Date) {
  switch (status) {
    case PredictionSetStatus.ACTIVE:
      if (Number(new Date()) > Number(new Date(endTime))) {
        return `Till ${toMonthAndYear(resolutionTime)}`;
      }

      return diffToDaysInDaysHoursMinutes(endTime);

    case PredictionSetStatus.FUNDING:
      return diffToDaysInDaysHoursMinutes(endTime);

    case PredictionSetStatus.VOTING:
      return `Till ${toMonthAndYear(resolutionTime)}`;

    case PredictionSetStatus.FINALIZED:
      return '';

    default:
      break;
  }
}

/**
 *
 * @param status
 * @param endTime
 * @returns
 */
export function tradeEnabled(status: PredictionSetStatus, endTime: string | Date): boolean {
  switch (status) {
    case PredictionSetStatus.ACTIVE:
      if (Number(new Date()) > Number(new Date(endTime))) {
        return false;
      }

      return true;

    case PredictionSetStatus.FUNDING:
    case PredictionSetStatus.VOTING:
    case PredictionSetStatus.FINALIZED:
      return false;

    default:
      return false;
  }
}

export function actionsEnabled(status: PredictionSetStatus, endTime: string | Date): boolean {
  switch (status) {
    case PredictionSetStatus.FUNDING:
      return true;

    case PredictionSetStatus.ACTIVE:
      if (Number(new Date()) > Number(new Date(endTime))) {
        return false;
      }

      return true;

    default:
      return false;
  }
}
