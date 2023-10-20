import Title from '@app/shared/Title';
import ToNextButton from '@app/shared/ToNextButton';
import { service } from '@service/init';
import { makeYearView } from './lib/view';

interface AnnualItemProps {
  year: number;
  stage: string;
  to?: string;
}

function AnnualItem({ year, to, stage: state }: AnnualItemProps) {
  return (
    <div className="flex flex-row items-center mt-4 mb-4">
      <p className="font-serif text-2xl font-bold w-24 mr-2">{year}年</p>
      {to && <ToNextButton label={state} to={to} />}
    </div>
  );
}

export default async function Home() {
  const ceremonies = await service.getCeremonies();
  const voter = await service.getLoggedVoter();
  const views = ceremonies.map((c) => {
    const v = c.year === ceremonies[0].year ? voter : undefined;
    return makeYearView(c, v);
  });
  const items = views.map((view) => (
    <AnnualItem key={view.year} year={view.year} to={view.defaultPage} stage={view.stageCNString} />
  ));
  return [<Title key="title" to="/" />, <main key="main">{items}</main>];
}

export const revalidate = 3600;
