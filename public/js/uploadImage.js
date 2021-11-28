function upload() {
  const ref = firebase.storage().ref();
  const file = document.querySelector("#fileImageProduct").files[0];
  const metaData = {
    contentType: file.type,
  };
  const name = file.name;
  const uploadImage = ref.child(name).put(file, metaData);

  let urlImage = "";

  return uploadImage
    .then((snapshot) => snapshot.ref.getDownloadURL())
    .then((url) => {
      urlImage = url;
      console.log(urlImage);
      return urlImage;
    })
    .catch((error) => {
      console.log(error);
    });
}
