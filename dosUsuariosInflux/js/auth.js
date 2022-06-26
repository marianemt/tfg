class Auth {
	constructor() {
		document.querySelector("body").style.display = "none";
		const auth = localStorage.getItem("auth");
		const myrole = localStorage.getItem("role");
		const myname = localStorage.getItem("name");
		const mycompany = localStorage.getItem("company");
		const myemail = localStorage.getItem("email");
		const mybucketid = localStorage.getItem("bucketid");
		this.mycompany = mycompany;
		this.myrole = myrole;
		this.myname = myname;
		this.mycompany = mycompany;
		this.myemail = myemail;
		this.mybucketid = mybucketid;
		this.validateAuth(auth, myname, myrole, mycompany, myemail, mybucketid);
	}

	validateAuth(auth, myname, myrole, mycompany, myemail, mybucketid) {
		if (auth != 1) {
			window.location.replace("index.html");
		} else {
			document.querySelector("body").style.display = "block";
			document.querySelector("#loggedinname").innerText = myname;
			document.querySelector("#loggedinrole").innerText = myrole;
			document.querySelector("#loggedinbucket").innerText = mybucketid;
		}
	}

	logOut() {
		localStorage.removeItem("auth");
		localStorage.removeItem("role");
		localStorage.removeItem("name");
		localStorage.removeItem("company");
		localStorage.removeItem("email");
		localStorage.removeItem("bucketid");
		window.location.replace("index.html");
	}
}
