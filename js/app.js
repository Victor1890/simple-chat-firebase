const botones = document.querySelector("#botones");
const Usuario = document.querySelector("#nombreUsuario");
const contenidoProtegido = document.querySelector("#contenidoProtegido");
const Formulario = document.querySelector("#formulario");
const inputChat = document.querySelector("#inputChat");

const Authentification = () => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      botones.innerHTML = /*html*/ `
                <button class="btn btn-outline-danger mr-2" onClick='Cerrar();'>Cerrar</button>
            `;
      Usuario.innerHTML = user.displayName;

      Formulario.classList = "input-group py-3 fixed-bottom container";
      ChatContent(user);
    } else {
      botones.innerHTML = /*html*/ `
                <button class="btn btn-outline-success mr-2" onClick='Acceder();'>Acceder</button>
            `;
      Usuario.innerHTML = "Chat";
      contenidoProtegido.innerHTML = /*html*/ `
                <p class="text-center lead mt-5">Debes iniciar sesión</p>
            `;
      Formulario.classList = "input-group py-3 fixed-bottom container d-none";
    }
  });
};

Authentification();

const Acceder = async () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  await firebase
    .auth()
    .signInWithPopup(provider)
    .catch((e) => console.log(e));
};

const Cerrar = () => {
  firebase.auth().signOut();
};

const ChatContent = (user) => {
  Formulario.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!inputChat.value.trim()) return;

    firebase
      .firestore()
      .collection("chat")
      .add({
        name: user.displayName,
        text: inputChat.value,
        id: user.uid,
        date: Date.now(),
        imgUser: user.photoURL
      })
      .catch((e) => console.log(`${e}`));
    inputChat.value = "";
  });

  firebase
    .firestore()
    .collection("chat")
    .orderBy("date")
    .onSnapshot(query => {
      contenidoProtegido.innerHTML = "";
      query.forEach((doc) => {
        if (doc.data().id === user.uid) {
          contenidoProtegido.innerHTML += /*html*/ `
          <div class="d-flex justify-content-end mb-4">
            <span class="msg_cotainer_send">${doc.data().text}</span>
            <div class="img_cont_msg">
              <img
                alt="${doc.data().displayName}"
                src="${doc.data().imgUser}"
                class="rounded-circle user_img_msg"
              />
            </div>
          </div>
        `;
        } else {
          contenidoProtegido.innerHTML += /*html*/ `
          <div class="d-flex justify-content-start mb-4">
          <div class="img_cont_msg">
            <img
              alt="${doc.data().displayName}"
              src="${doc.data().imgUser}"
              class="rounded-circle user_img_msg"
            />
          </div>
            <span class="msg_cotainer">${doc.data().text}</span>
          </div>
        `;
        }

        contenidoProtegido.scrollTop = contenidoProtegido.scrollHeight;
      });
    });
};
