
//1️⃣ getting data
// db.collection('students').get().then((snapshot) => {

//     //to get specific data => db.collection('students').where('city', '==', 'Mumbai').get()
//     //to get data in specific order s=> db.collection('students').orderBy('name').get()
//     //both at same time => db.collection('students').where('city', '==', 'Mumbai').orderBy('name').get()

//     // console.log(snapshot.docs)
//     snapshot.docs.forEach(doc => {
//         // console.log(doc.data())
//         renderStudents(doc)
//     })
// })

//2️⃣ getting data in real-time (changes reflects in UI without refresh)

db.collection('students').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if (change.type == 'added') {
            renderStudents(change.doc)
        } else if (change.type == 'removed') {
            let li = studentList.querySelector('[data-id=' + change.doc.id + ']');
            studentList.removeChild(li);
        }
    })
})

const studentList = document.getElementById('student-list');

//create element and render student

const renderStudents = (doc) => {
    let li = document.createElement('li');
    let name = document.createElement('span');
    let city = document.createElement('span');
    let cross = document.createElement('div');

    li.setAttribute('data-id', doc.id)
    name.textContent = doc.data().name;
    city.textContent = doc.data().city;
    cross.textContent = 'x';

    li.appendChild(name);
    li.appendChild(city);
    li.appendChild(cross);

    studentList.appendChild(li);

    //deleting data
    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('students').doc(id).delete();
    })

}

//Adding data to firestore through frontend

form = document.getElementById('add-student-form');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (form.name.value != "" && form.city.value != "") {
        db.collection('students').add({
            city: form.city.value,
            name: form.name.value
        })
        form.city.value = "";
        form.name.value = "";
    } else {
        alert("Empty fields")
    }

})

