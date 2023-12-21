import Image from 'next/image'
import styles from './page.module.css'
import HomePage from './HomePage'
import prisma from '@/lib/prisma';


async function getCards() {
  const cards = await prisma.card.findMany({
    select: {
      id: true,
      header: true,
      updatedAt: true
    }
  });
  console.log(cards);
  return cards;
}

export default async function Home() {
  const cards = await getCards();
  console.log({cards});
  return (
    <HomePage></HomePage>
);
}
