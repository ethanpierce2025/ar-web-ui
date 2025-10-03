import { ChevronDown } from '@/assets/icons/ChevronDown';
import { HamburgerMenu } from '@/assets/icons/HamburgerMenu';
import { userUploadLink } from '@/constants';
import { useGroupCode } from '@/hooks/group-code';
import { useRedirectUrlParam } from '@/hooks/url';
import { useSignOut } from '@/hooks/users';
import { useGetCurrentUser } from '@/queries/users.query';
import { useGetVisitor } from '@/queries/visitors.query';
import { routes } from '@/routes/routes';
import { UserSelectDtoRoleEnum } from '@/types/api.types';
import { Feature } from '@/types/features.types';
import { BrowserStorage } from '@/utils/storage';
import { capitalize } from '@/utils/text';
import { SignedIn, useClerk, useUser } from '@clerk/clerk-react';
import { Menu } from '@headlessui/react';
import { FunctionComponent, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TrackingLink } from '../shared/tracking-link';
import { OutlineButton, PrimaryTransparentButton } from './Button';
import { Dropdown, DropdownItem, DropdownItems, DropdownTrigger } from './Dropdown';
import { Icon } from './Icon';
import { Image } from './Image';
import { Subtitle, Title } from './Text';

type ItemContext = {
  addRedirectUrl: (url: string, pathname: string) => string;
  groupCode?: string;
  groupCodeValid: boolean;
  onManageAccount: () => void;
  onManageOrganization?: () => void;
  onSignOut: () => void;
  onClearCode: () => void;
  orgSet: boolean;
  pathname: string;
  userImageUrl?: string;
  userFullName?: string;
  userEmail?: string;
  userRole?: string;
};

type NavigationDropdownType = {
  Items: (context: ItemContext) => JSX.Element;
  Trigger: (context: ItemContext) => JSX.Element;
};

const visitorDropdown: NavigationDropdownType = {
  Items: (context) => {
    const { addRedirectUrl, pathname } = context;
    return (
      <>
        <DropdownItem className="px-4 py-3 cursor-pointe font-primary">
          <Link to={routes.catalog.path}>Our Novels</Link>
        </DropdownItem>
        <SignedIn>
          <DropdownItem className="px-4 py-3 cursor-pointe font-primary">
            <TrackingLink
              href="https://www.adaptivereader.com/pages/contact"
              target="_blank"
            >
              Contact Support
            </TrackingLink>
          </DropdownItem>
        </SignedIn>
        <DropdownItem className="px-4 py-3 cursor-pointe font-primary">
          <Link to={addRedirectUrl(routes.signIn.path, pathname)}>Sign In</Link>
        </DropdownItem>
        <DropdownItem className="px-4 py-3 font-bold cursor-pointe font-primary">
          <Link to={addRedirectUrl(routes.signUp.path, pathname)}>Sign Up</Link>
        </DropdownItem>
      </>
    );
  },
  Trigger: (context) => {
    const { addRedirectUrl, pathname } = context;
    return (
      <>
        <div className="hidden md:flex items-center">
          <Link to={addRedirectUrl(routes.signIn.path, pathname)}>
            <PrimaryTransparentButton
              as="div"
              className="font-bold"
            >
              Sign In
            </PrimaryTransparentButton>
          </Link>
          <Link to={addRedirectUrl(routes.signUp.path, pathname)}>
            <OutlineButton
              as="div"
              className="font-bold"
            >
              Sign Up
            </OutlineButton>
          </Link>
        </div>
        <div className="flex w-8 h-8 md:hidden">
          <HamburgerMenu />
        </div>
      </>
    );
  },
};

