import Link from 'next/link';
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col ">
      <div className="container mx-auto px-4 flex flex-col space-y-6 max-w-screen-sm items-center ">
        <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8 items-center">
          <h3 className="text-2xl text-center font-bold tracking-tight ">
            ГДЗ по материалам учебников «Школа России»
          </h3>
          <hr className="my-4 border-base-content border-2" />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-0 sm:px-6 lg:px-8 flex flex-col items-center space-y-6">
          <div>
            <Link href="/schoolRussianGDZ/matematikaGDZ/moroUchebnik">
              <button className="btn btn-outline min-w-[200px]">
                МАТЕМАТИКА
              </button>
            </Link>
          </div>

          <div>
            <Link href="/schoolRussianGDZ/rusYazGDZ/kanakinaUchebnik">
              <button className="btn btn-outline min-w-[200px]">
                РУССКИЙ ЯЗЫК
              </button>
            </Link>
          </div>
        </div>

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
