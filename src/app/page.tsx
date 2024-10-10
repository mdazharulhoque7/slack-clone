'use client';

import { UserButton } from './features/auth/components/user-button';


export default function Home() {

  return (
    <div className="flex flex-col items-center w-full h-full justify-center gap-y-5">
      <UserButton/>
    </div>
  );
}
