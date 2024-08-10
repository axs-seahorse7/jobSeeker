document.addEventListener('DOMContentLoaded', function(){
const searchInp = document.getElementById('searchInp')
const userSearchBox = document.getElementById('searchedUsers')

searchInp.addEventListener('input', ()=>{
    const query = searchInp.value.trim();
    
    // Reset clutter each time input changes
    let clutter = '';
    if(query){
    axios.get(`/username/${query}`)
    .then(function(data){
        if(data.data.length === 0){
            console.log("user not found")
        }
        else{
        data.data.forEach(function(elem){
            clutter += `
           <div  class="searchUserBox">
            <div class="user-acc">
                <div class="user-search-profile">
                <img src="/images/uploads/${elem.profile}">
                </div>
                <div class="user-name-bio">
                    <h4>${elem.username}</h4>
                    <h6>Engineer</h6>
                </div>
            </div>
        </div>
        `
        }) ;
    }  
      userSearchBox.innerHTML = clutter
    }); 
    }
    else{

      userSearchBox.innerHTML = '';
    }
   
});
});
