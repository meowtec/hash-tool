import clsx from 'clsx';
import { HashTaskState } from '../../store';
import { formatHash } from '../../utils/utils';

export function HashView({ hashState }: { hashState: HashTaskState | null }) {
  if (!hashState) return null;

  if (hashState.stage === 'FINISH') {
    return (
      <div className="hash-value">
        {formatHash(hashState.hash ?? null)}
        <span className="hash-dur">({hashState.timing?.toFixed(2)}ms)</span>
      </div>
    );
  }

  const { totalBytes = 0, processedBytes = 0 } = hashState;

  return (
    <div className={clsx('hash-progress', hashState.stage === 'ERROR' && 'error')}>
      <div
        style={{
          width: `${(processedBytes / totalBytes) * 100}%`,
        }}
      ></div>
    </div>
  );
}
