const profileContainer = document.getElementById('choose-pic')
const replceItem = document.getElementById('camera-logo')
const profileImageURI = `/images/uploads/<%= user.profile %>`

profileContainer.addEventListener('click', function(){
    document.querySelector('#file').click();
});

document.querySelector('#file').addEventListener('change', function(){
    document.querySelector('#submit-form').submit();
});

  const postIcon = document.getElementById('slectimage')
  const post = document.getElementById('footer-post')
  const close = document.getElementById('cross-close')

  postIcon.addEventListener('click', (ev)=>{
    post.style.display = 'block'
  });

  close.addEventListener('click', ()=>{
    const imgPreview = document.getElementById('imgPreview')
    post.style.display = 'none';
    imgPreview.innerHTML = '<p>No Images</p>'
    document.getElementById('dis-inp').value = null;
  });

  // image selector form body
  document.addEventListener('DOMContentLoaded', function(){
   const addImg = document.getElementById('addimg')
   const imgInput = document.getElementById('imgselector')
   const imgPreview = document.getElementById('imgPreview')
   addImg.addEventListener('click', ()=>{
      imgInput.click();
  });

  // selcting ad previewing img when posting
  imgInput.addEventListener('change', function(e){
    const file = e.target.files[0];
    if(file){
      const reder = new FileReader();

      reder.onload = function(ev){
        const imgElement = document.createElement('img')
        imgElement.src = ev.target.result;
        imgPreview.innerHTML = '';
        imgPreview.appendChild(imgElement);
      }
      reder.readAsDataURL(file);
    }
    else{
      imgPreview.innerHTML = '<p> No images </p>'
    }
  })

  
})

document.getElementById('post-btn').addEventListener('click', function(event){
  const postElem =  document.getElementById('imgselector').value.trim();
  const discValue = document.getElementById('dis-inp')
    if(!postElem || !discValue  ){
        event.preventDefault();
        alert('Select Post');
    }
    else{

        document.getElementById('post-submit').submit();
    }
});

// redirection of chat feed
const chatIcon = document.getElementById('chat-red')
chatIcon.addEventListener('click', function(){
  window.location.href = '/feed/chat';
});

// to showing the node element of post options like delete remove and block
document.addEventListener('DOMContentLoaded', () => {
  const threeDotElements = document.querySelectorAll('[data-id^="postDot-"]');
  
  if (threeDotElements.length === 0) {
    console.log('No post-three-dot elements found');
  }

  threeDotElements.forEach(element => {
    element.addEventListener('click', function() {
      const postID = this.getAttribute('data-id');
      console.log(postID);

      // Find the closest parent .option and then the .postOption within it
      const optionContainer = this.closest('.option');
      const postOption = optionContainer.querySelector('.postOption');

      console.log('Option container:', optionContainer);
      console.log('Post option:', postOption);

      if (postOption) {
        // Toggle the display property of the specific postOption
        postOption.style.display = (postOption.style.display === 'none' || postOption.style.display === '') ? 'block' : 'none';
      }
    });
  });
});

// delete the post
document.addEventListener('DOMContentLoaded', ()=>{
  document.querySelectorAll('.del').forEach(button => {
      button.addEventListener('click', function() {
        console.log('post deleteing...');
          const postID = this.closest('.post-area').dataset.id;
          fetch(`/feed/delete?postID=${postID}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ postID: postID })
          }).then(response => response.json()).then(data => {
              if(data.message) {
                  // Remove the post element from the DOM
                  document.getElementById(`post-${postID}`).remove();
                  location.reload();
                  alert(data.message);
              } else if (data.error) {
                  alert(data.error);
              }
          }).catch(error => console.error('Error:', error));
      });
  });
})

// redirection whenuser search something then riderect on another page

// document.querySelector('#serch-user').addEventListener('sumbit',function(e){
//   e.preventDefault;

//   const query = document.getElementById('searchInp').value.trim();

//   if(query){
//     window.location.href = `/feed/search/query=${encodeURIComponent(query)}`;
//   }
//   else{
//     console.log('plz enter the query you want to search');
//   }

// })