import { Logo } from '@/assets/logos/logo';
import { config } from '@/config';
import { userUploadLink } from '@/constants';
import { useGetCurrentUser } from '@/queries/users.query';
import { routes } from '@/routes/routes';
import { UserSelectDtoRoleEnum } from '@/types/api.types';
import { Feature } from '@/types/features.types';
import { BrowserStorage } from '@/utils/storage';
import { SignedIn } from '@clerk/clerk-react';
import { FunctionComponent } from 'react';
import { TrackingLink } from '../shared/tracking-link';
import { Link } from './Link';
import { MaxWidthContainer } from './MaxWidthContainer';
import { NavigationDropdown } from './NavigationDropdown';
import { TooltipWrapper } from './TooltipWrapper';

export type NavbarProps = {
  author?: string;
  disableBrandLink?: boolean;
  displayItems?: boolean;
  forReader?: boolean;
  hideTitleOnMobile?: boolean;
  rightComponent?: JSX.Element;
  title?: string;
};
export const Navbar: FunctionComponent<NavbarProps> = (props) => {
  const {
    author,
    disableBrandLink = false,
    displayItems = true,
    forReader = false,
    hideTitleOnMobile = true,
    rightComponent = <NavigationDropdown />,
    title = 'Adaptive Reader',
  } = props;

  const { data: user } = useGetCurrentUser();
  const isTeacher = user?.role === UserSelectDtoRoleEnum.TEACHER;
  const hasUserUploadFeature = BrowserStorage.hasFeature(Feature.USER_UPLOAD);

  return (
    <nav className="bg-white border-gray-200 border-[1px]">
      <MaxWidthContainer className={`h-[72px] pl-2 pr-4 py-2 transition-all`}>
        <div className="flex flex-row justify-between items-center w-full">
          <div className="flex items-center">
            <Link
              disabled={disableBrandLink}
              to={config.app.shopifyUrl}
              target="_blank"
              className="flex items-center"
            >
              <Logo
                className="h-[56px] w-[56px]"
                color="var(--ar-green)"
              />
              {author ? (
                <TooltipWrapper
                  message={`${title} by ${author}`}
                  tooltipId={'reader-tooltip'}
                >
                  <span
                    className={`${
                      hideTitleOnMobile ? 'hidden' : ''
                    } sm:block font-secondary self-center ${forReader ? 'text-[16px]' : 'text-[18px] sm:text-2xl'} ml-2 leading-loose`}
                  >
                    {title}
                  </span>
                </TooltipWrapper>
              ) : (
                <span
                  className={`${
                    hideTitleOnMobile ? 'hidden' : ''
                  } sm:block font-secondary self-center text-[18px] sm:text-2xl ml-2 leading-loose`}
                >
                  {title}
                </span>
              )}
            </Link>
            {displayItems && (
              <div className="flex items-center gap-4">
                <Link
                  to={routes.catalog.path}
                  className="flex items-center ml-4 sm:ml-16"
                >
                  <span className="font-primary self-center font-bold text-[16px] leading-loose hover:underline">
                    Our Novels
                  </span>
                </Link>
                <SignedIn>
                  {isTeacher && hasUserUploadFeature && (
                    <TrackingLink
                      className="hidden md:flex"
                      href={userUploadLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      trackingLabel="My Uploads"
                    >
                      <span className="font-primary self-center font-bold text-[16px] leading-loose hover:underline">
                        My Uploads
                      </span>
                    </TrackingLink>
                  )}
                  <TrackingLink
                    className="hidden md:flex"
                    href="https://www.adaptivereader.com/pages/contact"
                    target="_blank"
                    trackingLabel="Contact Support"
                  >
                    <span className="font-primary self-center font-bold text-[16px] leading-loose hover:underline">
                      Contact Support
                    </span>
                  </TrackingLink>
                </SignedIn>
              </div>
            )}
          </div>
          {rightComponent}
        </div>
      </MaxWidthContainer>
    </nav>
  );
};
