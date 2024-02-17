const form = document.getElementById('signin-form');
if (form) {
  form.addEventListener('submit', (event) => {
    const username = form.username.value;
  const email = form.email.value;
  const password = form.password.value;

  // Validate the input values

  // Send the data to the server

  // Clear the input fields
  form.username.value = '';
  form.email.value = '';
  form.password.value = '';
  });
}