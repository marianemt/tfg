class Login {
	constructor(form, fields) {
		this.form = form;
		this.fields = fields;
		this.validateonSubmit();

	}

	validateonSubmit() {
		let self = this;

		this.form.addEventListener("submit", (e) => {
			e.preventDefault();
			var error = 0;
			self.fields.forEach((field) => {
				const input = document.querySelector(`#${field}`);
				if (self.validateFields(input) == false) {
					error++;
				}
			});
			if (error == 0) {
				//do login api here
				var data = {
					username: document.querySelector(`#username`).value,
					password: document.querySelector(`#password`).value,
				};
				var datajson = JSON.stringify(data);
				//console.log('send data:', datajson);
				fetch('https://mariane.tmenath.de/authentication/chklogin.php', {
					method: "POST",
					body: datajson,
					header: {
						"Content.type": "application/json", // sent request
						"Accept": "application/json"   // expected data sent back"Accept":       "application/json"   // expected data sent back
					}
				})
					.then((response) => response.json())
					.then((data) => {
						//check successfull logged in
						//console.log(data);
						if (data.error) {
							console.error("Error:", data.message);
							document.querySelector("#error-message-all").style.display = 'block';
							document.querySelector("#error-message-all").innerText = data.message;
						} else { //successfull logged in
							document.querySelector("#error-message-all").style.display = 'none';
							localStorage.setItem("auth", 1);
							localStorage.setItem("role", data.role);
							localStorage.setItem("name", data.displayname);
							localStorage.setItem("bucketid", data.bucketid);
							localStorage.setItem("email", data.email);
							localStorage.setItem("company", data.company);
							this.form.submit();
						}

					})
					.catch((data) => {
						console.error("Error:", data.message);
					});
			}
		});
	}

	validateFields(field) {
		if (field.value.trim() === "") {
			this.setStatus(
				field,
				`${field.previousElementSibling.innerText} cannot be blank`,
				"error"
			);
			return false;
		} else {
			if (field.type == "password") {
				if (field.value.length < 8) {
					this.setStatus(
						field,
						`${field.previousElementSibling.innerText} must be at least 8 characters`,
						"error"
					);
					return false;
				} else {
					this.setStatus(field, null, "success");
					return true;
				}
			} else {
				this.setStatus(field, null, "success");
				return true;
			}
		}
	}

	setStatus(field, message, status) {
		const errorMessage = field.parentElement.querySelector(".error-message");

		if (status == "success") {
			if (errorMessage) {
				errorMessage.innerText = "";
			}
			field.classList.remove("input-error");
		}

		if (status == "error") {
			errorMessage.innerText = message;
			field.classList.add("input-error");
		}
	}
}

const form = document.querySelector(".loginForm");
if (form) {
	const fields = ["username", "password"];
	const validator = new Login(form, fields);
}
