document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').onsubmit = send_email;

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#email-content').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value;
  document.querySelector('#compose-subject').value;
  document.querySelector('#compose-body').value;
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-content').style.display = 'none';


  // Show the mailbox name
  if (mailbox == 'inbox'){
    document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
    fetch(`/emails/${mailbox}`)
    .then(response => { 
      if(!response.ok){
        console.log('Invalid calling')
      }
      return response.json()
    })
    .then(emails => {
      emails.forEach(email => {
        console.log(email)
        const newEmail = document.createElement('div');
        const button = document.createElement('button');
        button.innerHTML = 'Add to archive'
        button.className = "btn btn-info";
        newEmail.id = 'newid';
        newEmail.className = 'list-group-item';
        newEmail.innerHTML = `
        <h3> Sender: ${email.sender}</h3>
        <h5> Subject: ${email.subject}</h5>
        <h6> ${email.timestamp}</h6>
        `
        newEmail.append(button)
        newEmail.classList.add('space');
        if(email.read == true){
          newEmail.classList.add('read');
        }
        if(email.read == false){
          newEmail.classList.add('unread');
        }
        button.addEventListener('click', (event) => {
          event.stopPropagation(); 
          add_to_archive(email.id);
        });
        newEmail.addEventListener('click', function() {
          open_email(email.id);
        });
        document.querySelector('#emails-view').append(newEmail);
      });
  })
  }

  if (mailbox == 'sent'){
    document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
    fetch(`/emails/${mailbox}`)
    .then(response => { 
      if(!response.ok){
        console.log('Invalid calling')
      }
      return response.json()
    })
    .then(emails => {
      emails.forEach(email => {
        console.log(email)
        const newEmail = document.createElement('div');
        newEmail.id = 'newid';
        newEmail.className = 'list-group-item';
        newEmail.innerHTML = `
        <h3> Sender: ${email.sender}</h3>
        <h5> Subject: ${email.subject}</h5>
        <h6> ${email.timestamp}</h6>
        `
        newEmail.classList.add('space');
        if(email.read == true){
          newEmail.classList.add('read');
        }
        if(email.read == false){
          newEmail.classList.add('unread');
        }
        newEmail.addEventListener('click', function() {
          open_email(email.id);
        });
        document.querySelector('#emails-view').append(newEmail);
      });
  })
  }
  if (mailbox == 'archive'){
    document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
    fetch(`/emails/${mailbox}`)
    .then(response => { 
      if(!response.ok){
        console.log('Invalid calling')
      }
      return response.json()
    })
    .then(emails => {
      emails.forEach(email => {
        console.log(email)
        const newEmail = document.createElement('div');
        const button1 = document.createElement('button');
        button1.innerHTML = 'Remove from archive'
        button1.className = "btn btn-danger";
        newEmail.id = 'newid';
        newEmail.className = 'list-group-item';
        newEmail.innerHTML = `
        <h3> Sender: ${email.sender}</h3>
        <h5> Subject: ${email.subject}</h5>
        <h6> ${email.timestamp}</h6>
        `
        newEmail.append(button1)
        newEmail.classList.add('space');
        if(email.read == true){
          newEmail.classList.add('read');
        }
        if(email.read == false){
          newEmail.classList.add('unread');
        }
        button1.addEventListener('click', (event) => {
          event.stopPropagation(); 
          remove_from_archive(email.id);
        });
        newEmail.addEventListener('click', function() {
          open_email(email.id);
        });
        document.querySelector('#emails-view').append(newEmail);
      });
  })
  }
}


function send_email(){
  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body: body
    })
  })
  .then(response => response.json())
  .then(result => {
      // Print result
      console.log(result);
      load_mailbox('sent')
  });
  return false;
}

function open_email(id){
  document.querySelector('#email-content').innerHTML = '';
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-content').style.display = 'block';
  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
    document.querySelector('#emails-view').innerHTML = ''
    const newEmail = document.createElement('div');
    const button2 = document.createElement('button');
    button2.className = 'btn btn-success';
    button2.innerHTML = 'Reply';
    newEmail.className = 'list-group-item';
    newEmail.innerHTML = `
    <p> From: ${email.sender}</p>
    <p> to: ${email.recipients} </p>
    <p> subject: ${email.subject} </p>
    <p> ${email.body}</p>
    <p> ${email.timestamp}</p>
    `
    if (email.sender)
    newEmail.append(button2);
    fetch(`/emails/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
          read : true
      })
    })
    button2.addEventListener('click', (event) =>{
      event.stopPropagation();
      reply_email(email.id);
    })
    document.querySelector('#email-content').append(newEmail)
      // Print email
      console.log(email);

      // ... do something else with email ...
  });
}

function add_to_archive(id){
  document.querySelector('#email-content').innerHTML = ''
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
        archived: true
    })
  })
  load_mailbox('inbox')
  console.log('hello')
}

function remove_from_archive(id){
  document.querySelector('#email-content').innerHTML = ''
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
        archived: false
    })
  })
  load_mailbox('inbox')
}

function reply_email(id) {
  compose(id)
  console.log('hello')
}

function compose(id){
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#email-content').style.display = 'none';
  fetch(`emails/${id}`)
  .then(response => response.json())
  .then(email => {
    document.querySelector("#compose-recipients").value = email.sender;
    if (email.subject.slice(0,3) == 'Re:'){
      document.querySelector('#compose-subject').value = email.subject;
    }
    else{
      document.querySelector('#compose-subject').value = `Re: ${email.subject}`;
    }
    document.querySelector('#compose-body').value = `On ${email.timestamp} ${email.sender} wrote: ${email.body}`
  })
}