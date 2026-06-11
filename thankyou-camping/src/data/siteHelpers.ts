import type { TentFitStatus } from '../types';

export const tentFitLabels: Record<TentFitStatus, string> = {
  fit: '4인용 돔 텐트 설치 가능',
  tight: '4인용 돔 텐트 빡빡함',
  not_fit: '4인용 돔 텐트 설치 어려움',
};

export const campgroundTentLabels: Record<TentFitStatus, string> = {
  fit: '내 텐트 기준 설치 가능',
  tight: '내 텐트 기준 빡빡하게 설치 가능',
  not_fit: '내 텐트 기준 설치 어려움',
};

export function getSiteShortName(name: string): string {
  return name.replace(' 사이트', '');
}
