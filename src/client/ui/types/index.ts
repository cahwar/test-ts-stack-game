export type BindedProperty<T> = T | React.Binding<T>;
// export type ExcludedProps<T, K> = Partial<T> & K;
export type ExtraProps<Base, Derived extends Base> = Exclude<keyof Derived, keyof Base>;
export type ExcludedProps<Base, Derived extends Base> = Base & { [K in ExtraProps<Base, Derived>]?: undefined };
