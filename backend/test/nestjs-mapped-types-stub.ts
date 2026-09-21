export function PartialType<T>(classRef: new () => T): new () => Partial<T> {
  abstract class PartialClass {}
  Object.defineProperty(PartialClass, 'name', {
    value: `Partial${classRef.name}`,
  });
  return PartialClass as unknown as new () => Partial<T>;
}

export function OmitType<T, K extends keyof T>(
  classRef: new () => T,
  _keys: readonly K[],
): new () => Omit<T, K> {
  abstract class OmitClass {}
  return OmitClass as unknown as new () => Omit<T, K>;
}

export function PickType<T, K extends keyof T>(
  classRef: new () => T,
  _keys: readonly K[],
): new () => Pick<T, K> {
  abstract class PickClass {}
  return PickClass as unknown as new () => Pick<T, K>;
}

export function IntersectionType<A, B>(
  _classA: new () => A,
  _classB: new () => B,
): new () => A & B {
  abstract class IntersectionClass {}
  return IntersectionClass as unknown as new () => A & B;
}
