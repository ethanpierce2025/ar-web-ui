import { GroupCodeBanner } from '@/components/teachers/GroupCodeBanner';
import { Footer } from '@/components/ui/Footer';
import { Navbar, NavbarProps } from '@/components/ui/Navbar';
import { FunctionComponent, PropsWithChildren } from 'react';

type MainLayoutProps = {
  className?: string;
  hideGroupCodeBanner?: boolean;
  navbarProps?: NavbarProps;
  showFooter?: boolean;
  title?: string;
};

export const MainLayout: FunctionComponent<PropsWithChildren<MainLayoutProps>> = (props) => {
  const { children, className = '', hideGroupCodeBanner = false, navbarProps, showFooter = true, title } = props;
  return (
    <div className={`flex flex-col overflow-x-hidden gap-4 min-h-screen ${className}`}>
      <title>{title ? `${title} | Adaptive Reader` : 'Adaptive Reader'}</title>
      <div className="flex flex-col flex-1 h-full w-full">
        {!hideGroupCodeBanner && <GroupCodeBanner />}
        <Navbar {...navbarProps} />
        {children}
      </div>
      {showFooter && <Footer />}
    </div>
  );
};
