/*<li class="collection-item">
                <div>
                    <span>Tarea 1</span>
                    <i class="material-icons secondary-content">delete_forever</i>
                    <a href="#modal1" class="modal-trigger secondary-content">
                        <i class="material-icons">edit</i>
                    </a>
                </div>
add-tarea-form
            
</li> */

const lista = document.getElementById('lista-tareas');//de HTML
const form = document.getElementById('add-tarea-form');
const updateBtn = document.getElementById('updateBtn');
let updateId = null;
let newTitulo = '';

const renderList = (doc) => {

    let li = document.createElement('li');
    li.className = 'grey darken-3 collection-item';
    li.setAttribute('data-id', doc.id)//doc.id es lo que viene de firebase

    let div = document.createElement('div');
    let titulo = document.createElement('span');
    titulo.textContent = doc.data().titulo; //obtengo el valo de titulo de Firebase
    titulo.style.color = ' white'; //cambio el color

    //enlace
    let enlace = document.createElement('a');
    enlace.href = '#modal1';
    enlace.className = 'modal-trigger secondary-content';

    //boton EDIT
    let editBtn = document.createElement('i');
    editBtn.className = 'material-icons';
    editBtn.innerText = 'edit';//icono edit

    //boton DELETE
    let delBtn = document.createElement('i');
    delBtn.className = 'liaa material-icons secondary-content';
    delBtn.innerText = 'delete_forever';


    enlace.appendChild(editBtn);
    div.appendChild(titulo);
    div.appendChild(delBtn);
    div.appendChild(enlace);
    li.appendChild(div);


    //--- para borrar una tarea ---//

    delBtn.addEventListener('click', e => {
        //console.log(e.target.parentElement.parentElement.getAttribute('data-id'));
        //hacedo al id de la tarea a borrar(de padre a padre)
        let id = (e.target.parentElement.parentElement.getAttribute('data-id'));
        db.collection('tareas').doc(id).delete();        
    });

    //--- para actualizar una tarea ---//
    editBtn.addEventListener('click', e => {
        updateId = e.target.parentElement.parentElement.parentElement.getAttribute('data-id');
        
    });

    //lo agrego ala lista en el HTML
    lista.append(li);//lista es el id del HTML para agregarlo
}




//--- para actualizar --//
updateBtn.addEventListener('click', e =>{
    newTitulo = document.getElementsByName('newTitle')[0].value;
    db.collection('tareas').doc(updateId).update({
        titulo: newTitulo
    })
    document.getElementsByName('newTitle')[0].value = ''
})







form.addEventListener('submit',  e =>{
    e.preventDefault();

    //---agrego la tarea en firebase---//
    db.collection('tareas').add({
        titulo: form.titulo.value.toUpperCase(),//input con el nombre de titulo
    });
    form.titulo.value = '';
})








db.collection('tareas').orderBy('titulo').onSnapshot( snapshot =>{

    let cambios = snapshot.docChanges();//devuelve el documento si ya a tenido algun cambio

    cambios.forEach(cambio => {

        if (cambio.type == 'added') {
            
            renderList( cambio.doc )

        }else if (cambio.type == 'removed') {

            //-- para poder reflejar en el navegador(actualizar) --/
            let li = lista.querySelector(`[data-id=${cambio.doc.id}]`);
            lista.removeChild(li);

        }else if (cambio.type == 'modified') {
            
            //-- para actualizar la tarea en el navegador ---//
            let tituloNuevo = lista.querySelector(`[data-id=${cambio.doc.id}]`);
            tituloNuevo.getElementsByTagName('span')[0].textContent = newTitulo;
            newTitulo = '';

        }

    });
    
} )