const host = window.location.protocol + "//" + window.location.host;
document.getElementById("submit").onclick = async (event) => {
  event.preventDefault();
  try {
    const password = document.getElementById("password").value;
    const confirmpassword = document.getElementById("confirmpassword").value;

    if (password === confirmpassword) {
      const res = await axios.post(window.location.href, {
        password,
      });
      if (res.status === 201) {
        window.alert(res.data.message);
        window.location = host + "/login";
      } else throw new Error("Something went wrong!");
    } else {
      window.alert("Passwords don't match!");
    }
  } catch (err) {
    window.alert(err);
  }
};
