'use client';

import { Home, Search, Library, Heart, ListMusic } from 'lucide-react';
import { useLibraryStore } from '@/store';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'search', label: 'Search', icon: Search },
  { id: 'library', label: 'Library', icon: Library },
  { id: 'favorites', label: 'Favorites', icon: Heart },
  { id: 'queue', label: 'Queue', icon: ListMusic },
] as const;

export function BottomNav() {
  const { activeView, setActiveView } = useLibraryStore();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30"
      style={{
        background: 'rgba(13,13,20,0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <div className="flex items-center justify-around px-2 py-2 pb-safe-bottom">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const active = activeView === id;
          return (
            <button
              key={id}
              onClick={() => setActiveView(id as typeof activeView)}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 active:scale-90',
                active ? 'text-accent-primary' : 'text-ink-400 hover:text-ink-200'
              )}
            >
              <Icon
                size={22}
                className={cn(
                  'transition-all duration-200',
                  active && id === 'favorites' && 'fill-accent-primary'
                )}
                strokeWidth={active ? 2.5 : 1.8}
              />
              <span className={cn('text-[10px] font-medium', active ? 'text-accent-primary' : 'text-ink-400')}>
                {label}
              </span>
              {active && (
                <div className="absolute bottom-1 w-1 h-1 bg-accent-primary rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
