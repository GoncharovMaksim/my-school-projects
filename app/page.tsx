'use client';
import Link from 'next/link';
import { loadEnglishStatistics } from './statistics/english/loadEnglishStatistics';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { loadWords } from './english/components/loadWords';
import { AppDispatch } from '@/lib/store';
import { loadMathStatistics } from './statistics/math/loadMathStatistics';
import { usePushSubscription } from './pushNotification/usePushSubscription';
import { useSession } from 'next-auth/react';
import { UserSession } from '@/types/userSession';
import HandleBeforeInstallPrompt from '@/components/HandleBeforeInstallPrompt';

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();

  const { subscribeToPush } = usePushSubscription();

  useEffect(() => {
    dispatch(loadEnglishStatistics());
    dispatch(loadWords());
    dispatch(loadMathStatistics({ today: true }));
    console.log('Перерендер диспатч');
  }, [dispatch]);

  const { data: session } = useSession() as { data: UserSession | null };

  useEffect(() => {
    if (!session?.user?.id) {
      return;
    }
    if (localStorage.getItem('notificationsDisabled') === null) {
      localStorage.setItem('notificationsDisabled', 'false'); // По умолчанию автоподписка активна
    }
    const isNotificationsDisabled =
      localStorage.getItem('notificationsDisabled') === 'true';
    if (isNotificationsDisabled) {
      console.log('Автоподписка отключена.');
    } else {
      subscribeToPush();
      console.log('Автоподписка активна.');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id]);

  return (
    <div className="min-h-screen flex flex-col ">
      <div className="container mx-auto px-4 flex flex-col space-y-6 max-w-screen-sm items-center ">
        <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8 items-center">
          <h1
            className="text-5xl text-center font-bold tracking-tight "
            // style={{ fontFamily: 'var(--font-rubik-doodle-shadow)' }}
          >
            ШКОЛА 112
          </h1>

          <hr className="my-4 border-base-content border-2" />

          <h3 className="text-2xl text-center font-bold tracking-tight ">
            Тестирование по материалам учебников «Школа России»
          </h3>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-0 sm:px-6 lg:px-8 flex flex-col items-center space-y-6">
          <div>
            <Link href="/english">
              <button className="btn btn-outline min-w-[200px]">
                АНГЛИЙСКИЙ <br />
                «Школа России»
              </button>
            </Link>
          </div>

          <div>
            <Link href="/mathTests">
              <button className="btn btn-outline min-w-[200px]">
                МАТЕМАТИКА <br />
                «Школа России»
              </button>
            </Link>
          </div>
          <div>
            <Link href="/math">
              <button className="btn btn-outline min-w-[200px]">
                МАТЕМАТИКА
              </button>
            </Link>
          </div>
          <div>
            <Link href="/calculator">
              <button className="btn btn-outline min-w-[200px]">
                КАЛЬКУЛЯТОР
              </button>
            </Link>
          </div>
          <div>
            <Link href="/literature">
              <button className="btn btn-outline min-w-[200px]">
                ЛИТЕРАТУРА
              </button>
            </Link>
          </div>
          <div>
            <Link href="/schoolRussianGDZ">
              <button className="btn btn-outline min-w-[200px]">
                ДОМАШНИЕ ЗАДАНИЯ <br />
                «Школа России»
              </button>
            </Link>
          </div>
        </div>

        <hr className="my-4 border-base-content border-2 w-full" />
        <HandleBeforeInstallPrompt />
        <h3
          className="text-3xl text-center font-bold tracking-tight "
          // style={{ fontFamily: 'var(--font-rubik-doodle-shadow)' }}
        >
          school112.ru
        </h3>
      </div>
    </div>
  );
}
//348
