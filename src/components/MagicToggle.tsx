'use client';

import { useTranslation } from './TranslationProvider';

export default function MagicToggle() {
  const { translationEnabled, toggle } = useTranslation();

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
      aria-label={translationEnabled ? 'Disable auto-translation' : 'Enable auto-translation'}
    >
      {/* Track */}
      <span
        className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ${
          translationEnabled ? 'bg-brand-500' : 'bg-gray-300'
        }`}
      >
        {/* Thumb */}
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
            translationEnabled ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </span>
      <span className={translationEnabled ? 'text-brand-600' : 'text-gray-500'}>
        {translationEnabled ? 'Translation ON' : 'Translation OFF'}
      </span>
    </button>
  );
}
