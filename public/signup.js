const host = window.location.protocol + "//" + window.location.host;
document.signupForm.onsubmit = async (event) => {
  event.preventDefault();
  try {
    const details = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
    };
    const response = await axios.post(host + "/signup", details);
    if (response.status === 201) {
      window.alert("Sign Up successful!");
      window.location = response.data.redirect;
    } else throw new Error(response.data.message);
  } catch (err) {
    window.alert(err);
  }
  document.signupForm.reset();
};

document.getElementById("link").href = host + "/login";
