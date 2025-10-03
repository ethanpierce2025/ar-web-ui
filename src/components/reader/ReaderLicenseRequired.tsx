import { FunctionComponent } from 'react';
import { Subtitle, Title } from '../ui/Text';

export const ReaderLicenseRequired: FunctionComponent = () => {
  return (
    <div className="flex flex-col flex-1">
      <Title className="mb-3">This content requires a School License</Title>
      <Subtitle className="mb-6 !text-[16px] !text-[#3D3D3D]">
        Learn more about our licensing options{' '}
        <a
          className="underline"
          href="https://www.adaptivereader.com/pages/school-license"
          target="_blank"
        >
          for schools and organizations.
        </a>
      </Subtitle>
      <div className="flex flex-1 lg:mb-0 mb-12 flex-col h-[60vh] gap-2 overflow-x-hidden overflow-y-auto pb-5 blur-sm">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut at imperdiet metus. Proin nec quam nec dolor
          consectetur luctus.
        </p>
        <p>
          Aliquam imperdiet eu eros semper volutpat. Fusce tincidunt efficitur sapien nec accumsan. Ut quis facilisis
          dolor, pharetra sollicitudin felis. Maecenas eu velit arcu.
        </p>
        <p>
          Suspendisse sed nisi maximus, tincidunt arcu ut, convallis orci. Sed iaculis consequat commodo. Cras id justo
          suscipit, dignissim sapien nec, condimentum urna. Phasellus sodales odio sit amet leo sagittis, at maximus
          ligula laoreet.
        </p>
      </div>
    </div>
  );
};
