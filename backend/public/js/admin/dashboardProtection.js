
        let adminToken = localStorage.getItem("adminToken")

        const options = {
                method: 'GET',
                headers: { Authorization: `Bearer ${adminToken}` }
            };

            fetch('/admin-verify', options)
                .then(response => response.json())
                .then(response => {
                    if (response.message === "Invalid token") {
                        window.location.href = "/admin-login"
                    }
                    if (response.message === "Not authorized as admin") {
                        window.location.href = "/admin-login"
                    }
                    if (response.message === "No token provided") {
                        window.location.href = "/admin-login"
                    }
                })
                .catch(err => console.error(err));


                function logout(){
                    localStorage.clear()
                     window.location.href = "/admin-login"
                }
   