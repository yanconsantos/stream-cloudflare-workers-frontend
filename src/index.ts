import { handleTODOsForm, loadTODOS } from './todos';
import { createClient } from './utils/client';

const init = async () => {
  const { isLoggedIn, client } = await createClient();

  console.log({ isLoggedIn });

  window.Webflow ||= [];
  window.Webflow.push(async () => {
    const access_token = await client.getTokenSilently();
    const user = await client.getUser();
    console.log({ user, access_token });

    handleTODOsForm(access_token);

    const todos = await loadTODOS(access_token);
    console.log({ todos });
  });
};

init();
