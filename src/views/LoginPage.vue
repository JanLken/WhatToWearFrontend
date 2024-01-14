<template>
  <div id="okta-signin-container"></div>
</template>

<script>
import OktaSignIn from "@okta/okta-signin-widget";
import "@okta/okta-signin-widget/dist/css/okta-sign-in.min.css";

export default {
  name: "LoginPage",
  mounted() {
    const signIn = new OktaSignIn({
      baseUrl: "https://{yourOktaDomain}",
      clientId: "{yourClientId}",
      redirectUri: window.location.origin + "/callback",
      authParams: {
        pkce: true,
        issuer: "https://{yourOktaDomain}/oauth2/default",
        display: "page",
        scopes: ["openid", "profile", "email"],
      },
    });

    signIn.renderEl(
      { el: "#okta-signin-container" },
      (response) => {
        if (response.status === "SUCCESS") {
          this.$router.push("/");
        }
      },
      (error) => {
        throw error;
      }
    );
  },
};
</script>
