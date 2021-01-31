//ДЛЯ ЗАПУСКА ПРОСТО ВВЕДИТЕ В ТЕРМИНАЛ json-server --watch db.json

$(document).ready(() => {
    let API = 'http://localhost:3000/product';
    let inputName = $('.inputName');
    let inputSurname = $('.inputSurname');
    let inputPhone = $('.inputPhone'); 
    let inputImg = $('#input-img');
    let inputNal = $('.inputNal');
    let inputTelephone = $('.inputTelephone');
    let inputSeller = $('.inputSeller');
    let page = 1;
    let pageCount = 1;
    let searchText = '';


    
    $('.search-inp').on('input', function(e){
        searchText = e.target.value;
        page = 1;
        render();
    })

    $('.close-btn').on('click', function(){
        $('#main-modal').css('display', "none");
    })

    $('.add-product').on('click', function(){
        $('#main-modal').css('display', "block");
    })
    
    function getPagination(){
        fetch(`${API}?&q=${searchText}`)
            .then(res => res.json())
            .then(data => {
                console.log(data.length)
                pageCount = Math.floor(data.length / 8);
                $('.pagination-page').remove();
                for(let i = pageCount; i >= 1; i--){
                    $('.prev-btn').after(`
                        <span class="pagination-page" >
                            <a href='#tovary'>${i}</a>
                        </span>
                    `)
                }
            })
    }
    
    $('.submit').click(() => {  // событие на котором все данные с инпутов собираются
        console.log(inputName.val());
        if(inputName.val() && inputSurname.val() && inputPhone.val() && inputImg.val() && inputTelephone.val() && inputNal.val() && inputSeller.val()){
                let contact = {
                    "name": inputName.val(), 
                    "surname": inputSurname.val(), 
                    "seller": inputSeller.val(),
                    "nalichie": inputNal.val(),
                    "telephone": inputTelephone.val(),
                    "phone": inputPhone.val(),
                    'img': inputImg.val()
                }
                fetchData(contact);
        } else {
            alert('Fill the fields')
        }
    })
    
    $('.next-btn').click(function(){
        if(page === pageCount) return;
        page++;
        render();
    })
    
    $('.prev-btn').click(function(){
        if(page === 1) return;
        page--;
        render();
    })
    
    function fetchData(data){  //Отправка данных на сервер
        fetch(API, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            }
        }).then(() => render())
    }

    $('#input-img').on('input', function(e){
        console.log(e.target);
    })
    
    function render(){  //Рендерим данные с сервера
        fetch(`${API}?_page=${page}&_limit=8&q=${searchText}`)
            .then(response => response.json())
            .then(data => {
                $('.contacts-menu').html('');
                $('.contacts-menu').css('display', 'flex')
                $('.contacts-menu').css('flex-wrap', 'wrap')
                getPagination();
                data.forEach((item) => {
                    $('.contacts-menu').append(`
                        <div style="border-radius: 30px" id="card${item.id}" class="card col-12 col-md-4 col-lg-3 m-5 p-3">
                            <img class='img-item' src='${item.img}'/>
                            <h4 style="color:black" id="name${item.id}" >${item.name}</h3>
                            <h4 style="color:black" id="surname${item.id}" >${item.surname}</h3>
                            <h5 style="color:black" id="phone${item.id}" >Price: ${item.phone}</h4>
                            <h5 style="color:black"> Продавец: ${item.seller} </h5>
                            <h5 style="color:black"> Наличие: ${item.nalichie} </h5>
                            <h5 style="color:black"> Телефон: ${item.telephone} </h5>
                            <button style="height: 50px" id='${item.id}' type="button" class="btn btn-primary deleteBtn">Delete</button>
                            <button style="height: 50px" class="btn btn-primary mt-1" id='edit${item.id}'>Edit</button>
                        </div>
                        `)
                        let deleteBtn = $(`#${item.id}`);
                        deleteBtn.click(() => {
                            deleteContact(item.id);
                        })
    
                        $(`#edit${item.id}`).click(() => {
                            $(`#card${item.id}`).html(`
                                <input class="m-2" id="editImg${item.id}" value="${item.img}" >
                                <input class="m-2" id="editName${item.id}" value="${item.name}" >
                                <input class="m-2" id="editSurname${item.id}" value="${item.surname}" >
                                <input class="m-2" id="editPhone${item.id}" value="${item.phone}" >
                                <input class="m-2" id="editTelephone${item.id}" value="${item.telephone}" >
                                <input class="m-2" id="editSeller${item.id}" value="${item.seller}" >
                                <input class="m-2" id="editNalichie${item.id}" value="${item.nalichie}" >
                                <button id='submit${item.id}' type="button" style="height: 50px" class="btn btn-primary">Submit</button>
                            `)
                            $(`#submit${item.id}`).click(() => {
                                let updatedData = {
                                    "name": $(`#editName${item.id}`).val(),
                                    "surname": $(`#editSurname${item.id}`).val(),
                                    "phone": $(`#editPhone${item.id}`).val(),
                                    "img": $(`#editImg${item.id}`).val(),
                                    "seller": $(`#editSeller${item.id}`).val(),
                                    "nalichie": $(`#editNalichie${item.id}`).val(),
                                    "telephone": $(`#editTelephone${item.id}`).val(),

                                }
                                updateContact(item.id, updatedData);
                            })
                        })
    
                        
                })  
            })
    }
    
    function deleteContact(id){  // функция на удаление элемента по ид
        fetch(`${API}/${id}`, {
            method: 'DELETE',
        }).then(() => render())
    }
    
    function updateContact(id, data){ // функция на изменение элемента по ид
        fetch(`${API}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            }
        }).then(() => render());
    }
    
    $('body').on('click', '.pagination-page', function(e){
        page = e.target.innerText;
        render();
    })
    
    render()
    })