const teacherDropdown: NavigationDropdownType = {
  Items: (context) => {
    const {
      onManageAccount,
      onManageOrganization,
      orgSet,
      onSignOut,
      userEmail,
      userFullName,
      userImageUrl,
      userRole,
    } = context;

    const isTeacher = userRole === UserSelectDtoRoleEnum.TEACHER;
    const hasUserUploadFeature = BrowserStorage.hasFeature(Feature.USER_UPLOAD);

    return (
      <>
        <DropdownItem className="px-4 py-3 cursor-pointe font-primary">
          <Link to={routes.catalog.path}>Our Novels</Link>
        </DropdownItem>
        {isTeacher && hasUserUploadFeature && (
          <DropdownItem className="px-4 py-3 cursor-pointer font-primary">
            <TrackingLink
              className="flex"
              href={userUploadLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              My Uploads
            </TrackingLink>
          </DropdownItem>
        )}
        <DropdownItem className="px-4 py-3 cursor-pointe font-primary">
          <TrackingLink
            href="https://www.adaptivereader.com/pages/contact"
            target="_blank"
          >
            Contact Support
          </TrackingLink>
        </DropdownItem>
        <DropdownItem
          className="px-4 py-3"
          hoverable={false}
        >
          <div className="flex gap-4 items-center">
            <Image
              url={userImageUrl}
              className="h-11 w-11 rounded-full bg-cover bg-center"
            />
            <div className="flex flex-col">
              <Title className="!text-md text-ellipsis overflow-hidden whitespace-nowrap w-[220px]">
                {userFullName}
              </Title>
              <Subtitle>{userEmail}</Subtitle>
              <Subtitle className="text-sm text-gray-500">{capitalize(userRole)}</Subtitle>
            </div>
          </div>
        </DropdownItem>
        <DropdownItem className="px-4 py-3 cursor-pointer font-primary">
          <span onClick={onManageAccount}>Manage Account</span>
        </DropdownItem>
        {orgSet && (
          <DropdownItem className="px-4 py-3 cursor-pointer font-primary">
            <span onClick={onManageOrganization}>Manage Organization</span>
          </DropdownItem>
        )}
        <DropdownItem className="px-4 py-3 cursor-pointer font-primary">
          <span onClick={onSignOut}>Sign Out</span>
        </DropdownItem>
      </>
    );
  },
  Trigger: (context) => {
    const { userImageUrl } = context;
    return (
      <DropdownTrigger className="min-w-[32px]">
        <Image
          url={userImageUrl}
          className="h-8 w-8 rounded-full bg-cover bg-center"
        />
      </DropdownTrigger>
    );
  },
};

const studentDropdown: NavigationDropdownType = {
  Items: (context) => {
    const { addRedirectUrl, groupCode, groupCodeValid, onClearCode, pathname } = context;
    return (
      <>
        <DropdownItem className="px-4 py-3 font-primary flex md:hidden">
          <span className="font-bold">
            Class Code: {groupCode} {!groupCodeValid && '!'}
          </span>
        </DropdownItem>
        <DropdownItem className="px-4 py-3 cursor-pointer font-primary">
          <span onClick={onClearCode}>Clear Class Code</span>
        </DropdownItem>
        <DropdownItem className="px-4 py-3 cursor-pointer font-primary">
          <Link to={addRedirectUrl(routes.signIn.path, pathname)}>Sign In</Link>
        </DropdownItem>
      </>
    );
  },
  Trigger: (context) => {
    const { groupCode, groupCodeValid } = context;
    return (
      <>
        <div className="hidden md:flex items-center">
          <div className="w-[200px] whitespace-nowrap text-ellipsis overflow-hidden text-left font-bold text-[16px] text-[var(--button-bg-color)]">
            Class Code: {groupCode}
            {!groupCodeValid && <span>!</span>}
          </div>
          <Icon>
            <ChevronDown />
          </Icon>
        </div>
        <div className="flex h-8 md:hidden">
          <HamburgerMenu />
        </div>
      </>
    );
  },
};

export const NavigationDropdown: FunctionComponent = () => {
  const { openUserProfile } = useClerk();
  const { openOrganizationProfile } = useClerk();
  const { addRedirectUrl } = useRedirectUrlParam();
  const { pathname } = useLocation();
  const { user } = useUser();
  const { data: currentUser } = useGetCurrentUser();
  const { data: visitor } = useGetVisitor();
  const signOut = useSignOut();
  const { groupCode, removeGroupCode } = useGroupCode();

  const orgSet = useRef(false);
  let dropdown: NavigationDropdownType = visitorDropdown;

  if (groupCode) {
    dropdown = studentDropdown;
  }
  const groupCodeValid = visitor?.groupCodeValid ?? false;

  if (user) {
    dropdown = teacherDropdown;
  }
  if (
    user?.organizationMemberships.length &&
    user?.organizationMemberships[0].role === 'org:admin' &&
    !orgSet.current
  ) {
    orgSet.current = true;
  }

  const { Items, Trigger } = dropdown;

  return (
    <Dropdown>
      <DropdownTrigger className="min-w-[32px]">
        <Trigger
          addRedirectUrl={addRedirectUrl}
          groupCode={groupCode}
          groupCodeValid={groupCodeValid}
          onManageAccount={openUserProfile}
          onManageOrganization={openOrganizationProfile}
          onSignOut={signOut}
          onClearCode={removeGroupCode}
          pathname={pathname}
          userImageUrl={user?.imageUrl}
          userFullName={user?.fullName ?? undefined}
          userEmail={user?.emailAddresses?.at(0)?.emailAddress}
          userRole={currentUser?.role}
          orgSet={orgSet.current}
        />
      </DropdownTrigger>
      <Menu.Items>
        <DropdownItems className="float-right overflow-hidden w-80 py-4">
          <div className="flex flex-col">
            <Items
              addRedirectUrl={addRedirectUrl}
              groupCode={groupCode}
              groupCodeValid={groupCodeValid}
              onManageAccount={openUserProfile}
              onManageOrganization={openOrganizationProfile}
              onSignOut={signOut}
              onClearCode={removeGroupCode}
              pathname={pathname}
              userImageUrl={user?.imageUrl}
              userFullName={user?.fullName ?? undefined}
              userEmail={user?.emailAddresses?.at(0)?.emailAddress}
              userRole={currentUser?.role}
              orgSet={orgSet.current}
            />
          </div>
        </DropdownItems>
      </Menu.Items>
    </Dropdown>
  );
};
