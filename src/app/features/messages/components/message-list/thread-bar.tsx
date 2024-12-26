

interface ThreadBarProps {
    count?: number;
    image?: string;
    timestamp?: number;
    onClick?: ()=> void;
}

const ThreadBar = ({
    count,
    image,
    timestamp,
    onClick
}:ThreadBarProps) => {
  return (
    <div>ThreadBar</div>
  )
}

export default ThreadBar