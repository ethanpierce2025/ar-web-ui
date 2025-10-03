import { Close } from '@/assets/icons/Close';
import { routes } from '@/routes/routes';
import { Dialog, DialogProps, Transition } from '@headlessui/react';
import { Fragment, FunctionComponent } from 'react';
import { Button } from '../ui/Button';
import { Link } from '../ui/Link';

export type PremiumModalProps = Pick<DialogProps<any>, 'open' | 'onClose'>;

export const PremiumModal: FunctionComponent<PremiumModalProps> = (props) => {
  const { onClose, open } = props;
  return (
    <Transition
      appear
      show={open}
      as={Fragment}
    >
      <Dialog
        as="div"
        className="relative z-10"
        onClose={onClose}
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
          <div className="fixed inset-0 bg-black/25" />
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div
                  onClick={() => onClose(false)}
                  className="absolute top-4 right-4 cursor-pointer"
                >
                  <Close />
                </div>
                <Dialog.Title
                  as="h3"
                  className="text-[20px] text-gray-900 font-secondary"
                >
                  Unlock Premium Novels
                </Dialog.Title>
                <div className="mt-4">
                  <p className="text-m font-primary">
                    This classic is part of our premium collection, exclusively available through our School License
                    program.
                  </p>
                </div>

                <div className="flex flex-col gap-2 mt-4">
                  <Button
                    as="div"
                    className="font-primary text-[14px] w-fit self-center"
                  >
                    <Link
                      to="https://www.adaptivereader.com/pages/school-license"
                      target="_blank"
                      type="button"
                      className="font-primary text-[14px] w-fit self-center"
                    >
                      Learn More About School Licenses
                    </Link>
                  </Button>
                  <p className="font-primary text-[14px] text-center">
                    Already have a school license? Contact your administrator.
                  </p>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
