function getUrl(){
  const FR= new FileReader();                                    
  const form = new FormData();
  form.set('key','9304eb5630f3f1e2a368fa2ee7cf100f');
  form.set('image',document.getElementById("inp-value").value);
  fetch(https://api.imgbb.com/1/upload?key=9304eb5630f3f1e2a368fa2ee7cf100f,{
      method:'POST',
      body:form
  })
  .then(res => res.json())
  .then(data=>{
      document.getElementById("inp-value").value = data.data.image.url;
      console.log(data.data.image.url);
      document.getElementById("add-form").submit();
  });
}
function readFile() {
  if (this.files && this.files[0]) {                                 
      const FR= new FileReader();                                    
      FR.addEventListener("load", function(e) {
          document.getElementById("img").src = e.target.result;
          document.getElementById("inp-value").value = e.target.result.split(',')[1];
      });                                     
      FR.readAsDataURL( this.files[0] );
  }
}
document.getElementById("inp").addEventListener("change", readFile)
document.getElementById("btn-add").addEventListener("click",getUrl)