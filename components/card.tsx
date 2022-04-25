//% components

// native
import Link from "next/link";
import Image from "next/image";

type CardPropsT = {
  href: string;
  name: string;
  imgUrl: string;
};

const Card = (props:CardPropsT) => {
  return (
    <Link href={props.href}>
      <a>
        <h2>{props.name}</h2>
        <Image src={props.imgUrl} width={260} height={160} />
      </a>
    </Link>
  );
};

export default Card;
