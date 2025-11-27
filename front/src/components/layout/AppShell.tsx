import { useState, HTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';
import { Outlet } from 'react-router-dom';
import { Sidebar, SidebarItem } from './Sidebar';
import { Navbar, NavbarProps } from './Navbar';

export interface AppShellProps extends HTMLAttributes<HTMLDivElement> {
  sidebarItems: SidebarItem[];
  sidebarHeader?: ReactNode;
  sidebarFooter?: ReactNode;
  navbarLeft?: NavbarProps['left'];
  navbarCenter?: NavbarProps['center'];
  navbarRight?: NavbarProps['right'];
  children?: ReactNode;
}

export function AppShell({
  sidebarItems,
  sidebarHeader,
  sidebarFooter,
  navbarLeft,
  navbarCenter,
  navbarRight,
  children,
  className,
  ...props
}: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      className={clsx(
        'flex h-screen flex-col overflow-hidden',
        'bg-surface dark:bg-neutral-950',
        className
      )}
      {...props}
    >
      {/* Navbar */}
      {(navbarLeft || navbarCenter || navbarRight) && (
        <Navbar 
          left={navbarLeft} 
          center={navbarCenter} 
          right={navbarRight}
          onMenuClick={() => setSidebarOpen(true)}
        />
      )}

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Desktop sempre visível, Mobile como drawer */}
        <Sidebar
          items={sidebarItems}
          header={sidebarHeader}
          footer={sidebarFooter}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto scrollbar-thin bg-neutral-50 dark:bg-neutral-950">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-[1600px]">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
}