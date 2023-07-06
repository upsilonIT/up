import myUrl from "url";

import {
  getSession,
  handleAuth,
  handleLogin,
  handleProfile,
  handleCallback,
  handleLogout,
} from "@auth0/nextjs-auth0";
import Mixpanel from "mixpanel";

let mixpanel: Mixpanel.Mixpanel | undefined;

if (process.env.NEXT_PUBLIC_MIXPANEL_AUTH_TOKEN) {
  mixpanel = Mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_AUTH_TOKEN);
}

export default handleAuth({
  async signup(req, res) {
    const { email } = myUrl.parse(req.url!, true).query;

    await handleLogin(req, res, {
      authorizationParams: {
        screen_hint: "signup",
        login_hint: email && typeof email === "string" ? email : "",
        connection_scope: "openid profile",
      },
    });
  },
  async login(req, res) {
    await handleLogin(req, res, {
      authorizationParams: {
        connection_scope: "openid profile",
      },
    });
  },
  async callback(req, res) {
    await handleCallback(req, res);

    try {
      const currentSession = await getSession(req, res);
      const externalId = currentSession?.user.sub as string; // backend uses this field as 'externalId' for users

      mixpanel?.track("Sign In", {
        distinct_id: externalId,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  },
  async logout(req, res) {
    try {
      const currentSession = await getSession(req, res);
      const externalId = currentSession?.user.sub as string; // backend uses this field as 'externalId' for users

      mixpanel?.track("Logout", {
        distinct_id: externalId,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }

    await handleLogout(req, res);
  },
  profile: async (req, res) => {
    const currentSession = await getSession(req, res);

    try {
      await handleProfile(req, res, {
        refetch: !currentSession?.user.email_verified,
        afterRefetch: (request, response, newSession) => {
          return newSession;
        },
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  },
});
