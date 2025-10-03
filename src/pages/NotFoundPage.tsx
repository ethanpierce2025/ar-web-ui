import { Button } from '@/components/ui/Button';
import { MainLayout } from '@/layouts/MainLayout';
import { routes } from '@/routes/routes';
import { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';

type NotFoundPageProps = {
  message?: string;
};

export const NotFoundPage: FunctionComponent<NotFoundPageProps> = (props) => {
  const { message } = props;
  const defaultMessage = "The page you are looking for doesn't exist";
  return (
    <MainLayout title="Not Found">
      <div className="flex flex-col flex-1 items-center justify-center gap-4">
        <h1 className="font-secondary text-7xl">404 Not Found</h1>
        <h2 className="font-primary text-3xl text-center">{message ? message : defaultMessage}</h2>
        <Link to={routes.root.path}>
          <Button as="div">Go to Adaptive Reader</Button>
        </Link>
      </div>
    </MainLayout>
  );
};
