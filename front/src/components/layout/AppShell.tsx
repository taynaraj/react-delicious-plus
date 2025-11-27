import { HTMLAttributes, ReactNode } from 'react';
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
        <Navbar left={navbarLeft} center={navbarCenter} right={navbarRight} />
      )}

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          items={sidebarItems}
          header={sidebarHeader}
          footer={sidebarFooter}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto scrollbar-thin bg-neutral-50 dark:bg-neutral-950">
          <div className="container mx-auto px-8 py-6 max-w-[1600px]">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
}