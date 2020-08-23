import * as gi from 'node-gtk';

// For convenience
export const GObject = gi.require('GObject', '2.0');

// Workaround lacks of inheritance in ts-for-gir's NodeJS types.
interface GetPropertyable {
  getv(names: string[], values: GObject.Value[]): void;
}

// node-gtk doesn't support non-introspected properties.
// See https://github.com/romgrk/node-gtk/issues/83
export function getIntProperty(obj: GetPropertyable, prop: string) {
  const gvalue = new GObject.Value();
  // I'm not sure what's up with the typing.
  // @ts-ignore
  gvalue.init(GObject.TYPE_INT);

  obj.getv([prop], [gvalue]);
  const ret = gvalue.getInt();
  gvalue.unset();

  return ret;
}
