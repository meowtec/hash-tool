import { useAppStore } from '../store';
import { HashView } from './components/hash';

const numberFormat = new Intl.NumberFormat('en-US', { maximumSignificantDigits: 3 });

export default function List() {
  const { hashesTasks, options, removeTask } = useAppStore();

  return (
    <div className="task-list">
      {hashesTasks.map((task) => (
        <div key={task.id} className="task-item">
          <div className="hash-kv">
            {typeof task.content === 'string' ? (
              <>
                <div className="hash-label">text:</div>
                <div className="hash-value">{task.content}</div>
              </>
            ) : (
              <>
                <div className="hash-label">file:</div>
                <div className="hash-value">{task.content.name}</div>
              </>
            )}
          </div>
          {typeof task.content === 'string' ? (
            <div className="hash-kv">
              <div className="hash-label">length:</div>
              <div className="hash-value">{numberFormat.format(task.content.length)}</div>
            </div>
          ) : (
            <div className="hash-kv">
              <div className="hash-label">size:</div>
              <div className="hash-value">{numberFormat.format(task.content.size)} bytes</div>
            </div>
          )}

          {options.hashTypes.map((type) => (
            <div key={type} className="hash-kv">
              <div className="hash-label">{type}:</div>
              <HashView hashState={task.hashes[type] ?? null} />
            </div>
          ))}

          <button type="button" className="task-del" onClick={() => removeTask(task.id)}>
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
