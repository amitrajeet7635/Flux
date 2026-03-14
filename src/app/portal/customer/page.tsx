import { redirect } from 'next/navigation';

export default function CustomerPortalRoot() {
  redirect('/portal/customer/login');
}
