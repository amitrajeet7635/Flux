import Link from 'next/link';
import MagicToggle from './MagicToggle';

export default function NavBar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-brand-600">⚡ Flux</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm font-medium text-gray-600">
            <Link href="/" className="hover:text-brand-600 transition-colors">
              Inbox
            </Link>
            <Link href="/settings" className="hover:text-brand-600 transition-colors">
              Settings
            </Link>
          </nav>
        </div>
        <MagicToggle />
      </div>
    </header>
  );
}
