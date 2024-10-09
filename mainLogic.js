const baseUrl = "https://tarmeezacademy.com/api/v1"

// Post Request
function createNewPostClicked()
    {
        const postId = document.getElementById("post-id-input").value

        let isCreate = postId == null || postId == ""
        const title = document.getElementById("post-title-input").value
        const body = document.getElementById("post-body-input").value
        const image = document.getElementById("post-image-input").files[0]
        const token = localStorage.getItem("token")

        let formData = new FormData()
        formData.append("body",body)
        formData.append("title",title)
        formData.append("image",image)
        
        let url = ``
        
        const headers = {
            "Content-Type":"multipart/form-data",
            "authorization": `Bearer ${token}`
        }
        if(isCreate)
        {
            url =`${baseUrl}/posts`
            
        }else{
            formData.append("_method", "put")
            url =`${baseUrl}/posts/${postId}`
        }
        toggleLoader(true)
        axios.post(url,formData,{
            headers: headers    
        })
        .then((response) => {
            const modal =document.getElementById("create-post-modal")
            const modalInstance = bootstrap.Modal.getInstance(modal)
            modalInstance.hide()
            showAlert("New Post has been created", "success")
            getPosts()
        })
        .catch((error) => {
            const message = error.response.data.message
            showAlert(message, "danger")
        })
        .finally(() => {
            toggleLoader(false)
        })
    }
function deletePostBtnClicked(postObject)
{
    
    let post = JSON.parse(decodeURIComponent(postObject))
    document.getElementById("delete-post-id-input").value = post.id
    let postModal = new bootstrap.Modal(document.getElementById("delete-post-modal"),{})
    postModal.toggle()
}
function confirmPostDelete()
{
    const postId = document.getElementById("delete-post-id-input").value
    const token = localStorage.getItem("token")
    const url = `${baseUrl}/posts/${postId}`
    const headers = {
        "Content-Type":"multipart/form-data",
        "authorization": `Bearer ${token}`
    }
    axios.delete(url ,{
        headers: headers    
    })
    .then((response) => {
        
    const modal =document.getElementById("delete-post-modal")
    const modalInstance = bootstrap.Modal.getInstance(modal)
    modalInstance.hide()
    showAlert("The Post has Been Deleted Successfully", "success")
    getPosts()
    })
    .catch((error) => {
        const message = error.response.data.message
        showAlert(message, "danger")
    })
}
function editPostBtnClicked(postObject)
{
    let post = JSON.parse(decodeURIComponent(postObject))
    document.getElementById("post-modal-submit-btn").innerHTML = "Update"
    document.getElementById("post-id-input").value = post.id
    document.getElementById("post-modal-title").innerHTML = "Edit Post"
    document.getElementById("post-title-input").value = post.title
    document.getElementById("post-body-input").value = post.body

    let postModal = new bootstrap.Modal(document.getElementById("create-post-modal"),{})
    postModal.toggle()

}
function setupUI()
            {
                const token = localStorage.getItem("token")
                const loginDiv = document.getElementById("logged-in-div")
                const logoutDiv = document.getElementById("logout-dev")
                const addBtn = document.getElementById("add-btn")

                

                if (token == null ) //user is guest (not logged in)
            {
                if(addBtn != null)
                {
                    addBtn.style.setProperty("display","none","important")

                }
                logoutDiv.style.setProperty("display","none","important")
                loginDiv.style.setProperty("display","flex","important") 


            }else {//for logged in user
                if(addBtn != null)
                    {
                        addBtn.style.setProperty("display","block","important")
    
                    }
                logoutDiv.style.setProperty("display","flex","important")
                loginDiv.style.setProperty("display","none","important") 
                const user = getCurrenUser()
                document.getElementById("nav-username").innerHTML = user.username
                document.getElementById("nav-user-image").src = user.profile_image
            }
            
            }
            // Start Auth Function

function loginBtnClicked()
{
    const username = document.getElementById("username-input").value
    const password = document.getElementById("password-input").value
    const params = {
    username:username,
    password:password

}
toggleLoader(true)
const url = `${baseUrl}/login`
axios.post(url,params)
.then((response) => {
    toggleLoader(false)
    localStorage.setItem ("token", response.data.token)
    localStorage.setItem ("user", JSON.stringify(response.data.user))

    const modal =document.getElementById("login-modal")
    const modalInstance = bootstrap.Modal.getInstance(modal)
    modalInstance.hide()
    showAlert("logged in is successfuly", "success")
    setupUI()
})
.catch((error) => {
    const message = error.response.data.message
    showAlert(message, "danger")
})
.finally(() => {
    toggleLoader(false)
})

}
function registerBtnClicked()
{
    const name = document.getElementById("register-name-input").value
    const username = document.getElementById("register-username-input").value
    const password = document.getElementById("register-password-input").value
    const image = document.getElementById("register-image-input").files[0]

    let formData = new FormData()
    formData.append("name",name)
    formData.append("username",username)
    formData.append("password",password)
    formData.append("image",image)

    const headers = {
        "Content-Type":"multipart/form-data"
    }
    toggleLoader(true)
    const url = `${baseUrl}/register`
    axios.post(url,formData,{
        headers: headers
    })
    .then((response) => {
        
        localStorage.setItem ("token", response.data.token)
        localStorage.setItem ("user", JSON.stringify(response.data.user))

        const modal =document.getElementById("register-modal")
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        showAlert("New User Registered is successfuly", "success")
        setupUI()
    }).catch((error) => {
        
        const message = error.response.data.message
        showAlert(message, "danger")  
    })
    .finally(() => {
        toggleLoader(false)
    })

}
function logout() 
{
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    showAlert("logged out is successfuly", "success")
    setupUI()
}
function showAlert(customeMessage,type)
    {
    const alertPlaceholder = document.getElementById('success-alert')
    const appendAlert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('')

    alertPlaceholder.append(wrapper)
    }
        appendAlert(customeMessage, type)
        //todo : hide the alert
        setTimeout(() => {
            const alertToHide = bootstrap.Alert.getOrCreateInstance('#success-alert')
            //alertToHide.close()
        },2000)
    }   
function getCurrenUser ()
{
    let user = null
    const storageUser = localStorage.getItem("user")
    if(storageUser != null)
    {
        user = JSON.parse(storageUser)
    }  
    return user
}
function profileClicked () 
{
    const user = getCurrenUser()
    const userId = user.id
    window.location = `profile.html?userid=${userId}`

}
function toggleLoader (show )
{
    if(show)
    {
        document.getElementById("loader").style.visibility = 'visible'
    }else{
        document.getElementById("loader").style.visibility = 'hidden'
    }
}