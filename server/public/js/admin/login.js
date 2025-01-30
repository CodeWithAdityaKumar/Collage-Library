
const adminLoginForm = document.getElementById("adminLoginForm");
const username = document.getElementById("username");
const password = document.getElementById("password");

const options = {
  method: "POST",
};

fetch("/api/isLoggedIn", options)
  .then((response) => response.json())
  .then((response) => {

    if (response.success) {
      if (response.role === "admin") {
        window.location.href = "/pages/admin/dashboard";
      }

      if (response.role === "user") {
        window.location.href = "/pages/user/dashboard";
      }
    }



    console.log(response);
  })
  .catch((err) => console.error(err));




adminLoginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    let data = {
        username: username.value,
        password: password.value,
    }
   
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    await fetch("/api/login/admin", options)
      .then((response) => response.json())
        .then((response) => {

            if (response.error) {
                alert(response.error)   
            }

            if (response.message === "Login successful") {
                alert(response.message)
                window.location.href = "/pages/admin/dashboard"
            }
            
            console.log(response

            )
        })
      .catch((err) => console.error(err));

})


