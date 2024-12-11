import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {format} from 'date-fns';

interface ConversationHeroProps {
    name: string
    image?: string
}

const ConversationHero = ({ name, image }: ConversationHeroProps) => {
  const avatarFallback = name.charAt(0).toUpperCase();
  return (
    <div className='mt-[88px] mx-5 mb-4'>
      <div className='flex items-center gap-x-1 mb-2'>
        <Avatar className='size-14 mb-4 rounded-md'>
          <AvatarImage src={image} />
          <AvatarFallback className='rounded-md  bg-sky-500 text-white'>
            {avatarFallback }
          </AvatarFallback>
        </Avatar>
        <p className="text-2xl font-bold">
            {name}
        </p>
      </div>
        <p className='font-normal text-slate-800'>
        This conversation is just between you and <strong>{name}</strong>
        </p>
    </div>
  )
}

export default ConversationHero