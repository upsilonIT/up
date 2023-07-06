import { Dict, Mixpanel } from "mixpanel-browser";
import { useRouter } from "next/router";
import React, { createContext, useContext, useEffect, useMemo } from "react";

const humanReadableRouteNames: Record<string, string> = {};

type IMixpanel = {
  track: (event_name: string, properties?: Dict) => void;
};

const MixpanelContext = createContext<IMixpanel>({
  track: () => {},
});

const RealMixpanelProvider: React.FC<{
  children: React.ReactNode;
  mixpanel: Mixpanel;
}> = (props) => {
  const mixpanel = props.mixpanel;
  const router = useRouter();

  const data = undefined;

  const value: IMixpanel = useMemo(
    () => ({
      track: (event_name: string, properties?: Dict) => {
        mixpanel.track(event_name, properties);
      },
    }),
    [mixpanel]
  );

  useEffect(() => {
    if (!data) {
      return;
    }

    // Identify
  }, [data, mixpanel]);

  useEffect(() => {
    if (!data) {
      return;
    }

    const options: { event_name?: string } = {};

    if (router.pathname in humanReadableRouteNames) {
      options.event_name = humanReadableRouteNames[router.pathname];
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
    (mixpanel as any).track_pageview(
      {
        page: router.pathname,
      },
      options
    );
  }, [router.pathname, data, mixpanel]);

  return (
    <MixpanelContext.Provider value={value}>
      {props.children}
    </MixpanelContext.Provider>
  );
};

export const MixpanelProvider: React.FC<{
  children: React.ReactNode;
  mixpanel?: Mixpanel;
}> = (props) => {
  return props.mixpanel ? (
    <RealMixpanelProvider mixpanel={props.mixpanel}>
      {props.children}
    </RealMixpanelProvider>
  ) : (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>{props.children}</>
  );
};

export default function useMixpanelContext(
  props: { defaultProperties?: Dict } = {}
): IMixpanel {
  const context = useContext(MixpanelContext);
  const proxyContext: IMixpanel = useMemo(
    () => ({
      track: (event_name: string, properties?: Dict) => {
        context.track(event_name, {
          ...props.defaultProperties,
          ...properties,
        });
      },
    }),
    [context, props.defaultProperties]
  );

  return proxyContext;
}
