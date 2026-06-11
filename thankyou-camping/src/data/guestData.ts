export interface GuestCounts {
  adults: number;
  children: number;
  pets: number;
}

export const DEFAULT_GUEST_COUNTS: GuestCounts = {
  adults: 2,
  children: 0,
  pets: 0,
};

export function formatGuestLabel(counts: GuestCounts): string {
  const parts: string[] = [`성인 ${counts.adults}`];
  if (counts.children > 0) parts.push(`아동 ${counts.children}`);
  if (counts.pets > 0) parts.push(`반려견 ${counts.pets}`);
  return parts.join(' · ');
}

export function formatGuestSummary(counts: GuestCounts): string {
  const parts: string[] = [`성인 ${counts.adults}명`];
  if (counts.children > 0) parts.push(`아동 ${counts.children}명`);
  if (counts.pets > 0) parts.push(`반려견 ${counts.pets}마리`);
  return parts.join(' · ');
}

export function parseGuestLabel(label: string): GuestCounts {
  const adults = Number(label.match(/성인\s*(\d+)/)?.[1] ?? 2);
  const children = Number(
    label.match(/아동\s*(\d+)/)?.[1] ?? label.match(/아이\s*(\d+)/)?.[1] ?? 0,
  );
  const pets = Number(label.match(/반려견\s*(\d+)/)?.[1] ?? 0);

  return {
    adults: Math.min(6, Math.max(1, adults)),
    children: Math.min(6, Math.max(0, children)),
    pets: Math.min(3, Math.max(0, pets)),
  };
}
