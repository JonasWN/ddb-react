import { configure } from '@storybook/react';
import '../src/components/components.scss';
import getToken, { setToken } from '../src/core/token.js'

let token = getToken();
if (!token) {
  // We do not want to keep prompting people if they have already cancelled the prompt once.
  const seenKey = 'ddb-token-prompt-seen';
  const promptHasBeenCancelled = localStorage.getItem(seenKey);
  if (!promptHasBeenCancelled) {
    token = window.prompt("Do you have a token for Adgangsplatformen? Input it here.");
    if (token === null) { // which means the prompt has been cancelled
      localStorage.setItem(seenKey, "seen");
    }
  }
}

/**
 * DDB_TOKEN is set in ".storybook/webpack.config.js"
 * Look for it in DefinePlugin.
 */
setToken(token || DDB_TOKEN);
configure(require.context('../src', true, /\.dev\.js$/), module);