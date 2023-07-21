const host = window.location.protocol + "//" + window.location.host;
document.getElementById("submit").onclick = async (event) => {
  event.preventDefault();
  try {
    const email = document.getElementById("email").value;
    console.log(email);
    const res = await axios.post(host + "/password/reset", { email });
    console.log(res);
    window.alert(res.data.message);
  } catch (err) {
    console.log(err);
    window.alert(err);
  }
};
