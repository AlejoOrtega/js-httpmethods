'use strict'

// API
/**
 * Create an unique hash code
 * @returns string
 */
function uuidv4() {
	return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
		(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
	);
}

const studentUrl = 'http://localhost:3000/students';
const ul = document.querySelector(".students__list")
const form = document.getElementById('dataForm');
const updateForm = document.getElementById('updateDataForm');
let idSelected='';

/**
 * Get all data from the Server
 * @param url string
 */
const getData = async (url) => {
	let response = await fetch(url);
	let data = await response.json();
	return data
}

const deleteInformation = (id) => {
	fetch(studentUrl+`/${id}`,{
		method:'DELETE'
	}).then(()=>{
		printList(ul, getData(studentUrl));
	})
}

const setUpdateForm = (id, name, surname, register) => {
	const form = document.getElementById('updateDataForm')
	console.log(id, name, surname, register);
	idSelected = id;
	form.children[0].value = id;
	form.children[1].value = name;
	form.children[2].value = surname;
	form.children[3].value = register;
	form.children[4].disabled = false;
	
}


/**
 * Print the list of element got from server
 * @param element - HTMLElement
 * @param items - Array 
 */
const printList = async (element, items) => {
	element.innerHTML = '';
	let data = [];
	data = await items;

	for (let i = 0; i < data.length; i++) {
		element.innerHTML += `
		<li>
			<div class="student" onclick="setUpdateForm('${data[i].id}','${data[i].name}','${data[i].surname}','${data[i].register}')">
				<p><span class="bold">ID: </span>${data[i].id}</p>
				<p><span class="bold">Name: </span>${data[i].name}</p>
				<p><span class="bold">Surname: </span>${data[i].surname}</p>
				<p><span class="bold">Register: </span>${data[i].register}</p>
				<input type="button" value="Delete" onclick="deleteInformation('${data[i].id}')"/>
			</div>
		</li>
		`
	}
}

/**
 * Get data from the Form and send them to the server
 */
form.addEventListener('submit', (e) => {
	e.preventDefault();
	// Creates a new object that conintains all the data from the form
	const prePayload = new FormData(form);
	prePayload.append("id", uuidv4());
	const payload = new URLSearchParams(prePayload);

	fetch(url, {
		method: 'POST',
		body: payload
	})
		.then(res => {
			// if the post has not succesfull throw and error
			if (!res.ok) {
				throw new Error("The some problem with you request");
			}
			// if the post is succesfull the page will be updates
			printList(ul, getData(url));
			return res.json();
		})

})

updateForm.addEventListener('submit',(e, url)=>{
	e.preventDefault();
	const prePayload = new FormData(updateForm);
	const payload = new URLSearchParams(prePayload);
	fetch(studentUrl+`/${idSelected}`, {
		method: 'PATCH',
		body: payload
	})
		.then(res => {
			// if the post has not succesfull throw and error
			if (!res.ok) {
				throw new Error("The some problem with you request");
			}
			// if the post is succesfull the page will be updates
			printList(ul, getData(url));
			return res.json();
		})
})


/**
 * On page load all the data are retrieved
 */
window.onload = printList(ul, getData(studentUrl));
