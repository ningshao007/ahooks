import { useEffect, useRef } from "react";

type IProps = Record<string, any>;

export default function useWhyDidYouUpdate(
  componentName: string,
  props: IProps
) {
  const prevProps = useRef<IProps>({});

  useEffect(() => {
    if (prevProps.current) {
      const allKeys = Object.keys({ ...prevProps.current, ...props });
      const changeProps: IProps = {};

      allKeys.forEach((key) => {
        if (!Object.is(prevProps.current[key], props[key])) {
          changeProps[key] = {
            from: prevProps.current[key],
            to: props[key]
          };
        }
      });

      if (Object.keys(changeProps).length) {
        console.log("[why-did-you-update]]", componentName, changeProps);
      }
    }

    prevProps.current = props;
  });
}
