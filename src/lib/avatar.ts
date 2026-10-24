export type DiceBearStyle =
  | 'fun-emoji'
  | 'lorelei'
  | 'micah'
  | 'bottts'
  | 'notionists'
  | 'adventurer';

export interface AvatarStyleOption {
  id: DiceBearStyle;
  label: string;
  description: string;
}

export const DICEBEAR_STYLES: AvatarStyleOption[] = [
  { id: 'fun-emoji', label: 'Playful Emoji', description: 'Fun 3D colorful emoji illustrations' },
  { id: 'lorelei', label: 'Illustrated Art', description: 'Modern anime & character portraits' },
  { id: 'micah', label: 'Vector Heads', description: 'Minimalist designer portraits' },
  { id: 'bottts', label: 'Tech Robots', description: 'Cyberpunk & playful robot avatars' },
  { id: 'notionists', label: 'Notionist', description: 'Hand-drawn sketch illustrations' },
  { id: 'adventurer', label: 'Adventurer', description: 'Fantasy & explorer portraits' },
];

/**
 * Returns a deterministic DiceBear 9.x SVG illustration URL based on seed and style.
 */
export function getUserAvatarUrl(
  seed: string,
  style: DiceBearStyle = 'fun-emoji',
  customSeed?: string
): string {
  const finalSeed = encodeURIComponent(customSeed?.trim() || seed?.trim() || 'SieLabs');
  return `https://api.dicebear.com/9.x/${style}/svg?seed=${finalSeed}&radius=16`;
}

/**
 * Returns a random alphanumeric avatar seed.
 */
export function getRandomAvatarSeed(): string {
  return Math.random().toString(36).substring(2, 10);
}
