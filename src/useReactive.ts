import { useRef, useSyncExternalStore } from "react";
import { isPlainObject } from "lodash";
import useUpdate from "./useUpdate";
import useCreation from "./useCreation";

const proxyMap = new WeakMap();
const rawMap = new WeakMap();

function observer<T extends Record<string, any>>(
  initialVal: T,
  cb: () => void
): T {
  const existingProxy = proxyMap.get(initialVal);

  if (existingProxy) {
    return existingProxy;
  }
  if (rawMap.has(initialVal)) {
    return initialVal;
  }

  const proxy = new Proxy<T>(initialVal, {
    get(target, key, receiver) {
      const res = Reflect.get(target, key, receiver);

      return isPlainObject(res) || Array.isArray(res) ? observer(res, cb) : res;
    },
    set(target, key, val) {
      const ret = Reflect.set(target, key, val);
      cb();
      return ret;
    },
    deleteProperty(target, key) {
      const ret = Reflect.deleteProperty(target, key);
      cb();
      return ret;
    }
  });

  proxyMap.set(initialVal, proxy);
  rawMap.set(proxy, initialVal);

  return proxy;
}

function useReactive<S extends Record<string, any>>(initialState: S): S {
  const update = useUpdate();
  const stateRef = useRef<S>(initialState);

  const state = useCreation(() => {
    return observer(stateRef.current, () => {
      update();
    });
  }, []);

  return state;
}

export default useReactive;
