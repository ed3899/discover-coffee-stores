//% libs
import cls from "classnames";

//% components

// native
import Link from "next/link";
import Image from "next/image";

//% styles
import styles from "./card.module.css";
import {Fragment} from "react";

type CardPropsT = {
  href: string;
  name: string;
  imgUrl: string;
  className: string;
};

const Card = (props: CardPropsT) => {
  return (
    <Link href={props.href}>
      <a className={cls(styles.cardLink, props.className)}>
        <div className={cls("glass", styles.container)}>
          <div className={styles.cardHeaderWrapper}>
            <h2 className={styles.cardHeader}>{props.name}</h2>
          </div>

          <div className={styles.cardImageWrapper}>
            <Image
              className={styles.cardImage}
              src={props.imgUrl}
              width={260}
              height={160}
              alt="coffee shop image"
            />
          </div>
        </div>
      </a>
    </Link>
  );
};

export default Card;
