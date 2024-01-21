import type { Ceremony, AwardRank } from '$lib/domain/entity';
import type { Department } from '$lib/domain/value';
import { getService } from '$lib/server/index.js';
import type { RootLayoutData } from '../../+layout.server';

export interface AwardLayoutData {
  ceremony: Ceremony;
  winningsByDept: Map<Department, AwardRank[]>;
}

interface LoadParams {
  params: { year: string };
  parent: () => Promise<RootLayoutData>;
}

export async function load({ params, parent }: LoadParams): Promise<AwardLayoutData> {
  const year = parseInt(params.year);
  const service = getService();
  const parentData = await parent();
  return {
    ceremony: parentData.ceremonies.find((c) => c.year === year)!, // TODO: 404
    winningsByDept: await service.getWinningWorks(year),
  };
}