import { ChangeEvent } from 'react';
import { useShallow } from 'zustand/shallow';
import { useAppStore } from '../store';
import { HashType, SUPPORTED_HASHES } from '../types/base';

export default function Options() {
  const { options, updateOptions } = useAppStore(
    useShallow((state) => ({
      options: state.options,
      updateOptions: state.updateOptions,
    })),
  );

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const currentHashType = value as HashType;
    const { hashTypes } = options;
    const hashTypesSet = new Set(hashTypes);

    if (checked && !hashTypesSet.has(currentHashType)) {
      hashTypesSet.add(currentHashType);
    } else if (!checked && hashTypesSet.has(currentHashType)) {
      hashTypesSet.delete(currentHashType);
    }

    updateOptions({
      ...options,
      hashTypes: Array.from(hashTypesSet),
    });
  };

  return (
    <div className="hashes-select">
      {SUPPORTED_HASHES.map((hashType) => {
        const id = `hash-type-${hashType}`;
        return (
          <div key={id}>
            <label htmlFor={id}>{hashType}</label>
            <input
              type="checkbox"
              name="hashType"
              value={hashType}
              id={id}
              checked={options.hashTypes.includes(hashType)}
              onChange={handleCheckboxChange}
            />
          </div>
        );
      })}
    </div>
  );
}
