import { Link } from 'react-router';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ROUTES } from '@/lib/constants';

export function HomePage() {
  return (
    <Card className="w-100 mx-auto mt-40">
      <CardHeader>
        <CardTitle>Dashboard</CardTitle>
        <CardDescription>The POS dashboard is coming soon.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">
          This is a placeholder page.
        </p>
        <Link
          to={ROUTES.LOGIN}
          className="text-sm text-primary underline-offset-4 hover:underline"
        >
          Go to login
        </Link>
      </CardContent>
    </Card>
  );
}
