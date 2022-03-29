import {
  getAuth, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, onAuthStateChanged, signOut, signInWithPopup, GoogleAuthProvider,
  getDocs, collection, addDoc, getFirestore,
// eslint-disable-next-line import/no-unresolved
} from './firebase-utils.js';

const createUser = (email, password) => {
  const auth = getAuth();
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      // const user = userCredential.user;
      // eslint-disable-next-line no-console
      console.log(`El usuario ${userCredential} fue creado!!!`);
    })
    .catch((error) => {
      const getDivError = document.getElementById('id-message-error-record');
      const errorCode = error.code === undefined ? '' : error.code;
      const errorMessage = error.message === undefined ? '' : error.message;
      // eslint-disable-next-line no-console
      console.log(errorCode);
      console.log(errorMessage);
      if (errorCode === 'auth/email-already-in-use') {
        getDivError.innerHTML = '<p>El usuario ya existe, inicie sesión</p>';
      } else {
        getDivError.innerHTML = '<p>Por favor ingresar correo electronico y/o contraseña validos</p>';
      }
    });
};

function existingUser(email, password) {
  const auth = getAuth();
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log(`El usuario ${user} se ha autenticado!!!`);
      // ...
    })
    .catch((error) => {
      const getDivError = document.getElementById('id-message-error-login');
      const errorCode = error.code === undefined ? '' : error.code;
      const errorMessage = error.message === undefined ? '' : error.message;
      // eslint-disable-next-line no-console
      console.log(errorCode);
      console.log(errorMessage);
      getDivError.innerHTML = '<p>Usuario o contraseña invalidos, por favor ingresar nuevamente</p>';
    });
}

let usuario;

function observerUserState() {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    usuario = user;
    if (user) {
      console.table(user);
      window.location.hash = '#wall';
    } else if (window.location.hash === '#wall') {
      // User is signed out
      window.location.hash = '';
    }
  });
}

const closeSession = () => {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
    })
    .catch((error) => {
      console.error(error);
    });
};

const provider = new GoogleAuthProvider();
console.log('provider: ', provider);

const signInWithGoogle = () => {
  const auth = getAuth();
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      console.log(`El usuario ${user} se ha autenticado!!!`);
    // ...
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error);
    });
};

/**
 * Esta funcion va a conectarse a fuirestore
 * Luego con el resultado que es una suscripcion (aun no sabes)
 * va a pintar en pantalla el resultado
 */
const getPostList = async () => {
  const db = getFirestore();
  const querySnapshot = await getDocs(collection(db, 'posts'));
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    console.log(`${doc.id} => ${data.user} ${data.thinking}`);
    /// html
    // botonoes hay que guardarlo
    // <button id="${doc.id}" onclick="editPost(id)"/>
  });
};
// El primer parametro es el uid del post y el segundo el pensamiento editado
const editPosts = (id, thinking) => {
  // usuario.displayName
  // usuario.email
  console.log(`${id} ${thinking}`);
};

const addPost = async (thinking) => {
  try {
    const db = getFirestore();
    const docRef = await addDoc(collection(db, 'posts'), {
      user: usuario.displayName,
      email: usuario.email,
      photoUrl: usuario.photoURL,
      thinking,
    });
    console.log('Document written with ID: ', docRef.id);
    getPostList();
  } catch (e) {
    console.error('Error adding document: ', e);
    // TODO: escribir la causa del error en la pantalla o algo asi como en los de auth
  }
};

export {
  createUser, existingUser, observerUserState, signInWithGoogle, closeSession, getPostList,
  addPost, editPosts,
};
