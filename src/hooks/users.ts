import { queryClient } from '@/queries/client';
import { queryKeys } from '@/queries/keys';
import { useUpdateUserRole } from '@/queries/users.query';
import { useGetCurrentUser } from '@/queries/users.query';
import { UserSelectDtoRoleEnum } from '@/types/api.types';
import { BrowserStorage } from '@/utils/storage';
import { useAuth } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Event, useTrackEvent } from './events';

export function useSignOut() {
  const trackEvent = useTrackEvent();

  const { signOut } = useAuth();
  const navigate = useNavigate();

  function onSignOut() {
    trackEvent(Event.SignedOut);
    signOut();
    BrowserStorage.setUserClosedRoleSelectionModal(false);
    queryClient.setQueryData(queryKeys.users.getCurrentUser, null);
    navigate(0);
  }

  return onSignOut;
}

export function useRoleSelection() {
  const { data: user } = useGetCurrentUser();
  const [showRoleModal, setShowRoleModal] = useState(false);
  const { mutateAsync: updateUserRole } = useUpdateUserRole();

  const userClosedRoleSelectionModal = BrowserStorage.getUserClosedRoleSelectionModal();

  useEffect(() => {
    if (user && !user.role && !userClosedRoleSelectionModal) {
      setShowRoleModal(true);
    }
  }, [user]);

  const handleRoleSelect = async (role: UserSelectDtoRoleEnum) => {
    if (!user) return;

    try {
      await updateUserRole({ role });
      setShowRoleModal(false);
    } catch (error) {
      console.error('Failed to update user role:', error);
    }
  };

  return {
    showRoleModal,
    setShowRoleModal,
    handleRoleSelect,
  };
}
