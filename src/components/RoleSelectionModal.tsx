import { useRoleSelection } from '@/hooks/users';
import { UserSelectDtoRoleEnum } from '@/types/api.types';
import { BrowserStorage } from '@/utils/storage';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

export function RoleSelectionModal() {
  const { showRoleModal, setShowRoleModal, handleRoleSelect } = useRoleSelection();

  return (
    <Transition
      appear
      show={showRoleModal}
      as={Fragment}
    >
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => {
          BrowserStorage.setUserClosedRoleSelectionModal(true);
          setShowRoleModal(false);
        }}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-2xl font-semibold font-secondary text-center text-green"
                >
                  <span className="text-[var(--ar-green)]">Personalize</span> Your Experience
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-base font-primary text-center text-gray-700">How are you using Adaptive Reader?</p>
                </div>

                <div className="mt-8 space-y-4">
                  <button
                    type="button"
                    className="cursor-pointer hover:bg-[var(--ar-green)] hover:text-white w-full rounded-md border border-[var(--ar-green)] bg-white px-4 py-3 text-base font-medium focus:outline-none focus:ring-2 focus:ring-[var(--ar-green)] focus:ring-opacity-50"
                    onClick={() => handleRoleSelect(UserSelectDtoRoleEnum.TEACHER)}
                  >
                    I'm a Teacher
                  </button>
                  <button
                    type="button"
                    className="cursor-pointer hover:bg-[var(--ar-green)] hover:text-white w-full rounded-md border border-[var(--ar-green)] bg-white px-4 py-3 text-base font-medium focus:outline-none focus:ring-2 focus:ring-[var(--ar-green)] focus:ring-opacity-50"
                    onClick={() => handleRoleSelect(UserSelectDtoRoleEnum.INDIVIDUAL)}
                  >
                    I'm a Reader
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
