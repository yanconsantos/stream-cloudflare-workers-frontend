export const loadTODOS = async (access_token: string) => {
  const response = await fetch('http://127.0.0.1:8787/todos', {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  const data = await response.json();
  return data;
};

export const handleTODOsForm = (access_token: string) => {
  const form = document.querySelector('form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const formData = new FormData(form);

    const title = formData.get('title');
    const completed = formData.get('completed') === 'on';

    try {
      const response = await fetch('http://127.0.0.1:8787/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({ title, completed }),
      });

      const data = await response.json();

      console.log(data);
    } catch (err) {
      console.log(err);
    }
  });
};
