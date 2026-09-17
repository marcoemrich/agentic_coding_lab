/**
 * A thing a customer asks MHPCO to insure, as the office records it on a
 * policy: what kind of thing it is, and the properties the office's rulings
 * turn on.
 */
export interface Item {
  readonly type: string;
  readonly material?: string;
  readonly cursed?: boolean;
  readonly enchantment?: number;
}
