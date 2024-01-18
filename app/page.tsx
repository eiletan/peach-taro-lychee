import Image from 'next/image'
import styles from './page.module.css'
import LoginPage from './LoginPage';
import prisma from '@/lib/prisma';

async function getCards() {
  const cards = await prisma.card.findMany({
    select: {
      id: true,
      header: true,
      updatedAt: true
    }
  });
  return cards;
}

export default async function Home() {
  const cards = await getCards();
  return (
    <LoginPage></LoginPage>
);
}
